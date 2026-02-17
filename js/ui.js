/* ==========================================================================
   Shared UI components - Header, Footer, Modals, Cards
   ========================================================================== */

import { SITE_NAME, FREE_RESULTS, SORT_OPTIONS, AGENT_TYPES } from './config.js';
import { ICONS, trustScoreClass, starsHTML, reviewPlatformsHTML, regBadgesHTML, fmtFee, fmtLocation, fmtAgentType, categoryBadgeHTML, experienceBadgeHTML, brandAgeHTML, initials, socialIconsHTML, hiddenFeesAlertHTML, portalBadgesHTML, complianceStatusHTML, guaranteedRentBadgeHTML, noTenantFeesBadgeHTML, naeaBadgeHTML, confidenceBadgeHTML, dataCompletenessHTML, fmtFeeSummaryHTML, areasCoveredHTML } from './utils.js';

/* ---------- Lendlord.io Top Bar ---------- */
const CHEVRON_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ll-chevron"><polyline points="6 9 12 15 18 9"/></svg>`;

const LL_MENU = [
  { label: 'Features', groups: [
    { title: 'Invest', items: [
      { label: 'Property Sourcing', href: 'https://lendlord.io/solutions/invest/property-sourcing' },
      { label: 'Deal Analyser', href: 'https://lendlord.io/solutions/invest/deal-analyser' },
      { label: 'Flip Analyser', href: 'https://lendlord.io/solutions/invest/pipeline-management' },
      { label: 'Property Analysis Sharing', href: 'https://lendlord.io/solutions/invest/property-sourcing' },
    ]},
    { title: 'Manage', items: [
      { label: 'Portfolio Management', href: 'https://lendlord.io/solutions/manage/portfolio-management' },
      { label: 'Document Management', href: 'https://lendlord.io/solutions/manage/portfolio-management' },
      { label: 'Tenancy Management', href: 'https://lendlord.io/solutions/manage/tenancies-management' },
      { label: 'Tenancy Agreement Templates', href: 'https://lendlord.io/solutions/manage/tenancies-management' },
      { label: 'Due Dates & Insights', href: 'https://lendlord.io/solutions/manage/portfolio-management' },
    ]},
    { title: 'Accounting', items: [
      { label: 'Cash Flow Tracking', href: 'https://lendlord.io/solutions/manage/cash-flow-tracking' },
      { label: 'Open Banking', href: 'https://lendlord.io/solutions/manage/cash-flow-tracking' },
      { label: 'Invoice Generator', href: 'https://lendlord.io/solutions/manage/cash-flow-tracking' },
      { label: 'Making Tax Digital', href: 'https://lendlord.io/solutions/manage/cash-flow-tracking' },
    ]},
  ]},
  { label: 'Source', items: [
    { label: 'Auction Properties', href: 'https://lendlord.io/solutions/invest/property-sourcing' },
    { label: 'Agent Listings', href: 'https://lendlord.io/solutions/invest/property-sourcing' },
  ]},
  { label: 'Finance', items: [
    { label: 'Bridging Finance', href: 'https://lendlord.io/solutions/finance/bridging-finance' },
    { label: 'Bridging Application', href: 'https://lendlord.io/solutions/finance/bridging-finance' },
    { label: 'Mortgages', href: 'https://lendlord.io/solutions/finance/mortgages' },
    { label: 'Online Mortgage Broker', href: 'https://lendlord.io/solutions/finance/mortgages' },
    { label: 'Buy to Let Remortgage', href: 'https://lendlord.io/solutions/finance/mortgages' },
  ]},
  { label: 'Tools', groups: [
    { title: 'Data', items: [
      { label: 'Agent Finder', href: 'https://lendlord.io/letting-and-estate-agents' },
      { label: 'Lendlord AI', href: 'https://lendlord.io/tools/' },
      { label: 'Postcode Information', href: 'https://lendlord.io/tools/' },
      { label: "Renters' Right Bill Act", href: 'https://lendlord.io/tools/' },
      { label: 'HMO Data', href: 'https://lendlord.io/tools/' },
    ]},
    { title: 'Calculators', items: [
      { label: 'Buy to Let Calculator', href: 'https://lendlord.io/tools/' },
      { label: 'Flip Calculator', href: 'https://lendlord.io/tools/' },
      { label: 'BRRR Calculator', href: 'https://lendlord.io/tools/' },
      { label: 'Buy to Let Mortgage Calculator', href: 'https://lendlord.io/tools/' },
    ]},
    { title: 'Landlord Surveys', items: [
      { label: 'Autumn 25 Budget Sentiment', href: 'https://lendlord.io/tools/' },
    ]},
  ]},
  { label: 'Blog', href: 'https://lendlord.io/blog/' },
  { label: 'Plans', items: [
    { label: 'United Kingdom Plans', href: 'https://lendlord.io/plans/' },
    { label: 'Canada Plans', href: 'https://lendlord.io/plans/' },
    { label: 'United States Plans', href: 'https://lendlord.io/plans/' },
  ]},
];

function renderLendlordTopbar() {
  if (document.getElementById('lendlord-topbar')) return;

  function renderMenuItem(item) {
    const hasDropdown = item.items || item.groups;
    if (!hasDropdown) {
      return `<a href="${item.href}" target="_blank" rel="noopener">${item.label}</a>`;
    }

    let dropdownHTML = '';
    if (item.groups) {
      dropdownHTML = `<div class="ll-topbar-dropdown ll-topbar-dropdown-grouped">
        ${item.groups.map(g => `<div class="ll-topbar-dropdown-group">
          <div class="ll-topbar-dropdown-group-title">${g.title}</div>
          ${g.items.map(i => `<a href="${i.href}" target="_blank" rel="noopener">${i.label}</a>`).join('')}
        </div>`).join('')}
      </div>`;
    } else {
      dropdownHTML = `<div class="ll-topbar-dropdown">
        ${item.items.map(i => `<a href="${i.href}" target="_blank" rel="noopener">${i.label}</a>`).join('')}
      </div>`;
    }

    return `<div class="ll-topbar-item">
      <span class="ll-topbar-trigger">${item.label} ${CHEVRON_DOWN}</span>
      ${dropdownHTML}
    </div>`;
  }

  const bar = document.createElement('div');
  bar.id = 'lendlord-topbar';
  bar.innerHTML = `
    <div class="container">
      <a href="https://lendlord.io/" class="ll-topbar-brand" target="_blank" rel="noopener">
        ${ICONS.lendlordLogoWhite}
      </a>
      <nav class="ll-topbar-nav">
        ${LL_MENU.map(renderMenuItem).join('')}
      </nav>
      <div class="ll-topbar-actions">
        <a href="https://app.lendlord.io/login" class="ll-topbar-link" target="_blank" rel="noopener">Log In</a>
        <a href="https://app.lendlord.io/signup" class="ll-topbar-signup" target="_blank" rel="noopener">Sign Up</a>
      </div>
      <a href="https://lendlord.io/" class="ll-topbar-mobile-link" target="_blank" rel="noopener">
        ${ICONS.arrowRight} lendlord.io
      </a>
    </div>
  `;
  document.body.insertBefore(bar, document.body.firstChild);
}

/* ---------- Header ---------- */
export function renderHeader(activePage = '') {
  renderLendlordTopbar();

  const header = document.getElementById('site-header');
  if (!header) return;

  const pages = [
    { id: 'home', label: 'Agent Finder', href: 'index.html' },
    { id: 'compare', label: 'Compare', href: 'compare.html' },
    { id: 'areas', label: 'Area Insights', href: 'area.html' },
    { id: 'portfolio', label: 'Portfolio', href: 'portfolio.html' },
  ];

  header.innerHTML = `
    <div class="container">
      <a href="index.html" class="site-header-brand">
        <span class="site-header-brand-name">Agent Finder</span>
        <span class="site-header-brand-sub">by Lendlord</span>
      </a>
      <span class="site-header-divider"></span>
      <nav class="nav-links">
        ${pages.map(p => `<a href="${p.href}" class="${activePage === p.id ? 'active' : ''}">${p.label}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <button class="menu-btn" onclick="document.querySelector('.mobile-nav').classList.toggle('open')" aria-label="Menu">${ICONS.menu}</button>
      </div>
    </div>
    <nav class="mobile-nav">
      ${pages.map(p => `<a href="${p.href}" class="${activePage === p.id ? 'active' : ''}">${p.label}</a>`).join('')}
    </nav>
  `;
}

/* ---------- Footer ---------- */
export function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo" style="color:#fff">
            ${ICONS.lendlordLogoWhite}
          </a>
          <p>The UK's most transparent letting & estate agent comparison platform. Find, compare and choose with confidence.</p>
        </div>
        <div>
          <h4 class="footer-heading">Platform</h4>
          <div class="footer-links">
            <a href="index.html">Find Agents</a>
            <a href="compare.html">Compare Agents</a>
            <a href="area.html">Area Insights</a>
            <a href="portfolio.html">Portfolio Manager</a>
          </div>
        </div>
        <div>
          <h4 class="footer-heading">Lendlord</h4>
          <div class="footer-links">
            <a href="https://lendlord.io/solutions/invest/property-sourcing" target="_blank" rel="noopener">Property Sourcing</a>
            <a href="https://lendlord.io/solutions/invest/deal-analyser" target="_blank" rel="noopener">Deal Analyser</a>
            <a href="https://lendlord.io/solutions/manage/portfolio-management" target="_blank" rel="noopener">Portfolio Management</a>
            <a href="https://lendlord.io/solutions/finance/bridging-finance" target="_blank" rel="noopener">Bridging Finance</a>
            <a href="https://lendlord.io/solutions/finance/mortgages" target="_blank" rel="noopener">Mortgages</a>
            <a href="https://lendlord.io/blog/" target="_blank" rel="noopener">Blog</a>
          </div>
        </div>
        <div>
          <h4 class="footer-heading">Legal</h4>
          <div class="footer-links">
            <a href="https://lendlord.io/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a>
            <a href="https://lendlord.io/terms-conditions/" target="_blank" rel="noopener">Terms &amp; Conditions</a>
            <a href="https://lendlord.io/cookies-policy/" target="_blank" rel="noopener">Cookie Policy</a>
            <a href="https://lendlord.io/help-center/" target="_blank" rel="noopener">Help Center</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</span>
        <span>Data updated February 2026</span>
      </div>
    </div>
  `;
}

/* ---------- Agent Card ---------- */
export function renderAgentCard(agent, index, isBlurred = false) {
  const fee = fmtFee(agent);
  const logo = agent.logo
    ? `<img src="${agent.logo}" alt="${agent.name}" class="agent-card-logo" onerror="this.outerHTML='<div class=\\'agent-card-logo-placeholder\\'>${initials(agent.name)}</div>'">`
    : `<div class="agent-card-logo-placeholder">${initials(agent.name)}</div>`;

  const blurClass = isBlurred ? 'card-blurred' : '';
  const overlay = isBlurred ? `
    <div class="blur-overlay">
      <div style="margin-bottom:12px">${ICONS.lock}</div>
      <h3>Sign up to see more agents</h3>
      <p>Create a free account to unlock all results</p>
      <button class="btn btn-primary" onclick="window.showAuthModal && window.showAuthModal()">Sign Up Free</button>
    </div>` : '';

  const services = agent.service_tiers.length > 0
    ? agent.service_tiers.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')
    : agent.services.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('');

  // Location line: postcode + city
  const locationParts = [agent.postcode || 'UK'];
  if (agent.city) locationParts.push(agent.city);
  else if (agent.address) locationParts.push(agent.address.split(',').pop().trim());
  const locationText = locationParts.join(' - ');

  // Fee summary: show all available fees (tenant find, full mgmt, guaranteed rent)
  const feeSummary = fmtFeeSummaryHTML(agent.fees);

  // Performance stats (only shown if no fee summary takes all the space)
  const perfStats = [];
  if (agent.performance.years) perfStats.push(`<div class="agent-card-stat"><span class="agent-card-stat-label">Branch Age</span><span class="agent-card-stat-value">${agent.performance.years}y</span></div>`);
  if (agent.performance.brand_age) perfStats.push(`<div class="agent-card-stat"><span class="agent-card-stat-label">Brand Heritage</span><span class="agent-card-stat-value">${agent.performance.brand_age}y</span></div>`);
  if (agent.performance.offices) perfStats.push(`<div class="agent-card-stat"><span class="agent-card-stat-label">Offices</span><span class="agent-card-stat-value">${agent.performance.offices}</span></div>`);
  if (agent.performance.managed) perfStats.push(`<div class="agent-card-stat"><span class="agent-card-stat-label">Under Mgmt</span><span class="agent-card-stat-value">${agent.performance.managed.toLocaleString()}</span></div>`);
  if (agent.performance.listed) perfStats.push(`<div class="agent-card-stat"><span class="agent-card-stat-label">Listed</span><span class="agent-card-stat-value">${agent.performance.listed}</span></div>`);
  if (agent.performance.avg_time_to_let) perfStats.push(`<div class="agent-card-stat"><span class="agent-card-stat-label">Avg Time to Let</span><span class="agent-card-stat-value">${agent.performance.avg_time_to_let}d</span></div>`);

  return `
    <div class="card ${blurClass} fade-in-up" data-agent-id="${agent.id}" style="animation-delay:${Math.min(index, 8) * 60}ms">
      ${overlay}
      <div class="card-body agent-card">
        <div class="agent-card-header">
          ${logo}
          <div class="agent-card-info">
            <div class="agent-card-name">${agent.name}</div>
            <div class="agent-card-location">
              ${ICONS.mapPin}
              <span>${locationText}</span>
            </div>
          </div>
          <div class="trust-score-wrap">
            <div class="trust-score ${trustScoreClass(agent.trust_score)}">${agent.trust_score}</div>
            <span class="trust-score-label">Trust <span class="trust-info-trigger" data-trust-tooltip>?</span></span>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          ${starsHTML(agent.reviews.avg, agent.reviews.count)}
          ${agent.activity ? `<span class="flex items-center gap-1 text-xs"><span class="activity-dot ${agent.activity}"></span>${agent.activity === 'active' ? 'Active' : agent.activity === 'moderate' ? 'Moderate' : 'Low'}</span>` : ''}
          ${agent.agent_type ? `<span class="badge badge-blue">${fmtAgentType(agent.agent_type)}</span>` : ''}
          ${categoryBadgeHTML(agent.category)}
          ${experienceBadgeHTML(agent.experience)}
          ${guaranteedRentBadgeHTML(agent)}
          ${noTenantFeesBadgeHTML(agent.fees)}
        </div>
        ${reviewPlatformsHTML(agent.reviews)}

        ${feeSummary}
        ${perfStats.length ? `<div class="agent-card-stats">${perfStats.join('')}</div>` : ''}

        ${hiddenFeesAlertHTML(agent.fees)}
        ${services ? `<div class="agent-card-services">${services}</div>` : ''}
        ${complianceStatusHTML(agent.regulatory)}
        ${naeaBadgeHTML(agent.regulatory)}
        ${portalBadgesHTML(agent.portals)}
        ${areasCoveredHTML(agent.areas)}
        ${socialIconsHTML(agent.social)}
        ${dataCompletenessHTML(agent)}

        <div class="agent-card-footer">
          <a href="agent.html?id=${agent.id}" class="btn btn-primary btn-sm">View Profile</a>
          <button class="btn btn-outline btn-sm" onclick="window.toggleCompare && window.toggleCompare(${agent.id})" data-compare-btn="${agent.id}">
            ${ICONS.compare} Compare
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Card Grid ---------- */
export function renderCardsGrid(agents, containerId, showAll = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!agents.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        ${ICONS.search}
        <h3>No agents found</h3>
        <p>Try a different postcode or adjust your filters</p>
      </div>`;
    return;
  }

  const isAuthed = window._isAuthenticated && window._isAuthenticated();
  const limit = (showAll || isAuthed) ? agents.length : FREE_RESULTS;

  let html = '';
  agents.forEach((agent, i) => {
    const blurred = i >= limit;
    html += renderAgentCard(agent, i, blurred);
  });

  container.innerHTML = html;
}

/* ---------- Skeleton Loading ---------- */
export function renderSkeletons(containerId, count = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `<div class="skeleton skeleton-card" style="animation-delay:${i * 100}ms"></div>`;
  }
  container.innerHTML = html;
}

/* ---------- Scroll to Top Button ---------- */
export function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.innerHTML = ICONS.arrowUp;
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}

/* ---------- Trust Score Tooltip ---------- */
export function initTrustTooltip() {
  // Create single global tooltip element
  const tip = document.createElement('div');
  tip.id = 'trust-tooltip';
  tip.innerHTML = `
    <div class="trust-tip-arrow"></div>
    <strong>Trust Score (50-100)</strong>
    Calculated from:
    <ul>
      <li>Review rating (25%)</li>
      <li>Review volume (10%)</li>
      <li>ARLA membership (10%)</li>
      <li>Client Money Protection (10%)</li>
      <li>Ombudsman/Redress (8%)</li>
      <li>Years in business (10%)</li>
      <li>Data completeness (12%)</li>
      <li>Social media presence (5%)</li>
      <li>Portal coverage (5%)</li>
      <li>Fee transparency (5%)</li>
    </ul>`;
  document.body.appendChild(tip);

  document.addEventListener('mouseenter', (e) => {
    const trigger = e.target.closest('[data-trust-tooltip]');
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    tip.style.display = 'block';
    // Position below the ? icon, centered
    const tipW = tip.offsetWidth;
    let left = rect.left + rect.width / 2 - tipW / 2;
    // Keep within viewport
    if (left < 8) left = 8;
    if (left + tipW > window.innerWidth - 8) left = window.innerWidth - tipW - 8;
    tip.style.top = (rect.bottom + 8) + 'px';
    tip.style.left = left + 'px';
    // Position arrow to point at the trigger
    const arrow = tip.querySelector('.trust-tip-arrow');
    arrow.style.left = (rect.left + rect.width / 2 - left) + 'px';
  }, true);

  document.addEventListener('mouseleave', (e) => {
    const trigger = e.target.closest('[data-trust-tooltip]');
    if (!trigger) return;
    // Small delay so user can move to tooltip
    setTimeout(() => {
      if (!tip.matches(':hover')) tip.style.display = 'none';
    }, 100);
  }, true);

  tip.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
}

/* ---------- Auth Modal HTML ---------- */
export function renderAuthModal() {
  const existing = document.getElementById('auth-modal');
  if (existing) return;

  const div = document.createElement('div');
  div.id = 'auth-modal';
  div.className = 'modal-backdrop';
  div.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="document.getElementById('auth-modal').classList.remove('open')">${ICONS.x}</button>
      <h2>Create Your Free Account</h2>
      <p class="text-secondary" style="margin-bottom:var(--sp-5)">Unlock all agent results, save favourites, and compare agents side by side.</p>

      <button class="btn-google" id="google-signin-btn">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </button>

      <div class="form-divider">or</div>

      <form id="email-auth-form">
        <div class="form-group">
          <label class="form-label" for="auth-email">Email</label>
          <input class="form-input" type="email" id="auth-email" placeholder="you@example.com" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="auth-password">Password</label>
          <input class="form-input" type="password" id="auth-password" placeholder="Min 6 characters" required minlength="6">
        </div>
        <div id="auth-error" class="text-sm" style="color:var(--danger);margin-bottom:var(--sp-3);display:none"></div>
        <button type="submit" class="btn btn-primary" style="width:100%">Sign Up / Sign In</button>
      </form>

      <p class="text-xs text-muted" style="margin-top:var(--sp-4);text-align:center">
        By signing up you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  `;
  document.body.appendChild(div);

  // Close on backdrop click
  div.addEventListener('click', (e) => {
    if (e.target === div) div.classList.remove('open');
  });
}

/* ---------- Compare Bar (bottom sticky) ---------- */
export function renderCompareBar() {
  let bar = document.getElementById('compare-bar');
  if (bar) return;

  bar = document.createElement('div');
  bar.id = 'compare-bar';
  bar.className = 'hook-banner';
  bar.innerHTML = `
    <div class="hook-banner-inner">
      <div class="hook-banner-text">
        <h4 id="compare-bar-title">0 agents selected</h4>
        <p>Select up to 3 agents to compare side by side</p>
      </div>
      <a href="compare.html" class="btn btn-accent btn-sm" id="compare-bar-btn" style="display:none">
        Compare Now ${ICONS.arrowRight}
      </a>
      <button class="btn btn-ghost btn-sm" onclick="window.clearCompare && window.clearCompare()">Clear</button>
    </div>
  `;
  document.body.appendChild(bar);
}
