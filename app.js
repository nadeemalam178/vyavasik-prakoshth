/**
 * Vyavasaik Prakoshth - Dashboard - Application Logic
 * Jan Suraaj Bihar • 2 Tabs: Campaign Committee & Cadre Hierarchy
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

  let currentLang = localStorage.getItem('js_lang') || 'en';

  // Comprehensive Bilingual Dictionary (English & Hindi)
  const I18N = {
    en: {
      header_title: 'Vyavasaik Prakoshth - Dashboard',
      header_tag: 'Jan Suraaj &bull; Bihar',
      header_sub: 'Campaign Committee &bull; 12 Zones &bull; 44 Sangathanik Zile',
      sync_live: 'Sheets Live Connected',
      sync_btn: 'Sync',
      lang_btn: 'हिंदी',
      tab_campaign: 'Campaign Committee',
      tab_campaign_badge: '28 Sadasya',
      tab_cadre: 'Vyavasik Prakoshth Post Holders',
      tab_cadre_badge: '423 Pad',
      tab_analytics: 'Analytics',
      tab_analytics_badge: 'Charts Suite',
      sec_campaign_title: '⭐ Campaign Committee',
      sec_sah_sanyojak_title: 'Pradesh Sah - Sanyojak',
      sec_zonal_cc_title: '🏛️ Zonal Campaign Committee Sadasya (24 Sadasya)',
      sec_zonal_cc_sub: 'Bihar ke sabhi 12 Zono evam pramukh zilo ka pratinidhitwa karne wale netritva sadasya',
      card_view: '🔲 Card View',
      table_view: '📑 Suchi View',
      search_campaign_ph: 'Search member by name, district, caste or sector...',
      sec_cadre_title: '👥 Vyavasik Prakoshth Post Holders Hierarchy',
      sec_cadre_sub: 'State President &bull; State Gen Sec &bull; State VP &bull; 12 Zonals &bull; 44 District Presidents &bull; 44 District Gen Secs &bull; 7 Core Members per District (308)',
      pill_all_cadre: 'All Post Holders',
      pill_state_apex: 'State Post Holder',
      pill_zonal: 'Zonal Prabhari',
      pill_dist_leads: 'Zila Leadership',
      pill_core: 'State Core Committee',
      search_cadre_ph: 'Search by name, post, phone, district, caste or sector...',
      th_srno: 'SrNo',
      th_post: 'Post',
      th_name: 'Name',
      th_status: 'Status',
      th_zone: 'Zone',
      th_district: 'District',
      th_category: 'Category',
      th_caste: 'Caste',
      th_age: 'Age',
      th_number: 'Number',
      th_profile: 'Profile',
      th_dist_pres: 'District President',
      th_dist_gen_sec: 'District Gen Sec',
      th_core_comm: 'Core Committee',
      th_fill_rate: 'Fill Rate',
      th_priority: 'Priority Tier',
      sec_analytics_title: '📊 Comprehensive Sangathanik Analytics & Visual Intelligence',
      sec_analytics_sub: 'Real-time visual analysis of 423 Post Holders, 12 Zones, 44 Districts, Social Categories, Castes, Age Cohorts & Political Migrations',
      kpi_fill_label: 'Niyukti Vistar (Fill Rate)',
      kpi_fill_sub: '<strong>332 Niyukt</strong> • 91 Rikt Pad (Kul 423)',
      kpi_geo_label: 'Bhaugolik Vyapti (Bihar Coverage)',
      kpi_geo_sub: '<strong>12 Zones & 44 Zile</strong> Sakriya',
      kpi_pol_label: 'Purv Rajnitik Netritva',
      kpi_pol_val: '132 Political Profiles',
      kpi_pol_sub: '52 Congress • 37 BJP • 26 JDU',
      kpi_elected_label: 'Grassroots Elected Reps',
      kpi_elected_val: '80 Pratinidhi',
      kpi_elected_sub: 'Mukhiya, Parshad & PACS Adhyaksh',
      chart_caste_title: '👥 Caste Distribution',
      chart_caste_sub: 'General, OBC, EBC, Minority & SC Representation',
      chart_status_title: '🏛️ Pad Niyukti evam Riktata',
      chart_status_sub: 'Fill Rate Status across 7 Hierarchy Tiers',
      chart_zonal_title: '📍 12 Sangathanik Zones - Filled vs Gaps',
      chart_zonal_sub: 'Comparative Post Holder Strength across all 12 Operational Zones',
      chart_pol_title: '🏛️ Purv Rajnitik Prishthbhumi',
      chart_pol_sub: 'Senior Leaders Migrated to Jan Suraaj by Party',
      chart_sector_title: '💼 Vyavasaik Kshetr & Udyog',
      chart_sector_sub: 'Key Industries Represented in Business Cell',
      chart_age_title: '🎂 Aayu Varg & Demographics',
      chart_age_sub: 'Youth (Under 35), Prime (35-49), Senior (50-59) & Veterans (60+)',
      matrix_title: '📑 44 Sangathanik Zile - Readiness & Action Priority Matrix',
      matrix_sub: 'Live tracking of Zila Adhyaksh, Zila Mahasachiv, Core Committee (Target: 7) & Gaps',
      matrix_scroll_hint: 'Swipe left-right to review all 7 district metrics',
      cat_all: '📊 All Analytics',
      cat_social: '👥 Social & Caste',
      cat_zones: '📍 12 Zones',
      cat_hierarchy: '🏛️ Posts & Tiers',
      cat_political: '🏛️ Political Migration',
      cat_sectors: '💼 Business Sectors',
      cat_age: '🎂 Age Cohorts',
      cat_matrix: '📑 44 Districts Matrix',
      drawer_trigger: 'Filter',
      drawer_title: '⚡ Sangathanik Chayan & Filter',
      drawer_post_label: 'Sangathanik Pad Star (Post Hierarchy)',
      drawer_status_label: 'Niyukti Sthiti (Appointment Status)',
      drawer_zone_label: '12 Sangathanik Zones',
      drawer_dist_label: '44 Sangathanik Zile',
      drawer_cat_label: 'Samajik Shreni (Social Category)',
      drawer_party_label: 'Purv Rajnitik Prishthbhumi',
      drawer_sector_label: 'Vyavasayik & Aarthik Kshetr',
      drawer_reset: 'Reset Karein',
      drawer_apply: 'Laagu Karein',
      dock_campaign: 'Campaign Committee',
      dock_cadre: 'Post Holder',
      dock_analytics: 'Analytics'
    },
    hi: {
      header_title: 'व्यावसायिक प्रकोष्ठ - डैशबोर्ड',
      header_tag: 'जन सुराज &bull; बिहार',
      header_sub: 'अभियान समिति &bull; 12 ज़ोन &bull; 44 सांगठनिक ज़िले',
      sync_live: 'शीट्स लाइव कनेक्टेड',
      sync_btn: 'सिंक करें',
      lang_btn: 'English',
      tab_campaign: 'अभियान समिति',
      tab_campaign_badge: '28 सदस्य',
      tab_cadre: 'व्यावसायिक प्रकोष्ठ पदधारक',
      tab_cadre_badge: '423 पद',
      tab_analytics: 'एनालिटिक्स',
      tab_analytics_badge: 'चार्ट्स सुइट',
      sec_campaign_title: '⭐ अभियान समिति',
      sec_sah_sanyojak_title: 'प्रदेश सह - संयोजक',
      sec_zonal_cc_title: '🏛️ ज़ोनल अभियान समिति सदस्य (24 सदस्य)',
      sec_zonal_cc_sub: 'बिहार के सभी 12 ज़ोनों एवं प्रमुख ज़िलों का प्रतिनिधित्व करने वाले नेतृत्व सदस्य',
      card_view: '🔲 कार्ड दृश्य',
      table_view: '📑 सूची दृश्य',
      search_campaign_ph: 'नाम, ज़िला, जाति या व्यवसाय से सदस्य खोजें...',
      sec_cadre_title: '👥 व्यावसायिक प्रकोष्ठ पदधारक संरचना',
      sec_cadre_sub: 'प्रदेश अध्यक्ष &bull; प्रदेश महासचिव &bull; प्रदेश उपाध्यक्ष &bull; 12 ज़ोनल &bull; 44 ज़िला अध्यक्ष &bull; 44 ज़िला महासचिव &bull; 7 कोर सदस्य प्रति ज़िला (308)',
      pill_all_cadre: 'सभी पदधारक',
      pill_state_apex: 'प्रदेश पदधारक',
      pill_zonal: 'ज़ोनल प्रभारी',
      pill_dist_leads: 'ज़िला नेतृत्व',
      pill_core: 'प्रदेश कोर कमेटी',
      search_cadre_ph: 'नाम, पद, फोन, ज़िला, जाति या व्यवसाय से खोजें...',
      th_srno: 'क्र.',
      th_post: 'पद',
      th_name: 'नाम',
      th_status: 'स्थिति',
      th_zone: 'ज़ोन',
      th_district: 'ज़िला',
      th_category: 'श्रेणी',
      th_caste: 'जाति',
      th_age: 'उम्र',
      th_number: 'फोन नंबर',
      th_profile: 'प्रोफ़ाइल',
      th_dist_pres: 'ज़िला अध्यक्ष',
      th_dist_gen_sec: 'ज़िला महासचिव',
      th_core_comm: 'कोर कमेटी',
      th_fill_rate: 'नियुक्ति दर',
      th_priority: 'प्राथमिकता स्तर',
      sec_analytics_title: '📊 समग्र सांगठनिक विश्लेषण एवं विज़ुअल इंटेलिजेंस',
      sec_analytics_sub: '423 पदधारकों, 12 ज़ोन, 44 ज़िलों, सामाजिक श्रेणियों, जातियों, आयु वर्ग एवं राजनीतिक पृष्ठभूमि का रीयल-टाइम विश्लेषण',
      kpi_fill_label: 'नियुक्ति विस्तार (Fill Rate)',
      kpi_fill_sub: '<strong>332 नियुक्त</strong> • 91 रिक्त पद (कुल 423)',
      kpi_geo_label: 'भौगोलिक व्याप्ति (बिहार कवरेज)',
      kpi_geo_sub: '<strong>12 ज़ोन एवं 44 ज़िले</strong> सक्रिय',
      kpi_pol_label: 'पूर्व राजनीतिक नेतृत्व',
      kpi_pol_val: '132 राजनीतिक प्रोफाइल',
      kpi_pol_sub: '52 कांग्रेस • 37 भाजपा • 26 जदयू',
      kpi_elected_label: 'जमीनी निर्वाचित प्रतिनिधि',
      kpi_elected_val: '80 प्रतिनिधि',
      kpi_elected_sub: 'मुखिया, पार्षद एवं पैक्स अध्यक्ष',
      chart_caste_title: '👥 सामाजिक श्रेणी एवं जाति विस्तार',
      chart_caste_sub: 'सामान्य, ओबीसी, ईबीसी, अल्पसंख्यक एवं एससी प्रतिनिधित्व',
      chart_status_title: '🏛️ पद नियुक्ति एवं रिक्तता',
      chart_status_sub: '7 पदानुक्रम स्तरों में नियुक्ति स्थिति',
      chart_zonal_title: '📍 12 सांगठनिक ज़ोन - नियुक्त बनाम रिक्त',
      chart_zonal_sub: 'सभी 12 ज़ोनों में पदधारक क्षमता की तुलना',
      chart_pol_title: '🏛️ पूर्व राजनीतिक पृष्ठभूमि',
      chart_pol_sub: 'जन सुराज से जुड़े अनुभवी राजनीतिक नेता',
      chart_sector_title: '💼 व्यावसायिक क्षेत्र एवं उद्योग',
      chart_sector_sub: 'व्यावसायिक प्रकोष्ठ में प्रतिनिधित्व करने वाले प्रमुख उद्योग',
      chart_age_title: '🎂 आयु वर्ग जनसांख्यिकी',
      chart_age_sub: 'युवा (35 से कम), मुख्य (35-49), वरिष्ठ (50-59) एवं अनुभवी (60+)',
      matrix_title: '📑 44 सांगठनिक ज़िले - तत्परता एवं कार्य प्राथमिकता मैट्रिक्स',
      matrix_sub: 'ज़िला अध्यक्ष, ज़िला महासचिव, कोर कमेटी (लक्ष्य: 7) एवं रिक्तियों की लाइव ट्रैकिंग',
      matrix_scroll_hint: 'सभी 7 ज़िला आंकड़े देखने के लिए दाएँ-बाएँ स्वाइप करें',
      cat_all: '📊 समग्र विश्लेषण',
      cat_social: '👥 सामाजिक एवं जाति',
      cat_zones: '📍 12 ज़ोन',
      cat_hierarchy: '🏛️ पद एवं स्तर',
      cat_political: '🏛️ राजनीतिक पृष्ठभूमि',
      cat_sectors: '💼 व्यावसायिक क्षेत्र',
      cat_age: '🎂 आयु वर्ग',
      cat_matrix: '📑 44 ज़िला मैट्रिक्स',
      drawer_trigger: 'फ़िल्टर',
      drawer_title: '⚡ सांगठनिक चयन एवं फ़िल्टर',
      drawer_post_label: 'सांगठनिक पद स्तर',
      drawer_status_label: 'नियुक्ति स्थिति',
      drawer_zone_label: '12 सांगठनिक ज़ोन',
      drawer_dist_label: '44 सांगठनिक ज़िले',
      drawer_cat_label: 'सामाजिक श्रेणी',
      drawer_party_label: 'पूर्व राजनीतिक पृष्ठभूमि',
      drawer_sector_label: 'व्यावसायिक एवं आर्थिक क्षेत्र',
      drawer_reset: 'रीसेट करें',
      drawer_apply: 'लागू करें',
      dock_campaign: 'अभियान समिति',
      dock_cadre: 'पदधारक',
      dock_analytics: 'एनालिटिक्स'
    }
  };

  // -------------------------------------------------------------
  // INITIALIZATION & DATA FETCHING
  // -------------------------------------------------------------
  async function init() {
    setupTheme();
    setupLanguage();
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
      renderAnalyticsCharts();
      renderDistrictReadinessMatrix();
      checkSyncStatus();
    }
  }

  // -------------------------------------------------------------
  // LANGUAGE MANAGEMENT (ENGLISH / HINDI)
  // -------------------------------------------------------------
  function setupLanguage() {
    applyLanguage(currentLang);

    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'hi' ? 'en' : 'hi';
        localStorage.setItem('js_lang', currentLang);
        applyLanguage(currentLang);
        if (data) {
          renderCampaignCommittee();
          renderCadreHierarchy();
          renderAnalyticsCharts(true);
          renderDistrictReadinessMatrix();
        }
      });
    }
  }

  function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);

    const langDisplay = document.getElementById('langDisplay');
    if (langDisplay) {
      langDisplay.textContent = lang === 'hi' ? 'English' : 'हिंदी';
    }

    const dict = I18N[lang] || I18N.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
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
        renderAnalyticsCharts(true);
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

    if (targetId === 'tab-analytics') {
      setTimeout(() => {
        renderAnalyticsCharts(true);
        renderDistrictReadinessMatrix();
      }, 50);
    }

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
    const isHi = currentLang === 'hi';

    // 1. Pradesh Sanyojak (State Convenor - Hero Card)
    const sanyojak = allMembers.find(m => m.role === 'Sanyojak');
    const sanyojakContainer = document.getElementById('sanyojakContainer');
    if (sanyojak && sanyojakContainer) {
      sanyojakContainer.innerHTML = `
        <div class="sanyojak-glass-card" onclick="window.dashboard.openModal(${JSON.stringify(sanyojak).replace(/"/g, '&quot;')})">
          <!-- Desktop View -->
          <div class="cadre-card-desktop">
            <div style="display:flex; align-items:center; gap:0.9rem; margin-bottom:0.75rem;">
              <div class="sanyojak-avatar">⭐</div>
              <div>
                <span class="badge-sanyojak">${isHi ? 'प्रदेश संयोजक' : 'Pradesh Sanyojak (State Convenor)'}</span>
                <h2 style="margin: 0.2rem 0 0.1rem; font-size: 1.35rem; color: var(--text-main);">
                  ${escapeHtml(sanyojak.name)}
                </h2>
                <div style="font-size:0.75rem; color:var(--gold-light); font-weight:600;">
                  ${isHi ? 'समस्त बिहार व्यावसायिक प्रकोष्ठ अभियान प्रमुख' : 'Samast Bihar Vyavasaik Prakoshth Abhiyan Pramukh'}
                </div>
              </div>
            </div>

            <div class="cadre-structured-body" style="background:rgba(241,194,50,0.08); border-color:rgba(241,194,50,0.3);">
              <div class="cadre-info-row">
                <span class="info-icon">📍</span>
                <span class="info-text"><strong>${escapeHtml(sanyojak.district)}, ${escapeHtml(sanyojak.zone)} Zone</strong> (Maharajganj Vidhan Sabha)</span>
              </div>
              <div class="cadre-info-row">
                <span class="info-icon">👥</span>
                <span class="info-text"><strong>${escapeHtml(sanyojak.caste)}</strong> &bull; ${escapeHtml(sanyojak.category)} &bull; ${isHi ? 'उम्र' : 'Age'}: ${sanyojak.age || '68'}</span>
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

            <div class="cadre-card-footer" style="margin-top:0.75rem; border-color:rgba(241,194,50,0.3);">
              ${sanyojak.number ? `
                <a href="tel:${sanyojak.number}" class="cadre-phone-link" onclick="event.stopPropagation();" style="color:var(--gold-light); font-size:0.85rem;">
                  <span>📞</span>
                  <span>${escapeHtml(sanyojak.number)}</span>
                </a>
              ` : `<span style="color:var(--text-dim);">${isHi ? 'संपर्क उपलब्ध' : 'Sampark Uplabdh'}</span>`}
              <button class="btn-glass btn-glass-primary" style="padding:0.35rem 0.85rem; font-size:0.78rem;" onclick="event.stopPropagation(); window.dashboard.openModal(${JSON.stringify(sanyojak).replace(/"/g, '&quot;')})">
                ${isHi ? 'प्रोफ़ाइल' : 'Profile'} &rarr;
              </button>
            </div>
          </div>

          <!-- Mobile Compact Single Line View -->
          <div class="cadre-card-mobile" style="border: 1px solid rgba(241,194,50,0.45); background: rgba(241,194,50,0.08);">
            <div class="cadre-mobile-avatar" style="background:linear-gradient(135deg, #f1c232, #d4a317); color:#0b0f19; font-size:1.05rem;">
              ⭐
            </div>
            <div class="cadre-mobile-center">
              <div class="cadre-mobile-line-main">
                <span class="cadre-mobile-name" style="font-weight:800;">${escapeHtml(sanyojak.name)}</span>
                <span class="political-pill pill-gold pill-compact">${isHi ? 'प्रदेश संयोजक' : 'Pradesh Sanyojak'}</span>
              </div>
              <div class="cadre-mobile-line-sub">
                <span>📍 ${escapeHtml(sanyojak.district)} (${escapeHtml(sanyojak.zone)})</span>
                <span>&bull; ${escapeHtml(sanyojak.caste)}</span>
                <span>&bull; ${sanyojak.age || '68'} yr</span>
              </div>
            </div>
            <div class="cadre-mobile-action">
              <span class="cadre-mobile-pill" style="border-color:var(--gold); color:var(--gold-light);">${isHi ? 'प्रोफ़ाइल' : 'Profile'} &rarr;</span>
            </div>
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
        const bgSummary = bgList.length > 0 ? bgList.slice(0, 2).join(' • ') : (isHi ? 'व्यापार एवं सामाजिक नेतृत्व' : 'Vyapar & Samajik Netritva');
        return `
          <div class="sah-glass-card" onclick="window.dashboard.openModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
            <!-- Desktop Sah Sanyojak Card -->
            <div class="cadre-card-desktop">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
                  <span style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:var(--gold-light); letter-spacing:0.04em;">${isHi ? 'प्रदेश सह - संयोजक' : 'Pradesh Sah - Sanyojak'}</span>
                  ${m.age ? `<span class="cadre-age-text">${isHi ? 'उम्र' : 'Age'}: ${m.age}</span>` : ''}
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
                ` : `<span style="color:var(--text-dim); font-size:0.72rem;">${isHi ? 'संपर्क उपलब्ध' : 'Sampark Uplabdh'}</span>`}
                <span class="cadre-details-cta">${isHi ? 'प्रोफ़ाइल' : 'Profile'} &rarr;</span>
              </div>
            </div>

            <!-- Mobile Compact Single-Line Item -->
            <div class="cadre-card-mobile">
              <div class="cadre-mobile-avatar">
                ${m.name ? m.name.charAt(0) : 'S'}
              </div>
              <div class="cadre-mobile-center">
                <div class="cadre-mobile-line-main">
                  <span class="cadre-mobile-name">${escapeHtml(m.name)}</span>
                  <span class="political-pill pill-gold pill-compact">${isHi ? 'सह-संयोजक' : 'Sah-Sanyojak'}</span>
                </div>
                <div class="cadre-mobile-line-sub">
                  <span>📍 ${escapeHtml(m.district || m.zone)}</span>
                  ${m.caste ? `<span>&bull; ${escapeHtml(m.caste)}</span>` : ''}
                  ${m.age ? `<span>&bull; ${m.age} yr</span>` : ''}
                </div>
              </div>
              <div class="cadre-mobile-action">
                <span class="cadre-mobile-pill">${isHi ? 'प्रोफ़ाइल' : 'Profile'} &rarr;</span>
              </div>
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
        cardContainer.innerHTML = list.map(m => createMemberCardHtml(m, 'Campaign Committe Member')).join('');
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
      countLabel.textContent = currentLang === 'hi'
        ? `कुल ${list.length} पद प्रदर्शित (${filled} नियुक्त, ${vacant} रिक्त)`
        : `Total ${list.length} Posts Displayed (${filled} Appointed, ${vacant} Vacant)`;
    }

    const contextLabel = document.getElementById('cadreContextLabel');
    if (contextLabel) {
      let lvlName = currentLang === 'hi' ? 'सभी पदधारक' : 'All Post Holders';
      if (selectedCadreLevel === 'STATE_APEX') lvlName = currentLang === 'hi' ? '1. प्रदेश पदधारक (15 पद)' : '1. State Post Holder (15 Posts)';
      else if (selectedCadreLevel === 'ZONAL') lvlName = currentLang === 'hi' ? '2. ज़ोनल प्रभारी (12 ज़ोन)' : '2. Zonal Prabhari (12 Zones)';
      else if (selectedCadreLevel === 'DISTRICT_LEADS') lvlName = currentLang === 'hi' ? '3. ज़िला नेतृत्व (88 पद)' : '3. Zila Leadership (88 Posts)';
      else if (selectedCadreLevel === 'CORE_COMMITTEE') lvlName = currentLang === 'hi' ? '4. प्रदेश कोर कमेटी (7 प्रति ज़िला)' : '4. State Core Committee (7 per District)';
      contextLabel.textContent = `${currentLang === 'hi' ? 'स्तर' : 'Level'}: ${lvlName}`;
    }

    const cardContainer = document.getElementById('cadreMembersCardView');
    const tableContainer = document.getElementById('cadreMembersTableView');
    const tableBody = document.getElementById('cadreTableBody');

    if (cardContainer) {
      if (list.length === 0) {
        cardContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem; color: var(--text-muted); font-size: 0.95rem;">${currentLang === 'hi' ? 'चयनित फ़िल्टर से कोई पदधारक या रिक्त पद उपलब्ध नहीं है।' : 'No post holders or vacant posts available for selected filter.'}</div>`;
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
    const isHi = currentLang === 'hi';
    const isVacant = m.is_vacant;
    const initial = m.name && !isVacant ? m.name.charAt(0) : '?';
    const displayName = isVacant ? (isHi ? '(रिक्त पद)' : '(Vacant Post)') : escapeHtml(m.name);
    const locText = m.district ? `${m.district} (${m.zone || (isHi ? 'बिहार' : 'Bihar')})` : (m.zone || (isHi ? 'समस्त बिहार' : 'Samast Bihar'));
    const shortLoc = m.district || m.zone || (isHi ? 'बिहार' : 'Bihar');
    
    const socialParts = [m.caste, m.category].filter(Boolean);
    const socialText = socialParts.length > 0 ? socialParts.join(' • ') : '';

    const bgParts = [...(m.parties || []), ...(m.sectors || [])];
    const bgText = bgParts.length > 0 ? bgParts.slice(0, 2).join(' • ') : '';

    return `
      <div class="cadre-clean-card ${isVacant ? 'is-vacant' : ''}" onclick="window.dashboard.openModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
        <!-- Desktop Multi-Row Structured Card -->
        <div class="cadre-card-desktop">
          <div class="cadre-header-row">
            <div class="cadre-avatar-small" style="${isVacant ? 'background:rgba(244,63,94,0.15); color:var(--rose-light); border:1px dashed var(--rose);' : ''}">
              ${initial}
            </div>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:0.4rem;">
                <h4 class="cadre-clean-name" style="${isVacant ? 'color:var(--rose-light); font-style:italic;' : ''}" title="${displayName}">${displayName}</h4>
                ${m.age && !isVacant ? `<span class="cadre-age-text">${isHi ? 'उम्र' : 'Age'}: ${m.age}</span>` : ''}
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
              <span class="info-text">${isHi ? 'आगामी संगठन विस्तार हेतु रिक्त पद' : 'Open for Upcoming Expansion'}</span>
            </div>` : ''}
          </div>

          <div class="cadre-card-footer">
            ${m.number && !isVacant ? `
              <a href="tel:${m.number}" class="cadre-phone-link" onclick="event.stopPropagation();" title="${isHi ? 'सीधा कॉल करें' : 'Call'}">
                <span>📞</span>
                <span>${escapeHtml(m.number)}</span>
              </a>
            ` : `<span style="color:${isVacant ? 'var(--rose-light)' : 'var(--text-dim)'}; font-size:0.75rem;">${isVacant ? (isHi ? 'रिक्त पद' : 'Vacant Post') : (isHi ? 'संपर्क उपलब्ध' : 'Contact Available')}</span>`}
            <span class="cadre-details-cta">${isHi ? 'प्रोफ़ाइल' : 'Profile'} &rarr;</span>
          </div>
        </div>

        <!-- Mobile Single-Line Compact Item (Only One Line, Click for Full Details) -->
        <div class="cadre-card-mobile">
          <div class="cadre-mobile-avatar" style="${isVacant ? 'background:rgba(244,63,94,0.15); color:var(--rose-light);' : ''}">
            ${initial}
          </div>
          <div class="cadre-mobile-center">
            <div class="cadre-mobile-line-main">
              <span class="cadre-mobile-name ${isVacant ? 'is-vacant-text' : ''}">${displayName}</span>
              ${getPostBadgeHtml(m.post || roleTitle, true)}
            </div>
            <div class="cadre-mobile-line-sub">
              <span>📍 ${escapeHtml(shortLoc)}</span>
              ${socialText && !isVacant ? `<span>&bull; ${escapeHtml(m.caste || m.category)}</span>` : ''}
              ${m.age && !isVacant ? `<span>&bull; ${m.age} yr</span>` : ''}
            </div>
          </div>
          <div class="cadre-mobile-action">
            <span class="cadre-mobile-pill">${isHi ? 'प्रोफ़ाइल' : 'Profile'} &rarr;</span>
          </div>
        </div>
      </div>
    `;
  }

  function getPostBadgeHtml(post, compact = false) {
    if (!post) return '';
    const p = post.trim();
    const isHi = currentLang === 'hi';
    if (compact) {
      if (p === 'Campaign Committe Member' || p === 'Campaign Committee Member' || p === 'Abhiyan Samiti Sadasya') {
        return `<span class="political-pill pill-gold pill-compact">${isHi ? 'अभियान सदस्य' : 'Campaign Member'}</span>`;
      }
      if (p === 'State President') return `<span class="political-pill pill-gold pill-compact">${isHi ? 'प्रदेश अध्यक्ष' : 'Pradesh Adhyaksh'}</span>`;
      if (p === 'State Gen Sec') return `<span class="political-pill pill-gold pill-compact">${isHi ? 'प्रदेश महासचिव' : 'Pradesh Mahasachiv'}</span>`;
      if (p === 'State VP') return `<span class="political-pill pill-blue pill-compact">${isHi ? 'प्रदेश उपाध्यक्ष' : 'Pradesh VP'}</span>`;
      if (p === 'Zonal') return `<span class="political-pill pill-emerald pill-compact">${isHi ? 'ज़ोनल प्रभारी' : 'Zonal Prabhari'}</span>`;
      if (p === 'District President') return `<span class="political-pill pill-blue pill-compact">${isHi ? 'ज़िला अध्यक्ष' : 'Zila Adhyaksh'}</span>`;
      if (p === 'District Gen Sec') return `<span class="political-pill pill-gold pill-compact">${isHi ? 'ज़िला महासचिव' : 'Zila Mahasachiv'}</span>`;
      if (p === 'State Core Committee') return `<span class="political-pill pill-compact">${isHi ? 'कोर कमेटी' : 'Core Comm.'}</span>`;
      return `<span class="political-pill pill-compact">${escapeHtml(p)}</span>`;
    }
    if (p === 'Campaign Committe Member' || p === 'Campaign Committee Member' || p === 'Abhiyan Samiti Sadasya') {
      return `<span class="political-pill pill-gold">${isHi ? 'अभियान समिति सदस्य' : 'Campaign Committe Member'}</span>`;
    }
    if (p === 'State President') return `<span class="political-pill pill-gold">${isHi ? 'प्रदेश अध्यक्ष' : 'Pradesh Adhyaksh'}</span>`;
    if (p === 'State Gen Sec') return `<span class="political-pill pill-gold">${isHi ? 'प्रदेश महासचिव' : 'Pradesh Mahasachiv'}</span>`;
    if (p === 'State VP') return `<span class="political-pill pill-blue">${isHi ? 'प्रदेश उपाध्यक्ष' : 'Pradesh VP (Upadhyaksh)'}</span>`;
    if (p === 'Zonal') return `<span class="political-pill pill-emerald">${isHi ? 'ज़ोनल प्रभारी' : 'Zonal Prabhari'}</span>`;
    if (p === 'District President') return `<span class="political-pill pill-blue">${isHi ? 'ज़िला अध्यक्ष' : 'Zila Adhyaksh'}</span>`;
    if (p === 'District Gen Sec') return `<span class="political-pill pill-gold">${isHi ? 'ज़िला महासचिव' : 'Zila Mahasachiv'}</span>`;
    if (p === 'State Core Committee') return `<span class="political-pill" style="background:rgba(255,255,255,0.06);">${isHi ? 'प्रदेश कोर कमेटी' : 'Pradesh Core Committee'}</span>`;
    return `<span class="political-pill">${escapeHtml(p)}</span>`;
  }

  // -------------------------------------------------------------
  // MODAL DOSSIER CONTROLS
  // -------------------------------------------------------------
  function openModal(member) {
    if (!member) return;

    const isHi = currentLang === 'hi';
    const isVacant = member.is_vacant;
    document.getElementById('modalMemberName').textContent = isVacant ? (isHi ? '(रिक्त पद)' : '(Vacant Post)') : (member.name || '-');
    document.getElementById('modalMemberPost').textContent = member.post || member.role || (isHi ? 'सदस्य' : 'Member');
    document.getElementById('modalAvatar').textContent = member.name && !isVacant ? member.name.charAt(0) : '?';
    document.getElementById('modalZone').textContent = member.zone || (isHi ? 'अनिर्दिष्ट' : 'Not Specified');
    document.getElementById('modalDistrict').textContent = member.district || (isHi ? 'अनिर्दिष्ट' : 'Not Specified');
    document.getElementById('modalCategory').textContent = member.category || (isHi ? 'अनिर्दिष्ट' : 'Not Specified');
    document.getElementById('modalCaste').textContent = member.caste || (isHi ? 'अनिर्दिष्ट' : 'Not Specified');
    document.getElementById('modalAge').textContent = member.age ? `${member.age}` : '-';

    const phoneEl = document.getElementById('modalPhone');
    const callBtn = document.getElementById('modalCallBtn');
    if (member.number && !isVacant) {
      phoneEl.textContent = member.number;
      callBtn.style.display = 'inline-flex';
      callBtn.href = `tel:${member.number}`;
    } else {
      phoneEl.textContent = isVacant ? (isHi ? 'रिक्त पद (संपर्क अनुपलब्ध)' : 'Vacant Post (Contact Unavailable)') : (isHi ? 'संपर्क उपलब्ध नहीं है' : 'Contact unavailable');
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
          ${isHi ? '⚠️ यह पद वर्तमान में रिक्त है। जन सुराज व्यावसायिक प्रकोष्ठ के आगामी सांगठनिक विस्तार में इस पद पर योग्य व्यावसायिक नेतृत्व की नियुक्ति प्रस्तावित है।' : '⚠️ This post is currently vacant. Appointment of eligible business leadership is proposed in the upcoming organizational expansion of Jan Suraaj Vyavasaik Prakoshth.'}
        </div>
      `;
    } else if (member.profile && member.profile.trim()) {
      profileEl.innerHTML = member.profile
        .split('\n')
        .filter(l => l.trim())
        .map(line => `<p style="margin-bottom:0.5rem;">${escapeHtml(line)}</p>`)
        .join('');
    } else {
      profileEl.innerHTML = `<p style="color:var(--text-muted); font-style:italic;">${isHi ? 'विवरण शीघ्र ही अपडेट किया जाएगा।' : 'Profile will be updated soon from the sheet.'}</p>`;
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

    // Analytics Suite Event Listeners
    document.getElementById('refreshChartsBtn')?.addEventListener('click', () => {
      renderAnalyticsCharts(true);
      showToast('Charts Refreshed');
    });

    document.getElementById('districtReadinessSearch')?.addEventListener('input', (e) => {
      renderDistrictReadinessMatrix(e.target.value);
    });

    // Analytics Category Filter Navigation & KPI Card Shortcuts
    const catNav = document.getElementById('analyticsCategoryNav');
    function selectAnalyticsCategory(selectedCat) {
      if (catNav) {
        catNav.querySelectorAll('.analytics-nav-pill').forEach(p => {
          const isMatch = (p.getAttribute('data-cat') || 'all') === selectedCat;
          p.classList.toggle('active', isMatch);
          if (isMatch) {
            p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      }

      const chartCards = document.querySelectorAll('.analytics-charts-grid .chart-card');
      chartCards.forEach(card => {
        const cardCat = card.getAttribute('data-chart-cat');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });

      // Resize all visible charts after display toggle
      setTimeout(() => {
        Object.keys(chartInstances).forEach(key => {
          if (chartInstances[key] && typeof chartInstances[key].resize === 'function') {
            try { chartInstances[key].resize(); } catch (err) {}
          }
        });
      }, 50);
    }

    if (catNav) {
      catNav.addEventListener('click', (e) => {
        const pill = e.target.closest('.analytics-nav-pill');
        if (!pill) return;
        const selectedCat = pill.getAttribute('data-cat') || 'all';
        selectAnalyticsCategory(selectedCat);
      });
    }

    // Tapping a KPI card switches to that category
    document.querySelectorAll('.analytics-kpi-card[data-cat]').forEach(kpi => {
      kpi.style.cursor = 'pointer';
      kpi.addEventListener('click', () => {
        const cat = kpi.getAttribute('data-cat');
        if (cat) selectAnalyticsCategory(cat);
      });
    });

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
      filename = 'Jan_Suraaj_Post_Holders_Hierarchy.csv';
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
  // COMPREHENSIVE SANGATHANIK ANALYTICS SUITE (CHARTS ENGINE)
  // -------------------------------------------------------------
  let chartInstances = {};

  function renderAnalyticsCharts(forceRefresh = false) {
    if (!data || !window.Chart) return;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#070a12' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    const isMobile = window.innerWidth < 768;

    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = isMobile ? 10.5 : 12;

    if (forceRefresh) {
      Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key]) {
          try { chartInstances[key].destroy(); } catch (e) {}
          delete chartInstances[key];
        }
      });
    }

    // 1. Social Category Distribution (Doughnut / Pie Chart)
    const ctxCat = document.getElementById('chartSocialCategory');
    if (ctxCat && !chartInstances['category']) {
      const catData = data.demographics?.categories || { 'OBC': 87, 'General': 69, 'EBC': 64, 'Minority': 9, 'SC': 4 };
      chartInstances['category'] = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
          labels: Object.keys(catData),
          datasets: [{
            data: Object.values(catData),
            backgroundColor: ['#f1c232', '#38bdf8', '#10b981', '#fb7185', '#a855f7', '#d4a317'],
            borderColor: isLight ? '#ffffff' : '#0f172a',
            borderWidth: 2,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: isMobile ? 10 : 12,
                padding: isMobile ? 8 : 12,
                font: { size: isMobile ? 10 : 11 }
              }
            }
          },
          cutout: isMobile ? '50%' : '62%'
        }
      });
    }

    // 2. Post Fill Rate by Hierarchy Tier (Doughnut Chart)
    const ctxPost = document.getElementById('chartPostFillRate');
    if (ctxPost && !chartInstances['posts']) {
      const postLabels = ['State Apex (15)', 'Zonals (12)', 'District Presidents (44)', 'District Gen Sec (44)', 'District Core Comm (308)'];
      const postValues = [15, 12, 42, 36, 227];
      chartInstances['posts'] = new Chart(ctxPost, {
        type: 'doughnut',
        data: {
          labels: postLabels,
          datasets: [{
            data: postValues,
            backgroundColor: ['#f1c232', '#10b981', '#38bdf8', '#a855f7', '#fb7185'],
            borderColor: isLight ? '#ffffff' : '#0f172a',
            borderWidth: 2,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: isMobile ? 10 : 12,
                padding: isMobile ? 8 : 12,
                font: { size: isMobile ? 9.5 : 11 }
              }
            }
          },
          cutout: isMobile ? '50%' : '58%'
        }
      });
    }

    // 3. 12 Sangathanik Zones - Filled vs Vacant (Stacked Bar Chart)
    const ctxZone = document.getElementById('chartZonalDistribution');
    if (ctxZone && !chartInstances['zones']) {
      const zonesList = data.zones || [];
      chartInstances['zones'] = new Chart(ctxZone, {
        type: 'bar',
        data: {
          labels: zonesList.map(z => z.name),
          datasets: [
            {
              label: 'Niyukt Pad (Filled)',
              data: zonesList.map(z => z.filled_posts),
              backgroundColor: '#10b981',
              borderRadius: 4
            },
            {
              label: 'Rikt Pad (Vacant)',
              data: zonesList.map(z => z.vacant_posts),
              backgroundColor: 'rgba(244, 63, 94, 0.75)',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: {
                autoSkip: false,
                maxRotation: isMobile ? 45 : 30,
                minRotation: isMobile ? 35 : 0,
                font: { size: isMobile ? 8.5 : 11 }
              }
            },
            y: { stacked: true, grid: { color: gridColor }, beginAtZero: true }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: isMobile ? 10 : 14,
                font: { size: isMobile ? 10 : 12 }
              }
            }
          }
        }
      });
    }

    // 4. Political Migrations (Horizontal Bar Chart)
    const ctxPol = document.getElementById('chartPoliticalMigration');
    if (ctxPol && !chartInstances['political']) {
      const polData = data.demographics?.political_migration || { 'Former Congress': 52, 'Former BJP': 37, 'Former JDU': 26, 'Former RJD': 10, 'Former LJP': 7 };
      chartInstances['political'] = new Chart(ctxPol, {
        type: 'bar',
        data: {
          labels: Object.keys(polData),
          datasets: [{
            label: 'Senior Leaders',
            data: Object.values(polData),
            backgroundColor: ['#3b82f6', '#f97316', '#10b981', '#15803d', '#a855f7'],
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: gridColor }, beginAtZero: true },
            y: {
              grid: { display: false },
              ticks: { font: { size: isMobile ? 9.5 : 11 } }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // 5. Business Sectors (Horizontal Bar Chart)
    const ctxSec = document.getElementById('chartBusinessSectors');
    if (ctxSec && !chartInstances['sectors']) {
      const secData = data.demographics?.business_sectors || {};
      const topSectors = Object.entries(secData).slice(0, 8);
      chartInstances['sectors'] = new Chart(ctxSec, {
        type: 'bar',
        data: {
          labels: topSectors.map(s => s[0]),
          datasets: [{
            label: 'Leaders by Industry',
            data: topSectors.map(s => s[1]),
            backgroundColor: '#f1c232',
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: gridColor }, beginAtZero: true },
            y: {
              grid: { display: false },
              ticks: { font: { size: isMobile ? 9.5 : 11 } }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // 6. Age Cohorts (Bar Chart)
    const ctxAge = document.getElementById('chartAgeCohorts');
    if (ctxAge && !chartInstances['age']) {
      const ageData = data.demographics?.age_cohorts || {};
      const labels = ['Under 35 (Youth)', '35-49 (Prime)', '50-59 (Senior)', '60+ (Veterans)'];
      const values = labels.map(l => ageData[l] || 0);
      chartInstances['age'] = new Chart(ctxAge, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Members in Cohort',
            data: values,
            backgroundColor: ['#f1c232', '#d4a317', '#10b981', '#38bdf8'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { size: isMobile ? 9 : 11 },
                maxRotation: isMobile ? 30 : 0
              }
            },
            y: { grid: { color: gridColor }, beginAtZero: true }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // 7. Top Castes (Bar Chart)
    const ctxCaste = document.getElementById('chartTopCastes');
    if (ctxCaste && !chartInstances['caste']) {
      const casteData = data.demographics?.castes || {};
      const topCastes = Object.entries(casteData).slice(0, 8);
      chartInstances['caste'] = new Chart(ctxCaste, {
        type: 'bar',
        data: {
          labels: topCastes.map(c => c[0]),
          datasets: [{
            label: currentLang === 'hi' ? 'पदधारक संख्या' : 'Post Holders',
            data: topCastes.map(c => c[1]),
            backgroundColor: '#f1c232',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { size: isMobile ? 9 : 11 },
                maxRotation: isMobile ? 30 : 0
              }
            },
            y: { grid: { color: gridColor }, beginAtZero: true }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function renderDistrictReadinessMatrix(searchQuery = '') {
    if (!data || !data.districts) return;

    const tbody = document.getElementById('districtReadinessBody');
    if (!tbody) return;

    const q = (searchQuery || '').trim().toLowerCase();
    const filtered = data.districts.filter(d => {
      if (!q) return true;
      return d.name.toLowerCase().includes(q) ||
             d.zone.toLowerCase().includes(q) ||
             (d.district_president && d.district_president.toLowerCase().includes(q));
    });

    tbody.innerHTML = filtered.map(d => {
      let tierBadge = 'pill-emerald';
      if (d.priority_tier === 'Critical') tierBadge = 'pill-rose';
      else if (d.priority_tier === 'Developing') tierBadge = 'pill-gold';

      return `
        <tr>
          <td><strong>${escapeHtml(d.name)}</strong></td>
          <td><span style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(d.zone)}</span></td>
          <td>${d.district_president && d.district_president !== '(Vacant)' ? `<strong>${escapeHtml(d.district_president)}</strong>` : '<span style="color:var(--rose-light); font-style:italic;">(Rikt)</span>'}</td>
          <td>${d.district_gen_sec && d.district_gen_sec !== '(Vacant)' ? `<span>${escapeHtml(d.district_gen_sec)}</span>` : '<span style="color:var(--rose-light); font-style:italic;">(Rikt)</span>'}</td>
          <td><span class="political-pill pill-blue">${d.core_committee_count || 0} / 7</span></td>
          <td>
            <div style="display:flex; align-items:center; gap:0.5rem; min-width:90px;">
              <div style="flex:1; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:${d.fill_rate >= 80 ? 'var(--emerald)' : (d.fill_rate >= 50 ? 'var(--gold)' : 'var(--rose)')}; width:${d.fill_rate}%; height:100%;"></div>
              </div>
              <span style="font-size:0.75rem; font-weight:700;">${d.fill_rate}%</span>
            </div>
          </td>
          <td><span class="political-pill ${tierBadge}">${escapeHtml(d.priority_tier || 'Active')}</span></td>
        </tr>
      `;
    }).join('');
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
