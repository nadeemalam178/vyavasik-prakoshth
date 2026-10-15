import http.server
import socketserver
import json
import urllib.request
import threading
import time
import os
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from process_data import process_all_data

PORT = 3000
SHEET_ID = '1CifDZWm_rhf6abDpKf-5ZH2hLQnFTmJZoaNssKZjA_g'
SHEET_URL = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=xlsx'

sync_lock = threading.Lock()
last_sync_time = None
last_sync_status = "Initialized from local cache"

def sync_from_google_sheets():
    global last_sync_time, last_sync_status
    with sync_lock:
        print("[SYNC] Fetching live Google Sheets export...")
        req = urllib.request.Request(SHEET_URL, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                if len(data) < 5000:
                    raise Exception(f"Downloaded file too small: {len(data)} bytes")
                with open('data.xlsx', 'wb') as f:
                    f.write(data)
                
            print(f"[SYNC] Downloaded {len(data)} bytes. Reprocessing...")
            processed = process_all_data('data.xlsx')
            
            with open('dashboard_data.json', 'w', encoding='utf-8') as f:
                json.dump(processed, f, ensure_ascii=False, indent=2)
                
            with open('data.js', 'w', encoding='utf-8') as f:
                f.write('window.DASHBOARD_DATA = ' + json.dumps(processed, ensure_ascii=False) + ';')
                
            last_sync_time = processed.get('last_updated')
            last_sync_status = "Live Synced with Google Sheets"
            print(f"[SYNC] Success! Updated at {last_sync_time}")
            return True, processed
        except Exception as e:
            last_sync_status = f"Sync Error: {str(e)}"
            print(f"[SYNC ERROR] {e}")
            return False, str(e)

def background_sync_worker():
    """Periodically check and refresh Google Sheet in the background every 60 seconds."""
    time.sleep(10) # Initial wait
    while True:
        try:
            sync_from_google_sheets()
        except Exception as err:
            print(f"[BACKGROUND SYNC ERROR] {err}")
        time.sleep(60)

class CustomDashboardHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # API: Sync Live Google Sheets
        if self.path == '/api/sync':
            success, result = sync_from_google_sheets()
            self.send_response(200 if success else 500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response_payload = {
                'status': 'success' if success else 'error',
                'last_updated': last_sync_time,
                'message': last_sync_status,
                'data': result if success else None
            }
            self.wfile.write(json.dumps(response_payload, ensure_ascii=False).encode('utf-8'))
            return

        # API: Get Current Data
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                with open('dashboard_data.json', 'r', encoding='utf-8') as f:
                    content = f.read()
                self.wfile.write(content.encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        # API: Sync Status
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            status_payload = {
                'last_updated': last_sync_time,
                'status': last_sync_status,
                'sheet_id': SHEET_ID
            }
            self.wfile.write(json.dumps(status_payload).encode('utf-8'))
            return

        # Fallback to standard static file serving
        return super().do_GET()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    # Start background auto-sync thread
    sync_thread = threading.Thread(target=background_sync_worker, daemon=True)
    sync_thread.start()

    with ThreadedTCPServer(("", PORT), CustomDashboardHandler) as httpd:
        print(f"[SERVER] Live Sync Server running at http://localhost:{PORT}")
        print(f"[SERVER] Connected to Google Sheets ID: {SHEET_ID}")
        httpd.serve_forever()

if __name__ == '__main__':
    run_server()
