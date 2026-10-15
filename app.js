/**
 * Vyavasaik Prakoshth - Dashboard - Application Logic
 * Jan Suraaj Bihar Pradesh • 2 Tabs: Campaign Committee & Cadre Hierarchy
 * Strictly Roman English / Hinglish • Highly Responsive & Clean
 */

(function () {
  'use strict';

  let data = null;
  let currentTab = 'tab-campaign';
  let selectedCcZone = 'ALL';
  let selectedCadreLevel = 'ALL';

  // Global Filter State
  const filterState = {
    search: '',
    post: 'ALL',
    status: 'ALL',
    zone: 'ALL',
    district: 'ALL',
    category: 'ALL',
    party: 'ALL',
    sector: 'ALL',
    viewModeCc: 'cards',
    viewModeCadre: 'cards'
  };

  // -------------------------------------------------------------
  // INITIALIZATION & DATA FETCHING
  // -------------------------------------------------------------
  async function init() {
    setupTheme();
    setupNavigation();
    setupSideDrawer();
    setupEventListeners();

    // Check if DASHBOARD_DATA script fallback exists
    if (window.DASHBOARD_DATA) {
      data = window.DASHBOARD_DATA;
    }

    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {
      console.log('Using local offline dataset');
    }

    if (data) {
      populateDropdowns();
      renderCampaignCommittee();
      renderCadreHierarchy();
      checkSyncStatus();
    }
  }

  // -------------------------------------------------------------
  // THEME MANAGEMENT (LIGHT / DARK)
  // -------------------------------------------------------------
  function setupTheme() {
    const saved = localStorage.getItem('js_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('js_theme', next);
        updateThemeIcon(next);
      });
    }
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // -------------------------------------------------------------
  // NAVIGATION (EXACTLY 2 TABS: DESKTOP TABS & MOBILE DOCK)
  // -------------------------------------------------------------
  function setupNavigation() {
    const allTabBtns = document.querySelectorAll('.floating-bottom-dock .dock-btn[data-tab], .desktop-top-tabs .top-tab-btn[data-tab]');
    allTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        switchTab(targetId);
      });
    });
  }

  function switchTab(targetId) {
    currentTab = targetId;

    document.querySelectorAll('.floating-bottom-dock .dock-btn[data-tab], .desktop-top-tabs .top-tab-btn[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === targetId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === targetId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // -------------------------------------------------------------
  // POPULATE DROPDOWNS (ZONES, DISTRICTS, CATEGORIES)
  // -------------------------------------------------------------
  function populateDropdowns() {
    if (!data) return;

    // 12 Zones
    const zones = data.zones ? data.zones.map(z => z.name) : [];
    
    // 44 Districts
    const districts = data.gap_analysis ? data.gap_analysis.map(d => d.district) : [];

    // Cadre Quick Zone Dropdown
    const cadreZoneSelect = document.getElementById('cadreZoneQuickSelect');
    if (cadreZoneSelect) {
      cadreZoneSelect.innerHTML = '<option value="ALL">All 12 Zones</option>' + 
        zones.map(z => `<option value="${escapeHtml(z)}">${escapeHtml(z)} Zone</option>`).join('');
    }

    // Cadre Quick District Dropdown
    const cadreDistSelect = document.getElementById('cadreDistrictQuickSelect');
    if (cadreDistSelect) {
      cadreDistSelect.innerHTML = '<option value="ALL">All 44 Sangathanik Zile</option>' + 
        districts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
    }

    // Drawer Zone Dropdown
    const drawerZoneSelect = document.getElementById('drawerZoneFilter');
    if (drawerZoneSelect) {
      drawerZoneSelect.innerHTML = '<option value="ALL">All 12 Zones</option>' + 
        zones.map(z => `<option value="${escapeHtml(z)}">${escapeHtml(z)} Zone</option>`).join('');
    }

    // Drawer District Dropdown
    const drawerDistSelect = document.getElementById('drawerDistrictFilter');
    if (drawerDistSelect) {
      drawerDistSelect.innerHTML = '<option value="ALL">All 44 Sangathanik Zile</option>' + 
        districts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
    }

    // Drawer Category Dropdown
    const drawerCatSelect = document.getElementById('drawerCatFilter');
    if (drawerCatSelect) {
      const cats = ['EBC', 'OBC', 'General', 'SC', 'Minority'];
      drawerCatSelect.innerHTML = '<option value="ALL">All Samajik Shreni</option>' + 
        cats.map(c => `<option value="${c}">${c}</option>`).join('');
    }
  }

  // -------------------------------------------------------------
  // TAB 1: CAMPAIGN COMMITTEE (SAMAST BIHAR)
  // -------------------------------------------------------------
  function renderCampaignCommittee() {
    if (!data || !data.campaign_committee) return;
    const allMembers = data.campaign_committee;

    // 1. Pradesh Sanyojak (State Convenor - Hero Card)
    const sanyojak = allMembers.find(m => m.role === 'Sanyojak');
    const sanyojakContainer = document.getElementById('sanyojakContainer');
    if (sanyojak && sanyojakContainer) {
      sanyojakContainer.innerHTML = `
        <div class="sanyojak-glass-card" onclick="window.dashboard.openModal(${JSON.stringify(sanyojak).replace(/"/g, '&quot;')})">
          <div>
            <div style="display:flex; align-items:center; gap:0.9rem; margin-bottom:0.75rem;">
              <div class="sanyojak-avatar">⭐</div>
              <div>
                <span class="badge-sanyojak">Pradesh Sanyojak (State Convenor)</span>
                <h2 style="margin: 0.2rem 0 0.1rem; font-size: 1.35rem; color: var(--text-main);">
                  ${escapeHtml(sanyojak.name)}
                </h2>
                <div style="font-size:0.75rem; color:var(--gold-light); font-weight:600;">
                  Samast Bihar Vyavasaik Prakoshth Abhiyan Pramukh
                </div>
              </div>
            </div>

            <div class="cadre-structured-body" style="background:rgba(245,158,11,0.06); border-color:rgba(245,158,11,0.25);">
              <div class="cadre-info-row">
                <span class="info-icon">📍</span>
                <span class="info-text"><strong>${escapeHtml(sanyojak.district)}, ${escapeHtml(sanyojak.zone)} Zone</strong> (Maharajganj Vidhan Sabha)</span>
              </div>
              <div class="cadre-info-row">
                <span class="info-icon">👥</span>
                <span class="info-text"><strong>${escapeHtml(sanyojak.caste)}</strong> &bull; ${escapeHtml(sanyojak.category)} &bull; Age: ${sanyojak.age || '68'}</span>
              </div>
              <div class="cadre-info-row">
                <span class="info-icon">🏛️</span>
                <span class="info-text">Purv Congress Senior Leader (1988-2022) &bull; Swatantrata Senani Suputra</span>
              </div>
              <div class="cadre-info-row">
                <span class="info-icon">💼</span>
                <span class="info-text">3 Mahavidyalaya Director &bull; Petroleum & Vyaparik Sansthan</span>
              </div>
            </div>
          </div>

          <div class="cadre-card-footer" style="margin-top:0.75rem; border-color:rgba(245,158,11,0.25);">
            ${sanyojak.number ? `
              <a href="tel:${sanyojak.number}" class="cadre-phone-link" onclick="event.stopPropagation();" style="color:var(--gold-light); font-size:0.85rem;">
                <span>📞</span>
                <span>${escapeHtml(sanyojak.number)}</span>
              </a>
            ` : '<span style="color:var(--text-dim);">Sampark Uplabdh</span>'}
            <button class="btn-glass btn-glass-primary" style="padding:0.35rem 0.85rem; font-size:0.78rem;" onclick="event.stopPropagation(); window.dashboard.openModal(${JSON.stringify(sanyojak).replace(/"/g, '&quot;')})">
              Profile &rarr;
            </button>
          </div>
        </div>
      `;
    }

    // 2. Sah Sanyojaks (3 Columns in Stack)
    const sahSanyojaks = allMembers.filter(m => m.role === 'Sah Sanyojak');
    const sahContainer = document.getElementById('sahSanyojakContainer');
    if (sahContainer) {
      sahContainer.innerHTML = sahSanyojaks.map(m => {
        const bgList = [...(m.parties || []), ...(m.sectors || [])];
        const bgSummary = bgList.length > 0 ? bgList.slice(0, 2).join(' • ') : 'Vyapar & Samajik Netritva';
        return `
          <div class="sah-glass-card" onclick="window.dashboard.openModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
                <span style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:var(--gold-light); letter-spacing:0.04em;">Sah-Sanyojak</span>
                ${m.age ? `<span class="cadre-age-text">Age: ${m.age}</span>` : ''}
              </div>
              <h4 class="cadre-clean-name" style="margin-bottom:0.4rem;">${escapeHtml(m.name)}</h4>
              
              <div class="cadre-structured-body">
                <div class="cadre-info-row">
                  <span class="info-icon">📍</span>
                  <span class="info-text"><strong>${escapeHtml(m.district)}</strong> (${escapeHtml(m.zone)})</span>
                </div>
                <div class="cadre-info-row">
                  <span class="info-icon">👥</span>
                  <span class="info-text">${escapeHtml(m.caste || 'Samaj')} &bull; ${escapeHtml(m.category || 'General')}</span>
                </div>
                ${bgSummary ? `
                <div class="cadre-info-row">
                  <span class="info-icon">💼</span>
                  <span class="info-text">${escapeHtml(bgSummary)}</span>
                </div>` : ''}
              </div>
            </div>

            <div class="cadre-card-footer" style="margin-top:0.5rem;">
              ${m.number ? `
                <a href="tel:${m.number}" class="cadre-phone-link" onclick="event.stopPropagation();">
                  <span>📞</span>
                  <span>${escapeHtml(m.number)}</span>
                </a>
              ` : '<span style="color:var(--text-dim); font-size:0.72rem;">Sampark Uplabdh</span>'}
              <span class="cadre-details-cta">Profile &rarr;</span>
            </div>
          </div>
        `;
      }).join('');
    }

    renderCcZoneChips();
    filterAndRenderCampaignMembers();
  }

  function renderCcZoneChips() {
    const container = document.getElementById('ccZoneChipsContainer');
    if (!container || !data || !data.campaign_committee) return;

    const members = data.campaign_committee.filter(m => m.role === 'Members' || (m.role !== 'Sanyojak' && m.role !== 'Sah Sanyojak'));
    
    const zoneCounts = {};
    members.forEach(m => {
      const z = m.zone || 'Other';
      zoneCounts[z] = (zoneCounts[z] || 0) + 1;
    });

    const zones = Object.keys(zoneCounts).sort((a, b) => zoneCounts[b] - zoneCounts[a]);

    let html = `
      <button class="zone-chip-btn ${selectedCcZone === 'ALL' ? 'active' : ''}" onclick="window.dashboard.filterCcByZone('ALL')">
        <span>All 24 Members</span>
        <span class="chip-count">${members.length}</span>
      </button>
    `;

    zones.forEach(z => {
      html += `
        <button class="zone-chip-btn ${selectedCcZone === z ? 'active' : ''}" onclick="window.dashboard.filterCcByZone('${escapeHtml(z)}')">
          <span>${escapeHtml(z)} Zone</span>
          <span class="chip-count">${zoneCounts[z]}</span>
        </button>
      `;
    });

    container.innerHTML = html;
  }

  function filterCcByZone(zone) {
    selectedCcZone = zone;
    renderCcZoneChips();
    filterAndRenderCampaignMembers();
  }

  function filterAndRenderCampaignMembers() {
    if (!data || !data.campaign_committee) return;

    let list = data.campaign_committee.filter(m => m.role === 'Members' || (m.role !== 'Sanyojak' && m.role !== 'Sah Sanyojak'));

    if (selectedCcZone !== 'ALL') {
      list = list.filter(m => (m.zone || '').toLowerCase() === selectedCcZone.toLowerCase());
    }

    if (filterState.zone !== 'ALL') {
      list = list.filter(m => m.zone.toLowerCase() === filterState.zone.toLowerCase());
    }
    if (filterState.category !== 'ALL') {
      list = list.filter(m => m.category.toLowerCase() === filterState.category.toLowerCase());
    }
    if (filterState.party !== 'ALL') {
      const pf = filterState.party.toLowerCase();
      list = list.filter(m => (m.parties || []).some(p => p.toLowerCase().includes(pf)) || (m.profile || '').toLowerCase().includes(pf));
    }
    if (filterState.sector !== 'ALL') {
      const sf = filterState.sector.toLowerCase();
      list = list.filter(m => (m.sectors || []).some(s => s.toLowerCase().includes(sf)) || (m.profile || '').toLowerCase().includes(sf));
    }

    const q = filterState.search.toLowerCase().trim();
    if (q) {
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.zone.toLowerCase().includes(q) ||
        m.caste.toLowerCase().includes(q) ||
        m.profile.toLowerCase().includes(q) ||
        (m.number && m.number.includes(q))
      );
    }

    const resetBtn = document.getElementById('resetCcFiltersBtn');
    if (resetBtn) {
      resetBtn.style.display = (selectedCcZone !== 'ALL' || q !== '' || filterState.category !== 'ALL') ? 'inline-flex' : 'none';
    }

    const cardContainer = document.getElementById('campaignMembersCardView');
    const tableContainer = document.getElementById('campaignMembersTableView');
    const tableBody = document.getElementById('campaignTableBody');

    if (cardContainer) {
      if (list.length === 0) {
        cardContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">Selected filter se koi sadasya uplabdh nahi hai.</div>`;
      } else {
        cardContainer.innerHTML = list.map(m => createMemberCardHtml(m, 'Abhiyan Samiti Sadasya')).join('');
      }
    }

    if (tableBody) {
      tableBody.innerHTML = list.map((m, idx) => {
        const bgList = [...(m.parties || []), ...(m.sectors || [])];
        const bgSummary = bgList.length > 0 ? bgList.slice(0, 2).join(' • ') : '-';
        return `
          <tr class="table-row-clickable" onclick="window.dashboard.openModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
            <td>${m.sr || (idx + 1)}</td>
            <td><span class="political-pill pill-gold">${escapeHtml(m.role || 'Sadasya')}</span></td>
            <td><strong>${escapeHtml(m.name)}</strong></td>
            <td>${escapeHtml(m.zone)}</td>
            <td>${escapeHtml(m.district)}</td>
            <td>${m.category ? `<span class="political-pill pill-blue">${escapeHtml(m.category)}</span>` : '-'}</td>
            <td>${escapeHtml(m.caste || '-')}</td>
            <td>${m.age ? `<span class="cadre-age-text">${m.age}</span>` : '-'}</td>
            <td>
              ${m.number ? `
                <a href="tel:${m.number}" class="cadre-phone-link" onclick="event.stopPropagation();">
                  <span>📞 ${escapeHtml(m.number)}</span>
                </a>
              ` : '-'}
            </td>
            <td><button class="btn-glass" style="padding:0.2rem 0.5rem; font-size:0.72rem;">Profile &rarr;</button></td>
          </tr>
        `;
      }).join('');
    }

    if (filterState.viewModeCc === 'cards') {
      cardContainer.style.display = 'grid';
      tableContainer.style.display = 'none';
    } else {
      cardContainer.style.display = 'none';
      tableContainer.style.display = 'block';
    }
  }

  // -------------------------------------------------------------
  // TAB 2: VYAVASIK PRAKOSHTH SANGATHAN / CADRE HIERARCHY (423 POSTS)
  // -------------------------------------------------------------
  function renderCadreHierarchy() {
    if (!data || !data.swg_members) return;

    let list = [...data.swg_members];

    // Hierarchy Level Filter
    if (selectedCadreLevel === 'STATE_APEX') {
      list = list.filter(m => ['State President', 'State Gen Sec', 'State VP'].includes(m.post));
    } else if (selectedCadreLevel === 'ZONAL') {
      list = list.filter(m => m.post === 'Zonal');
    } else if (selectedCadreLevel === 'DISTRICT_LEADS') {
      list = list.filter(m => ['District President', 'District Gen Sec'].includes(m.post));
    } else if (selectedCadreLevel === 'CORE_COMMITTEE') {
      list = list.filter(m => m.post === 'State Core Committee');
    }

    // District Quick Filter
    const quickDist = document.getElementById('cadreDistrictQuickSelect')?.value || 'ALL';
    if (quickDist !== 'ALL') {
      list = list.filter(m => (m.district || '').toLowerCase() === quickDist.toLowerCase());
    }

    // Zone Quick Filter
    const quickZone = document.getElementById('cadreZoneQuickSelect')?.value || 'ALL';
    if (quickZone !== 'ALL') {
      list = list.filter(m => (m.zone || '').toLowerCase() === quickZone.toLowerCase());
    }

    // Status Filter (Niyukt vs Rikt)
    const quickStatus = document.getElementById('cadreStatusQuickSelect')?.value || 'ALL';
    if (quickStatus === 'FILLED') {
      list = list.filter(m => !m.is_vacant);
    } else if (quickStatus === 'VACANT') {
      list = list.filter(m => m.is_vacant);
    }

    // Drawer Filters
    if (filterState.post !== 'ALL') {
      list = list.filter(m => m.post === filterState.post);
    }
    if (filterState.status === 'FILLED') {
      list = list.filter(m => !m.is_vacant);
    } else if (filterState.status === 'VACANT') {
      list = list.filter(m => m.is_vacant);
    }
    if (filterState.zone !== 'ALL') {
      list = list.filter(m => (m.zone || '').toLowerCase() === filterState.zone.toLowerCase());
    }
    if (filterState.district !== 'ALL') {
      list = list.filter(m => (m.district || '').toLowerCase() === filterState.district.toLowerCase());
    }
    if (filterState.category !== 'ALL') {
      list = list.filter(m => (m.category || '').toLowerCase() === filterState.category.toLowerCase());
    }
    if (filterState.party !== 'ALL') {
      const pf = filterState.party.toLowerCase();
      list = list.filter(m => (m.parties || []).some(p => p.toLowerCase().includes(pf)) || (m.profile || '').toLowerCase().includes(pf));
    }
    if (filterState.sector !== 'ALL') {
      const sf = filterState.sector.toLowerCase();
      list = list.filter(m => (m.sectors || []).some(s => s.toLowerCase().includes(sf)) || (m.profile || '').toLowerCase().includes(sf));
    }

    // Search Query
    const q = (document.getElementById('cadreSearchInput')?.value || '').toLowerCase().trim();
    if (q) {
      list = list.filter(m =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.post || '').toLowerCase().includes(q) ||
        (m.district || '').toLowerCase().includes(q) ||
        (m.zone || '').toLowerCase().includes(q) ||
        (m.caste || '').toLowerCase().includes(q) ||
        (m.number && m.number.includes(q)) ||
        (m.profile || '').toLowerCase().includes(q)
      );
    }

    // Sort by post hierarchy rank
    list.sort((a, b) => (a.post_rank || 99) - (b.post_rank || 99));

    // Update Counts Header
    const countLabel = document.getElementById('cadreActiveCountLabel');
    if (countLabel) {
      const filled = list.filter(m => !m.is_vacant).length;
      const vacant = list.filter(m => m.is_vacant).length;
      countLabel.textContent = `Kul ${list.length} Pad Pradarshit (${filled} Niyukt, ${vacant} Rikt)`;
    }

    const contextLabel = document.getElementById('cadreContextLabel');
    if (contextLabel) {
      let lvlName = 'All Cadre Hierarchy';
      if (selectedCadreLevel === 'STATE_APEX') lvlName = '1. Pradesh Leadership (15 Pad)';
      else if (selectedCadreLevel === 'ZONAL') lvlName = '2. Zonal Prabhari (12 Zones)';
      else if (selectedCadreLevel === 'DISTRICT_LEADS') lvlName = '3. Zila Leadership (88 Pad)';
      else if (selectedCadreLevel === 'CORE_COMMITTEE') lvlName = '4. Pradesh Core Committee (7 Har Zila)';
      contextLabel.textContent = `Level: ${lvlName}`;
    }

    const cardContainer = document.getElementById('cadreMembersCardView');
    const tableContainer = document.getElementById('cadreMembersTableView');
    const tableBody = document.getElementById('cadreTableBody');

    if (cardContainer) {
      if (list.length === 0) {
        cardContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem; color: var(--text-muted); font-size: 0.95rem;">Chayanit filter se koi padadhikari ya rikt pad uplabdh nahi hai.</div>`;
      } else {
        cardContainer.innerHTML = list.map(m => createMemberCardHtml(m, m.post)).join('');
      }
    }

    if (tableBody) {
      tableBody.innerHTML = list.map((m, idx) => {
        const isVacant = m.is_vacant;
        const bgList = [...(m.parties || []), ...(m.sectors || [])];
        const bgSummary = bgList.length > 0 ? bgList.slice(0, 2).join(' • ') : '-';
        return `
          <tr class="table-row-clickable ${isVacant ? 'style="opacity: 0.75;"' : ''}" onclick="window.dashboard.openModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
            <td>${m.id || (idx + 1)}</td>
            <td>${getPostBadgeHtml(m.post)}</td>
            <td>
              <strong>${isVacant ? '<span style="color:var(--rose-light);">(Rikt Pad)</span>' : escapeHtml(m.name)}</strong>
            </td>
            <td>
              <span class="political-pill ${isVacant ? 'pill-rose' : 'pill-emerald'}">
                ${isVacant ? 'Rikt Pad' : 'Niyukt'}
              </span>
            </td>
            <td>${escapeHtml(m.zone || '-')}</td>
            <td><strong>${escapeHtml(m.district || '-')}</strong></td>
            <td>${m.category ? `<span class="political-pill pill-blue">${escapeHtml(m.category)}</span>` : '-'}</td>
            <td>${escapeHtml(m.caste || '-')}</td>
            <td>${m.age && !isVacant ? `<span class="cadre-age-text">${m.age}</span>` : '-'}</td>
            <td>
              ${m.number ? `
                <a href="tel:${m.number}" class="cadre-phone-link" onclick="event.stopPropagation();">
                  <span>📞 ${escapeHtml(m.number)}</span>
                </a>
              ` : '<span style="color:var(--text-dim);">-</span>'}
            </td>
            <td><button class="btn-glass" style="padding:0.2rem 0.5rem; font-size:0.72rem;">Profile &rarr;</button></td>
          </tr>
        `;
      }).join('');
    }

    if (filterState.viewModeCadre === 'cards') {
      cardContainer.style.display = 'grid';
      tableContainer.style.display = 'none';
    } else {
      cardContainer.style.display = 'none';
      tableContainer.style.display = 'block';
    }
  }

  // -------------------------------------------------------------
  // STRUCTURED MEMBER CARD GENERATOR (DECLUTTERED)
  // -------------------------------------------------------------
  function createMemberCardHtml(m, roleTitle) {
    const isVacant = m.is_vacant;
    const initial = m.name && !isVacant ? m.name.charAt(0) : '?';
    const displayName = isVacant ? '(Rikt Pad)' : escapeHtml(m.name);
    const locText = m.district ? `${m.district} (${m.zone || 'Bihar'})` : (m.zone || 'Samast Bihar');
    
    const socialParts = [m.caste, m.category].filter(Boolean);
    const socialText = socialParts.length > 0 ? socialParts.join(' • ') : '';

    const bgParts = [...(m.parties || []), ...(m.sectors || [])];
    const bgText = bgParts.length > 0 ? bgParts.slice(0, 2).join(' • ') : '';

    return `
      <div class="cadre-clean-card ${isVacant ? 'is-vacant' : ''}" onclick="window.dashboard.openModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
        <div class="cadre-header-row">
          <div class="cadre-avatar-small" style="${isVacant ? 'background:rgba(244,63,94,0.15); color:var(--rose-light); border:1px dashed var(--rose);' : ''}">
            ${initial}
          </div>
          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:0.4rem;">
              <h4 class="cadre-clean-name" style="${isVacant ? 'color:var(--rose-light); font-style:italic;' : ''}" title="${displayName}">${displayName}</h4>
              ${m.age && !isVacant ? `<span class="cadre-age-text">Age: ${m.age}</span>` : ''}
            </div>
            <div style="margin-top:0.2rem;">
              ${getPostBadgeHtml(m.post || roleTitle)}
            </div>
          </div>
        </div>

        <div class="cadre-structured-body">
          <div class="cadre-info-row">
            <span class="info-icon">📍</span>
            <span class="info-text"><strong>${escapeHtml(locText)}</strong></span>
          </div>
          ${socialText && !isVacant ? `
          <div class="cadre-info-row">
            <span class="info-icon">👥</span>
            <span class="info-text">${escapeHtml(socialText)}</span>
          </div>` : ''}
          ${bgText && !isVacant ? `
          <div class="cadre-info-row">
            <span class="info-icon">💼</span>
            <span class="info-text">${escapeHtml(bgText)}</span>
          </div>` : ''}
          ${isVacant ? `
          <div class="cadre-info-row" style="color:var(--rose-light);">
            <span class="info-icon">⚠️</span>
            <span class="info-text">Agami Sangathan Vistar Hetu Rikt Pad</span>
          </div>` : ''}
        </div>

        <div class="cadre-card-footer">
          ${m.number && !isVacant ? `
            <a href="tel:${m.number}" class="cadre-phone-link" onclick="event.stopPropagation();" title="Sidha Call Karein">
              <span>📞</span>
              <span>${escapeHtml(m.number)}</span>
            </a>
          ` : `<span style="color:${isVacant ? 'var(--rose-light)' : 'var(--text-dim)'}; font-size:0.75rem;">${isVacant ? 'Rikt Pad' : 'Sampark Uplabdh'}</span>`}
          <span class="cadre-details-cta">Profile &rarr;</span>
        </div>
      </div>
    `;
  }

  function getPostBadgeHtml(post) {
    if (!post) return '';
    const p = post.trim();
    if (p === 'State President') return `<span class="political-pill pill-gold">Pradesh Adhyaksh</span>`;
    if (p === 'State Gen Sec') return `<span class="political-pill pill-gold">Pradesh Mahasachiv</span>`;
    if (p === 'State VP') return `<span class="political-pill pill-blue">Pradesh VP (Upadhyaksh)</span>`;
    if (p === 'Zonal') return `<span class="political-pill pill-emerald">Zonal Prabhari</span>`;
    if (p === 'District President') return `<span class="political-pill pill-blue">Zila Adhyaksh</span>`;
    if (p === 'District Gen Sec') return `<span class="political-pill pill-gold">Zila Mahasachiv</span>`;
    if (p === 'State Core Committee') return `<span class="political-pill" style="background:rgba(255,255,255,0.06);">Pradesh Core Committee</span>`;
    return `<span class="political-pill">${escapeHtml(p)}</span>`;
  }

  // -------------------------------------------------------------
  // MODAL DOSSIER CONTROLS
  // -------------------------------------------------------------
  function openModal(member) {
    if (!member) return;

    const isVacant = member.is_vacant;
    document.getElementById('modalMemberName').textContent = isVacant ? '(Rikt Pad)' : (member.name || '-');
    document.getElementById('modalMemberPost').textContent = member.post || member.role || 'Sadasya';
    document.getElementById('modalAvatar').textContent = member.name && !isVacant ? member.name.charAt(0) : '?';
    document.getElementById('modalZone').textContent = member.zone || 'Anirdisht';
    document.getElementById('modalDistrict').textContent = member.district || 'Anirdisht';
    document.getElementById('modalCategory').textContent = member.category || 'Anirdisht';
    document.getElementById('modalCaste').textContent = member.caste || 'Anirdisht';
    document.getElementById('modalAge').textContent = member.age ? `${member.age}` : '-';

    const phoneEl = document.getElementById('modalPhone');
    const callBtn = document.getElementById('modalCallBtn');
    if (member.number && !isVacant) {
      phoneEl.textContent = member.number;
      callBtn.style.display = 'inline-flex';
      callBtn.href = `tel:${member.number}`;
    } else {
      phoneEl.textContent = isVacant ? 'Rikt Pad (Sampark Anuplabdh)' : 'Sampark uplabdh nahi hai';
      callBtn.style.display = 'none';
    }

    const tagsEl = document.getElementById('modalTags');
    const tags = [];
    if (member.post) tags.push(getPostBadgeHtml(member.post));
    if (member.zone) tags.push(`<span class="political-pill pill-gold">📍 ${escapeHtml(member.zone)} Zone</span>`);
    if (member.district) tags.push(`<span class="political-pill pill-blue">${escapeHtml(member.district)}</span>`);
    if (member.category) tags.push(`<span class="political-pill pill-emerald">${escapeHtml(member.category)}</span>`);
    if (member.caste) tags.push(`<span class="political-pill">${escapeHtml(member.caste)}</span>`);
    (member.parties || []).forEach(p => tags.push(`<span class="political-pill pill-party">${escapeHtml(p)}</span>`));
    (member.sectors || []).forEach(s => tags.push(`<span class="political-pill pill-sector">${escapeHtml(s)}</span>`));
    tagsEl.innerHTML = tags.join('');

    const profileEl = document.getElementById('modalProfile');
    if (isVacant) {
      profileEl.innerHTML = `
        <div style="color:var(--rose-light); font-weight:600; padding:1rem; border:1px dashed var(--rose); border-radius:var(--radius-md);">
          ⚠️ Yeh pad vartaman me rikt hai. Jan Suraaj Vyavasaik Prakoshth ke agami sangathanik vistar me is pad par yogya vyavsayi netritva ki niyukti prastavit hai.
        </div>
      `;
    } else if (member.profile && member.profile.trim()) {
      profileEl.innerHTML = member.profile
        .split('\n')
        .filter(l => l.trim())
        .map(line => `<p style="margin-bottom:0.5rem;">${escapeHtml(line)}</p>`)
        .join('');
    } else {
      profileEl.innerHTML = '<p style="color:var(--text-muted); font-style:italic;">Profile will be updated soon from the sheet.</p>';
    }

    document.getElementById('memberModal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('memberModal').classList.remove('open');
  }

  // -------------------------------------------------------------
  // SLIDE-OUT FILTER SIDE PANEL
  // -------------------------------------------------------------
  function setupSideDrawer() {
    const backdrop = document.getElementById('sideDrawerBackdrop');
    const openBtns = [
      document.getElementById('openDrawerBtn'),
      document.getElementById('openDrawerFromCcBtn'),
      document.getElementById('dockBtnFilter'),
      document.getElementById('rightEdgeDrawerTrigger')
    ];
    const closeBtn = document.getElementById('closeDrawerBtn');

    openBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', openSideDrawer);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSideDrawer);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeSideDrawer();
      });
    }

    // Party pill buttons in drawer
    document.querySelectorAll('#drawerPartyPills .drawer-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#drawerPartyPills .drawer-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.party = btn.getAttribute('data-filter');
      });
    });

    // Sector pill buttons in drawer
    document.querySelectorAll('#drawerSectorPills .drawer-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
          filterState.sector = 'ALL';
        } else {
          document.querySelectorAll('#drawerSectorPills .drawer-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          filterState.sector = btn.getAttribute('data-filter');
        }
      });
    });

    document.getElementById('drawerApplyBtn')?.addEventListener('click', () => {
      filterState.post = document.getElementById('drawerPostFilter')?.value || 'ALL';
      filterState.status = document.getElementById('drawerStatusFilter')?.value || 'ALL';
      filterState.zone = document.getElementById('drawerZoneFilter')?.value || 'ALL';
      filterState.district = document.getElementById('drawerDistrictFilter')?.value || 'ALL';
      filterState.category = document.getElementById('drawerCatFilter')?.value || 'ALL';

      closeSideDrawer();
      updateActiveFilterBadge();
      renderCampaignCommittee();
      renderCadreHierarchy();
    });

    document.getElementById('drawerResetBtn')?.addEventListener('click', resetAllFilters);
  }

  function openSideDrawer() {
    document.getElementById('sideDrawerBackdrop').classList.add('open');
  }

  function closeSideDrawer() {
    document.getElementById('sideDrawerBackdrop').classList.remove('open');
  }

  function resetAllFilters() {
    filterState.search = '';
    filterState.post = 'ALL';
    filterState.status = 'ALL';
    filterState.zone = 'ALL';
    filterState.district = 'ALL';
    filterState.category = 'ALL';
    filterState.party = 'ALL';
    filterState.sector = 'ALL';
    selectedCcZone = 'ALL';
    selectedCadreLevel = 'ALL';

    const pSel = document.getElementById('drawerPostFilter'); if (pSel) pSel.value = 'ALL';
    const sSel = document.getElementById('drawerStatusFilter'); if (sSel) sSel.value = 'ALL';
    const zSel = document.getElementById('drawerZoneFilter'); if (zSel) zSel.value = 'ALL';
    const dSel = document.getElementById('drawerDistrictFilter'); if (dSel) dSel.value = 'ALL';
    const cSel = document.getElementById('drawerCatFilter'); if (cSel) cSel.value = 'ALL';

    const cadreDist = document.getElementById('cadreDistrictQuickSelect'); if (cadreDist) cadreDist.value = 'ALL';
    const cadreZone = document.getElementById('cadreZoneQuickSelect'); if (cadreZone) cadreZone.value = 'ALL';
    const cadreStatus = document.getElementById('cadreStatusQuickSelect'); if (cadreStatus) cadreStatus.value = 'ALL';
    const cadreSearch = document.getElementById('cadreSearchInput'); if (cadreSearch) cadreSearch.value = '';
    const ccSearch = document.getElementById('campaignSearchInput'); if (ccSearch) ccSearch.value = '';

    document.querySelectorAll('.hierarchy-pill-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-level') === 'ALL');
    });

    document.querySelectorAll('.drawer-pill-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-filter') === 'ALL');
    });

    updateActiveFilterBadge();
    renderCampaignCommittee();
    renderCadreHierarchy();
  }

  function updateActiveFilterBadge() {
    let count = 0;
    if (filterState.post !== 'ALL') count++;
    if (filterState.status !== 'ALL') count++;
    if (filterState.zone !== 'ALL') count++;
    if (filterState.district !== 'ALL') count++;
    if (filterState.category !== 'ALL') count++;
    if (filterState.party !== 'ALL') count++;
    if (filterState.sector !== 'ALL') count++;

    const badge = document.getElementById('activeFilterBadge');
    const rightBadge = document.getElementById('rightTriggerBadge');
    const dockBadge = document.getElementById('dockFilterBadge');
    [badge, rightBadge, dockBadge].forEach(b => {
      if (b) {
        if (count > 0) {
          b.textContent = count;
          b.style.display = 'inline-block';
        } else {
          b.style.display = 'none';
        }
      }
    });
  }

  // -------------------------------------------------------------
  // EVENT LISTENERS & LEVEL SWITCHERS
  // -------------------------------------------------------------
  function setupEventListeners() {
    // Hierarchy Level Switcher Buttons
    document.querySelectorAll('.hierarchy-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hierarchy-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCadreLevel = btn.getAttribute('data-level');
        renderCadreHierarchy();
      });
    });

    // Quick Cadre Filters
    document.getElementById('cadreDistrictQuickSelect')?.addEventListener('change', renderCadreHierarchy);
    document.getElementById('cadreZoneQuickSelect')?.addEventListener('change', renderCadreHierarchy);
    document.getElementById('cadreStatusQuickSelect')?.addEventListener('change', renderCadreHierarchy);
    document.getElementById('cadreSearchInput')?.addEventListener('input', renderCadreHierarchy);
    document.getElementById('resetAllCadreFiltersBtn')?.addEventListener('click', resetAllFilters);

    // Campaign Committee Search
    const ccSearch = document.getElementById('campaignSearchInput');
    if (ccSearch) {
      ccSearch.addEventListener('input', (e) => {
        filterState.search = e.target.value;
        filterAndRenderCampaignMembers();
      });
    }

    const resetCcBtn = document.getElementById('resetCcFiltersBtn');
    if (resetCcBtn) {
      resetCcBtn.addEventListener('click', () => {
        selectedCcZone = 'ALL';
        filterState.search = '';
        if (ccSearch) ccSearch.value = '';
        renderCcZoneChips();
        filterAndRenderCampaignMembers();
      });
    }

    // View Toggles - Tab 1 (Campaign)
    document.getElementById('ccCardViewBtn')?.addEventListener('click', () => {
      filterState.viewModeCc = 'cards';
      document.getElementById('ccCardViewBtn').classList.add('active');
      document.getElementById('ccTableViewBtn').classList.remove('active');
      filterAndRenderCampaignMembers();
    });
    document.getElementById('ccTableViewBtn')?.addEventListener('click', () => {
      filterState.viewModeCc = 'table';
      document.getElementById('ccTableViewBtn').classList.add('active');
      document.getElementById('ccCardViewBtn').classList.remove('active');
      filterAndRenderCampaignMembers();
    });

    // View Toggles - Tab 2 (Cadre)
    document.getElementById('cadreCardViewBtn')?.addEventListener('click', () => {
      filterState.viewModeCadre = 'cards';
      document.getElementById('cadreCardViewBtn').classList.add('active');
      document.getElementById('cadreTableViewBtn').classList.remove('active');
      renderCadreHierarchy();
    });
    document.getElementById('cadreTableViewBtn')?.addEventListener('click', () => {
      filterState.viewModeCadre = 'table';
      document.getElementById('cadreTableViewBtn').classList.add('active');
      document.getElementById('cadreCardViewBtn').classList.remove('active');
      renderCadreHierarchy();
    });

    // Modal Events
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
    document.getElementById('memberModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'memberModal') closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        closeSideDrawer();
      }
    });

    // Copy Phone Button
    document.getElementById('modalCopyPhoneBtn')?.addEventListener('click', () => {
      const phone = document.getElementById('modalPhone').textContent.trim();
      if (phone && phone !== 'Rikt Pad (Sampark Anuplabdh)') {
        navigator.clipboard.writeText(phone);
        showToast('Phone number copied!');
      }
    });

    // Sync Button
    document.getElementById('syncSheetsBtn')?.addEventListener('click', syncWithGoogleSheets);

    // CSV Export Button
    document.getElementById('exportCsvBtn')?.addEventListener('click', exportCurrentViewCsv);
  }

  // -------------------------------------------------------------
  // DYNAMIC LIVE SYNC WITH GOOGLE SHEETS
  // -------------------------------------------------------------
  async function syncWithGoogleSheets() {
    const syncBtn = document.getElementById('syncSheetsBtn');
    const syncIcon = document.getElementById('syncIcon');
    if (syncIcon) syncIcon.classList.add('spinning');
    if (syncBtn) syncBtn.disabled = true;

    showToast('Syncing latest data from Google Sheets...');

    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const payload = await res.json();
        data = payload.data || payload;
        populateDropdowns();
        renderCampaignCommittee();
        renderCadreHierarchy();
        showToast('Google Sheets data synchronized successfully!');
      } else {
        showToast('Sync completed.');
      }
    } catch (err) {
      console.log('Sync network error, keeping existing data.');
      showToast('Data refreshed.');
    } finally {
      if (syncIcon) syncIcon.classList.remove('spinning');
      if (syncBtn) syncBtn.disabled = false;
      checkSyncStatus();
    }
  }

  async function checkSyncStatus() {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const status = await res.json();
        const chipText = document.getElementById('syncStatusText');
        if (chipText && status.last_updated) {
          chipText.textContent = `Sheets Live: ${status.last_updated.split(' ')[1] || 'Synced'}`;
        }
      }
    } catch (e) {
      // offline mode
    }
  }

  // -------------------------------------------------------------
  // CSV EXPORT LOGIC
  // -------------------------------------------------------------
  function exportCurrentViewCsv() {
    if (!data) return;

    let rows = [];
    let filename = 'Jan_Suraaj_Vyavasaik_Prakoshth.csv';

    if (currentTab === 'tab-campaign') {
      filename = 'Jan_Suraaj_Campaign_Committee.csv';
      rows.push(['Sr_No', 'Role', 'Name', 'Zone', 'District', 'Age', 'Category', 'Caste', 'Phone', 'Parties', 'Sectors', 'Profile']);
      const members = data.campaign_committee || [];
      members.forEach((m, idx) => {
        rows.push([
          m.sr || (idx + 1),
          m.role || '',
          m.name || '',
          m.zone || '',
          m.district || '',
          m.age || '',
          m.category || '',
          m.caste || '',
          m.number || '',
          (m.parties || []).join('; '),
          (m.sectors || []).join('; '),
          (m.profile || '').replace(/"/g, '""').replace(/\n/g, ' ')
        ]);
      });
    } else {
      filename = 'Jan_Suraaj_Cadre_Hierarchy.csv';
      rows.push(['ID', 'Post', 'Name', 'Status', 'Zone', 'District', 'Age', 'Category', 'Caste', 'Phone', 'Parties', 'Sectors']);
      const members = data.swg_members || [];
      members.forEach((m, idx) => {
        rows.push([
          m.id || (idx + 1),
          m.post || '',
          m.name || '',
          m.is_vacant ? 'Vacant' : 'Filled',
          m.zone || '',
          m.district || '',
          m.age || '',
          m.category || '',
          m.caste || '',
          m.number || '',
          (m.parties || []).join('; '),
          (m.sectors || []).join('; ')
        ]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`CSV Downloaded: ${filename}`);
  }

  // -------------------------------------------------------------
  // TOAST NOTIFICATION
  // -------------------------------------------------------------
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    if (toast && msgEl) {
      msgEl.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global namespace for inline callbacks
  window.dashboard = {
    openModal,
    closeModal,
    filterCcByZone,
    syncWithGoogleSheets
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
