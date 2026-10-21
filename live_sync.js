/**
 * Live Google Sheets Dynamic Sync Engine for Vyavasaik Prakoshth Dashboard
 * Connects directly to Google Sheets in real-time with instant updates.
 */

(function(window) {
  'use strict';

  const SHEET_ID = '1CifDZWm_rhf6abDpKf-5ZH2hLQnFTmJZoaNssKZjA_g';

  // GIDs for sheets in Google Spreadsheet
  const GIDS = {
    CAMPAIGN_COMMITTEE: '1479512254', // Campaign Committe
    GAP_REPORT: '95169980',            // GAP Report
    SWG_CADRE: '1093147435'            // Vyvsaik SWG+DP/GS
  };

  const RANK_MAP = {
    'State President': 1,
    'State Gen Sec': 2,
    'State VP': 3,
    'Zonal': 4,
    'District President': 5,
    'District Gen Sec': 6,
    'State Core Committee': 7
  };

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let entry = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          entry += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(entry);
        entry = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(entry);
        rows.push(row);
        row = [];
        entry = '';
      } else {
        entry += char;
      }
    }
    if (entry || row.length > 0) {
      row.push(entry);
      rows.push(row);
    }
    return rows;
  }

  function cleanPhone(num) {
    if (!num) return '';
    let s = String(num).trim();
    if (s.endsWith('.0')) s = s.slice(0, -2);
    return s.replace(/[^0-9+]/g, '');
  }

  function cleanAge(val) {
    if (!val) return null;
    const n = parseInt(val, 10);
    return isNaN(n) ? null : n;
  }

  function extractProfileTags(profile) {
    const pLower = (profile || '').toLowerCase();
    const parties = [];
    if (pLower.includes('bjp')) parties.push('Former BJP');
    if (pLower.includes('jdu') || pLower.includes('jd(u)')) parties.push('Former JDU');
    if (pLower.includes('congress') || pLower.includes('inc')) parties.push('Former Congress');
    if (pLower.includes('rjd')) parties.push('Former RJD');
    if (pLower.includes('ljp')) parties.push('Former LJP');

    const sectors = [];
    if (['hotel', 'resort', 'restaurant'].some(k => pLower.includes(k))) sectors.push('Hospitality');
    if (['poultry', 'hatchery', 'egg', 'cattle'].some(k => pLower.includes(k))) sectors.push('Poultry & Agro');
    if (['jewell', 'swarn', 'gold'].some(k => pLower.includes(k))) sectors.push('Jewellery');
    if (['nursing', 'doctor', 'hospital', 'medicine', 'drug', 'chemist'].some(k => pLower.includes(k))) sectors.push('Healthcare & Pharma');
    if (['auto', 'tvs', 'tyre', 'electric', 'ev'].some(k => pLower.includes(k))) sectors.push('Automobile & EV');
    if (['contractor', 'construction', 'building', 'cement', 'real estate', 'mining', 'mines'].some(k => pLower.includes(k))) sectors.push('Construction & Real Estate');
    if (['college', 'school', 'vidhyalay', 'education'].some(k => pLower.includes(k))) sectors.push('Education');
    if (['petrol', 'gas agency'].some(k => pLower.includes(k))) sectors.push('Petroleum & Energy');
    if (['transport', 'truck', 'bus'].some(k => pLower.includes(k))) sectors.push('Logistics & Transport');
    if (['advocate', 'lawyer', 'llb'].some(k => pLower.includes(k))) sectors.push('Legal');
    if (['wholesale', 'trading', 'shop', 'retail', 'dealer', 'vyapar'].some(k => pLower.includes(k))) sectors.push('Trading & Retail');
    if (['mukhiya', 'sarpanch', 'ward parshad', 'pacs', 'parshad', 'nagar parishad', 'bdc'].some(k => pLower.includes(k))) sectors.push('Grassroots Elected');

    return { parties, sectors };
  }

  async function fetchCsvByGid(gid) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&_t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching GID ${gid}`);
    const text = await res.text();
    return parseCSV(text);
  }

  async function fetchDirectFromSheets() {
    const [ccRows, gapRows, swgRows] = await Promise.all([
      fetchCsvByGid(GIDS.CAMPAIGN_COMMITTEE),
      fetchCsvByGid(GIDS.GAP_REPORT),
      fetchCsvByGid(GIDS.SWG_CADRE)
    ]);

    // 1. Campaign Committee
    const campaignCommittee = [];
    let currentRole = 'Members';
    let currentZone = '';

    for (let r = 0; r < ccRows.length; r++) {
      const row = ccRows[r];
      if (!row || !row.length) continue;
      const valA = (row[0] || '').trim();
      const lowerA = valA.toLowerCase();

      if (['sanyojak', 'members', 'committee'].some(kw => lowerA.includes(kw))) {
        if (lowerA.includes('kshetriya')) currentRole = 'Kshetriya Sanyojak';
        else if (lowerA.includes('sah')) currentRole = 'Sah Sanyojak';
        else if (lowerA.includes('sanyojak')) currentRole = 'Sanyojak';
        else currentRole = valA;
        continue;
      }
      if (['sr no', 'sr. no', 'sr_no', 's no', 'sanyojak sr no'].some(kw => lowerA.includes(kw))) {
        continue;
      }

      const sr = row[0];
      const zone = (row[1] || '').trim();
      const district = (row[2] || '').trim();
      const name = (row[3] || '').trim();
      const number = row[4];
      const age = row[5];
      const category = (row[6] || '').trim();
      const caste = (row[7] || '').trim();
      const profile = (row[8] || '').trim();

      if (zone) currentZone = zone;

      if (name || district || (!isNaN(parseInt(sr, 10)) && parseInt(sr, 10) > 0)) {
        const isVacant = !name || name === '-' || name.toLowerCase().includes('vacant');
        const { parties, sectors } = extractProfileTags(profile);

        let catClean = category;
        if (['gen', 'general'].includes(catClean.toLowerCase())) catClean = 'General';

        let casteClean = caste;
        if (['bania', 'baniya'].includes(casteClean.toLowerCase())) casteClean = 'Baniya';
        else if (casteClean.toLowerCase().includes('kalwar')) casteClean = 'Kalwar';
        else if (casteClean.toLowerCase().includes('brahmin') || casteClean.toLowerCase().includes('bhraman')) casteClean = 'Brahmin';

        campaignCommittee.push({
          sr: campaignCommittee.length + 1,
          role: currentRole,
          role_tier: currentRole === 'Sanyojak' ? 1 : (currentRole === 'Sah Sanyojak' ? 2 : 3),
          zone: currentZone,
          district,
          name: isVacant ? '(Vacant / To be Appointed)' : name,
          is_vacant: isVacant,
          number: cleanPhone(number),
          age: cleanAge(age),
          category: catClean,
          caste: casteClean,
          profile,
          parties,
          sectors
        });
      }
    }

    // 2. GAP Report
    const gapByDistrict = {};
    for (let r = 0; r < gapRows.length; r++) {
      const row = gapRows[r];
      if (!row || row.length < 2) continue;
      const dName = (row[1] || '').trim();
      if (!dName || dName.toLowerCase() === 'district' || dName.toLowerCase() === 'total') continue;

      const cleanName = dName.replace(/\n/g, '').trim();
      gapByDistrict[cleanName.toLowerCase()] = {
        district: cleanName,
        target: parseInt(row[2], 10) || 0,
        achieved: parseInt(row[3], 10) || 0,
        gap: parseInt(row[4], 10) || 0,
        poc: (row[5] || '').trim()
      };
    }

    // 3. SWG Members
    const swgMembers = [];
    for (let r = 1; r < swgRows.length; r++) {
      const row = swgRows[r];
      if (!row || !row.length) continue;

      const sr = (row[0] || '').trim();
      const zone = (row[1] || '').trim();
      const dist = (row[2] || '').trim();
      const post = (row[3] || '').trim();
      const name = (row[5] || '').trim();
      const num = row[6];
      const age = row[7];
      const cat = (row[8] || '').trim();
      const caste = (row[9] || '').trim();
      const prof = (row[10] || '').trim();

      if (!RANK_MAP[post]) continue;
      if (['sr no', 'sr. no', 'sr_no'].includes(sr.toLowerCase())) continue;

      const isVacant = !name || name === '-' || name.toLowerCase().includes('vacant');
      const { parties, sectors } = extractProfileTags(prof);

      let catClean = cat;
      if (['gen', 'general'].includes(catClean.toLowerCase())) catClean = 'General';
      else if (catClean.toLowerCase() === 'baudhist') catClean = 'Minority (Buddhist)';
      else if (catClean.toLowerCase() === 'minority') catClean = 'Minority';

      let casteClean = caste;
      if (['bania', 'baniya'].includes(casteClean.toLowerCase())) casteClean = 'Baniya';
      else if (casteClean.toLowerCase().includes('kalwar')) casteClean = 'Kalwar';
      else if (casteClean.toLowerCase().includes('brahmin') || casteClean.toLowerCase().includes('bhraman')) casteClean = 'Brahmin';

      swgMembers.push({
        id: swgMembers.length + 1,
        sr_no: sr || swgMembers.length + 1,
        zone,
        district: dist,
        post,
        post_rank: RANK_MAP[post] || 99,
        name: isVacant ? '(Vacant)' : name,
        is_vacant: isVacant,
        number: cleanPhone(num),
        age: cleanAge(age),
        category: catClean,
        caste: casteClean,
        profile: prof,
        parties,
        sectors
      });
    }

    // 4. Zones & Districts
    const zonesMap = {};
    const districtsMap = {};

    swgMembers.forEach(m => {
      const z = m.zone;
      const d = m.district;

      if (z) {
        if (!zonesMap[z]) {
          zonesMap[z] = { name: z, districts: new Set(), total_posts: 0, filled_posts: 0, vacant_posts: 0, zonal_lead: null };
        }
        if (d) zonesMap[z].districts.add(d);
        zonesMap[z].total_posts++;
        if (m.is_vacant) zonesMap[z].vacant_posts++;
        else {
          zonesMap[z].filled_posts++;
          if (m.post === 'Zonal') zonesMap[z].zonal_lead = m.name;
        }
      }

      if (d) {
        if (!districtsMap[d]) {
          districtsMap[d] = {
            name: d,
            zone: z,
            total_posts: 0,
            filled_posts: 0,
            vacant_posts: 0,
            district_president: null,
            district_gen_sec: null,
            core_committee_count: 0,
            gap_target: 7,
            gap_achieved: 0,
            gap_remaining: 0,
            poc: ''
          };
        }
        districtsMap[d].total_posts++;
        if (m.is_vacant) districtsMap[d].vacant_posts++;
        else {
          districtsMap[d].filled_posts++;
          if (m.post === 'District President') districtsMap[d].district_president = m.name;
          else if (m.post === 'District Gen Sec') districtsMap[d].district_gen_sec = m.name;
          else if (m.post === 'State Core Committee') districtsMap[d].core_committee_count++;
        }
      }
    });

    Object.keys(districtsMap).forEach(dName => {
      const dObj = districtsMap[dName];
      const key = dName.toLowerCase();
      let match = gapByDistrict[key];
      if (!match) {
        for (const k in gapByDistrict) {
          if (k.includes(key) || key.includes(k)) {
            match = gapByDistrict[k];
            break;
          }
        }
      }
      if (match) {
        dObj.gap_target = match.target;
        dObj.gap_achieved = match.achieved;
        dObj.gap_remaining = match.gap;
        dObj.poc = match.poc;
      } else {
        dObj.gap_target = 7;
        dObj.gap_achieved = dObj.filled_posts;
        dObj.gap_remaining = dObj.vacant_posts;
      }
    });

    const zonesList = Object.keys(zonesMap).sort().map(zName => {
      const zData = zonesMap[zName];
      return {
        name: zName,
        districts: Array.from(zData.districts).sort(),
        district_count: zData.districts.size,
        total_posts: zData.total_posts,
        filled_posts: zData.filled_posts,
        vacant_posts: zData.vacant_posts,
        fill_rate: zData.total_posts ? Number(((zData.filled_posts / zData.total_posts) * 100).toFixed(1)) : 0,
        zonal_lead: zData.zonal_lead || 'Not Appointed'
      };
    });

    const priorityCounts = { Vanguard: 0, Developing: 0, Critical: 0 };
    const districtsList = Object.keys(districtsMap).sort().map(dName => {
      const dData = districtsMap[dName];
      const rem = dData.gap_remaining;
      const hasDp = Boolean(dData.district_president);
      const hasDgs = Boolean(dData.district_gen_sec);

      let tier = 'Vanguard';
      if (rem >= 4 || !hasDp || !hasDgs) tier = 'Critical';
      else if (rem > 0) tier = 'Developing';

      priorityCounts[tier] = (priorityCounts[tier] || 0) + 1;

      return {
        name: dName,
        zone: dData.zone,
        total_posts: dData.total_posts,
        filled_posts: dData.filled_posts,
        vacant_posts: dData.vacant_posts,
        fill_rate: dData.total_posts ? Number(((dData.filled_posts / dData.total_posts) * 100).toFixed(1)) : 0,
        district_president: dData.district_president || '(Vacant)',
        district_gen_sec: dData.district_gen_sec || '(Vacant)',
        has_dp: hasDp,
        has_dgs: hasDgs,
        core_committee_count: dData.core_committee_count,
        gap_target: dData.gap_target,
        gap_achieved: dData.gap_achieved,
        gap_remaining: dData.gap_remaining,
        priority_tier: tier,
        poc: dData.poc
      };
    });

    // 5. Demographics
    const filledMembers = swgMembers.filter(m => !m.is_vacant);
    const allActiveMembers = filledMembers.concat(campaignCommittee.filter(m => !m.is_vacant));

    const categoryCounts = {};
    const casteCounts = {};
    allActiveMembers.forEach(m => {
      if (m.category) categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
      if (m.caste) casteCounts[m.caste] = (casteCounts[m.caste] || 0) + 1;
    });

    const politicalMigrationCounts = {};
    const sectorCounts = {};
    allActiveMembers.forEach(m => {
      (m.parties || []).forEach(p => {
        politicalMigrationCounts[p] = (politicalMigrationCounts[p] || 0) + 1;
      });
      (m.sectors || []).forEach(s => {
        sectorCounts[s] = (sectorCounts[s] || 0) + 1;
      });
    });

    const ageCohorts = { 'Under 35 (Youth)': 0, '35-49 (Prime)': 0, '50-59 (Senior)': 0, '60+ (Veterans)': 0, 'Unspecified': 0 };
    allActiveMembers.forEach(m => {
      const a = m.age;
      if (a) {
        if (a < 35) ageCohorts['Under 35 (Youth)']++;
        else if (a < 50) ageCohorts['35-49 (Prime)']++;
        else if (a < 60) ageCohorts['50-59 (Senior)']++;
        else ageCohorts['60+ (Veterans)']++;
      } else {
        ageCohorts['Unspecified']++;
      }
    });

    const postsCounts = {};
    const postsFilled = {};
    swgMembers.forEach(m => {
      if (m.post) {
        postsCounts[m.post] = (postsCounts[m.post] || 0) + 1;
        if (!m.is_vacant) postsFilled[m.post] = (postsFilled[m.post] || 0) + 1;
      }
    });

    const postsDistribution = {};
    Object.keys(postsCounts).forEach(p => {
      const tot = postsCounts[p];
      const fil = postsFilled[p] || 0;
      postsDistribution[p] = {
        total: tot,
        filled: fil,
        vacant: tot - fil,
        fill_rate: tot ? Number(((fil / tot) * 100).toFixed(1)) : 0
      };
    });

    const demographics = {
      categories: categoryCounts,
      castes: casteCounts,
      political_migration: politicalMigrationCounts,
      business_sectors: sectorCounts,
      age_cohorts: ageCohorts,
      district_priority_tiers: priorityCounts,
      posts_distribution: postsDistribution
    };

    const nowIso = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      last_updated: nowIso,
      source_sheet_url: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`,
      summary: {
        total_positions: swgMembers.length,
        filled_positions: filledMembers.length,
        vacant_positions: swgMembers.length - filledMembers.length,
        overall_fill_rate: swgMembers.length ? Number(((filledMembers.length / swgMembers.length) * 100).toFixed(1)) : 0,
        campaign_committee_count: campaignCommittee.length,
        zones_count: zonesList.length,
        districts_count: districtsList.length,
        grassroots_elected_count: allActiveMembers.filter(m => (m.sectors || []).includes('Grassroots Elected')).length,
        zero_gap_districts_count: districtsList.filter(d => d.gap_remaining === 0).length,
        critical_districts_count: priorityCounts.Critical || 0
      },
      campaign_committee: campaignCommittee,
      swg_members: swgMembers,
      zones: zonesList,
      districts: districtsList,
      demographics: demographics
    };
  }

  // Unified fetcher: tries /api/data first, falls back to direct Google Sheets fetch
  async function fetchLiveDataset() {
    try {
      const apiRes = await fetch(`/api/data?_t=${Date.now()}`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json && json.campaign_committee && json.swg_members) {
          return json;
        }
      }
    } catch (e) {
      // /api/data not available (static host or direct file access)
    }

    return await fetchDirectFromSheets();
  }

  let lastDataChecksum = '';
  function computeChecksum(data) {
    if (!data) return '';
    return `${data.summary?.total_positions || 0}_${data.summary?.filled_positions || 0}_${data.campaign_committee?.length || 0}_${data.summary?.overall_fill_rate || 0}`;
  }

  function updateStatusIndicator(timestamp) {
    const chipText = document.getElementById('syncStatusText');
    if (chipText) {
      const timeStr = timestamp ? timestamp.split(' ')[1] || timestamp : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      chipText.textContent = `Sheets Live: ${timeStr}`;
    }
  }

  let isSyncing = false;
  async function syncNow(callback, silent = false) {
    if (isSyncing) return;
    isSyncing = true;
    try {
      const freshData = await fetchLiveDataset();
      const newChecksum = computeChecksum(freshData);
      const isChanged = newChecksum !== lastDataChecksum;
      lastDataChecksum = newChecksum;

      updateStatusIndicator(freshData.last_updated);

      if (callback && (isChanged || !silent)) {
        callback(freshData, isChanged);
      }
    } catch (err) {
      console.warn('[LiveSheetsSync] Sync check error:', err);
    } finally {
      isSyncing = false;
    }
  }

  function startAutoSync(callback, intervalMs = 20000) {
    // Initial fetch right away
    syncNow(callback, true);

    // Periodic background polling (every 20 seconds)
    setInterval(() => {
      syncNow(callback, true);
    }, intervalMs);

    // Instant check when user switches back to this tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncNow(callback, true);
      }
    });

    window.addEventListener('focus', () => {
      syncNow(callback, true);
    });
  }

  window.LiveSheetsSync = {
    fetchLiveDataset,
    syncNow,
    startAutoSync
  };

})(window);
