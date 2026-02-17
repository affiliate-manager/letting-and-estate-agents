/* ==========================================================================
   Data loading and search index
   ========================================================================== */

let _data = null;

export async function loadData() {
  if (_data) return _data;
  const resp = await fetch('data/agents.json');
  _data = await resp.json();
  return _data;
}

export function getData() {
  return _data;
}

export function getAgent(id) {
  return _data ? _data.agents[id] : null;
}

export function getStats() {
  return _data ? _data.stats : {};
}

/**
 * Search agents by postcode or area name.
 * Returns sorted array of agent objects with a `_matchType` field.
 */
export function searchAgents(query, filters = {}) {
  if (!_data) return [];

  const q = query.trim().toUpperCase();
  const qLower = query.trim().toLowerCase();
  const matched = new Map(); // id -> { agent, matchType, matchPriority }

  // 1. Exact postcode match
  if (_data.postcodeIndex[q]) {
    for (const id of _data.postcodeIndex[q]) {
      matched.set(id, { agent: _data.agents[id], matchType: 'postcode', priority: 1 });
    }
  }

  // 2. Postcode prefix match (e.g., "SW1" matches "SW1A", "SW1V", etc.)
  if (q.length >= 2) {
    for (const [outcode, ids] of Object.entries(_data.postcodeIndex)) {
      if (outcode.startsWith(q) && outcode !== q) {
        for (const id of ids) {
          if (!matched.has(id)) {
            matched.set(id, { agent: _data.agents[id], matchType: 'nearby', priority: 2 });
          }
        }
      }
    }
  }

  // 3. Area name match (word-boundary aware to avoid "godmanchester" matching "manchester")
  if (qLower.length >= 2) {
    const qWordRe = new RegExp('(^|\\s)' + qLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)');
    for (const [area, ids] of Object.entries(_data.areaIndex)) {
      const isMatch = area === qLower || qWordRe.test(area) || qLower === area || qLower.includes(area + ' ') || qLower.startsWith(area + ' ') || qLower.endsWith(' ' + area);
      if (isMatch) {
        for (const id of ids) {
          if (!matched.has(id)) {
            matched.set(id, { agent: _data.agents[id], matchType: 'area', priority: 3 });
          }
        }
      }
    }
  }

  // 4. Agent name match (fallback)
  if (qLower.length >= 3) {
    for (const agent of _data.agents) {
      if (!matched.has(agent.id) && agent.name.toLowerCase().includes(qLower)) {
        matched.set(agent.id, { agent, matchType: 'name', priority: 4 });
      }
    }
  }

  let results = Array.from(matched.values());

  // Apply filters
  results = applyFilters(results, filters);

  // Sort: priority first, then by trust score + data richness within same priority
  results.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    // Same priority: more data-rich first
    const scoreA = a.agent.trust_score + a.agent.data_richness;
    const scoreB = b.agent.trust_score + b.agent.data_richness;
    return scoreB - scoreA;
  });

  return results.map(r => ({ ...r.agent, _matchType: r.matchType }));
}

/**
 * Apply filters to results
 */
function applyFilters(results, filters) {
  return results.filter(({ agent }) => {
    // Service type filter
    if (filters.serviceType) {
      const tiers = agent.service_tiers.map(t => t.toLowerCase());
      const services = agent.services.map(s => s.toLowerCase());
      const all = [...tiers, ...services].join(' ');
      if (filters.serviceType === 'tenant_find' && !all.includes('tenant find')) return false;
      if (filters.serviceType === 'full_management' && !all.includes('full management') && !all.includes('fully managed')) return false;
      if (filters.serviceType === 'guaranteed_rent' && !all.includes('guaranteed rent') && !agent.guaranteed_rent) return false;
    }

    // Agent type filter
    if (filters.agentType && agent.agent_type !== filters.agentType) return false;

    // Minimum trust score
    if (filters.minTrust && agent.trust_score < filters.minTrust) return false;

    // Has reviews
    if (filters.hasReviews && !agent.reviews.avg) return false;

    // Has fees
    if (filters.hasFees && !agent.fees.tenant_find && !agent.fees.full_management && !agent.fees.mgmt_pct) return false;

    // Regulatory
    if (filters.arla && !agent.regulatory.arla) return false;
    if (filters.cmp && !agent.regulatory.cmp) return false;

    // Guaranteed rent
    if (filters.guaranteedRent && !agent.guaranteed_rent) return false;

    // Experience level filter
    if (filters.experience && agent.experience !== filters.experience) return false;

    // Agent category (letting / estate / both)
    if (filters.category) {
      if (filters.category === 'letting' && agent.category !== 'letting' && agent.category !== 'both') return false;
      if (filters.category === 'estate' && agent.category !== 'estate' && agent.category !== 'both') return false;
      if (filters.category === 'letting_only' && agent.category !== 'letting') return false;
      if (filters.category === 'estate_only' && agent.category !== 'estate') return false;
      if (filters.category === 'both' && agent.category !== 'both') return false;
    }

    return true;
  });
}

/**
 * Sort results by specified criteria
 */
export function sortResults(agents, sortBy = 'trust') {
  const arr = [...agents];
  switch (sortBy) {
    case 'trust':
      arr.sort((a, b) => (b.trust_score + b.data_richness) - (a.trust_score + a.data_richness));
      break;
    case 'reviews':
      arr.sort((a, b) => (b.reviews.count || 0) - (a.reviews.count || 0));
      break;
    case 'rating':
      arr.sort((a, b) => (b.reviews.avg || 0) - (a.reviews.avg || 0));
      break;
    case 'fees_low':
      arr.sort((a, b) => (a.fees.mgmt_pct || 999) - (b.fees.mgmt_pct || 999));
      break;
    case 'years':
      arr.sort((a, b) => (b.performance.years || 0) - (a.performance.years || 0));
      break;
    case 'name':
      arr.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return arr;
}

/**
 * Get search suggestions for autocomplete
 */
export function getSuggestions(query) {
  if (!_data || query.length < 2) return [];
  const q = query.trim();
  const qUpper = q.toUpperCase();
  const qLower = q.toLowerCase();
  const suggestions = [];

  // Postcode matches
  for (const outcode of Object.keys(_data.postcodeIndex)) {
    if (outcode.startsWith(qUpper)) {
      const count = _data.postcodeIndex[outcode].length;
      suggestions.push({
        text: outcode,
        type: 'postcode',
        count,
        value: outcode,
      });
    }
    if (suggestions.length >= 5) break;
  }

  // Area name matches (word-boundary aware)
  const seenAreas = new Set();
  const sugRe = new RegExp('(^|\\s)' + qLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  for (const area of Object.keys(_data.areaIndex)) {
    if (sugRe.test(area) && !seenAreas.has(area) && area.length > 2) {
      const titleCase = area.charAt(0).toUpperCase() + area.slice(1);
      const count = _data.areaIndex[area].length;
      if (count >= 1) {
        suggestions.push({
          text: titleCase,
          type: 'area',
          count,
          value: area,
        });
        seenAreas.add(area);
      }
    }
    if (suggestions.length >= 10) break;
  }

  return suggestions.slice(0, 8);
}

/**
 * Get area stats for Local Market Intelligence
 */
export function getAreaStats(outcode) {
  if (!_data || !_data.postcodeIndex[outcode]) return null;
  const ids = _data.postcodeIndex[outcode];
  const agents = ids.map(id => _data.agents[id]);

  const ratings = agents.filter(a => a.reviews.avg).map(a => a.reviews.avg);
  const fees = agents.filter(a => a.fees.mgmt_pct).map(a => a.fees.mgmt_pct);
  const years = agents.filter(a => a.performance.years).map(a => a.performance.years);
  const types = {};
  agents.forEach(a => { if (a.agent_type) types[a.agent_type] = (types[a.agent_type] || 0) + 1; });

  return {
    outcode,
    agentCount: agents.length,
    avgTrust: agents.length ? Math.round(agents.reduce((s, a) => s + a.trust_score, 0) / agents.length) : 0,
    avgRating: ratings.length ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1) : null,
    avgFee: fees.length ? (fees.reduce((s, f) => s + f, 0) / fees.length).toFixed(1) : null,
    avgYears: years.length ? Math.round(years.reduce((s, y) => s + y, 0) / years.length) : null,
    agentTypes: types,
    agents,
  };
}
