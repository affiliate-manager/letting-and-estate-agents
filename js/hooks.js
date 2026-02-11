/* ==========================================================================
   Finance Hooks & Lendlord Popup
   Contextual, value-first monetization hooks
   ========================================================================== */

import { HOOKS, COUPONS } from './config.js';
import { ssGet, ssSet, lsGet, ICONS } from './utils.js';

/**
 * Initialize all hooks. Call on results page and agent profile page.
 */
export function initHooks() {
  // Schedule checks (delayed to not interrupt initial experience)
  setTimeout(checkFinanceBanner, 15000);   // 15s after page load
  setTimeout(checkLendlordPopup, 30000);   // 30s after page load
}

/* =========================================================================
   Hook 1: Finance Questionnaire Banner
   Triggers: After viewing 2+ agent profiles OR on fee-heavy pages
   ========================================================================= */

function checkFinanceBanner() {
  // Don't show if already dismissed
  try { if (localStorage.getItem('af_hook_finance_dismissed')) return; } catch {}

  // Check trigger conditions
  const profileViews = parseInt(ssGet('af_profile_views', 0));
  const onFeePage = document.querySelector('[data-tab="fees"]') || document.querySelector('.fee-table');

  if (profileViews >= 2 || onFeePage) {
    showFinanceBanner();
  }
}

function showFinanceBanner() {
  // Don't duplicate
  if (document.getElementById('finance-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'finance-banner';
  banner.className = 'hook-banner';
  banner.innerHTML = `
    <button class="hook-close" onclick="dismissFinanceBanner()" aria-label="Close">
      ${ICONS.x}
    </button>
    <div class="hook-banner-inner" style="flex-wrap:wrap">
      <div class="hook-banner-text" style="flex:1;min-width:240px">
        <h4>Looking to expand your portfolio?</h4>
        <p>Get exclusive discounts on property finance - mortgages, remortgages & bridging loans</p>
      </div>
      <button class="btn btn-accent btn-sm" onclick="showFinanceQuestionnaire()">
        See Offers
        ${ICONS.arrowRight}
      </button>
    </div>
  `;
  document.body.appendChild(banner);

  // Animate in after a tick
  requestAnimationFrame(() => {
    requestAnimationFrame(() => banner.classList.add('visible'));
  });
}

window.dismissFinanceBanner = () => {
  const banner = document.getElementById('finance-banner');
  if (banner) {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 300);
  }
  // Store in localStorage so it doesn't show again
  try { localStorage.setItem('af_hook_finance_dismissed', 'true'); } catch {}
};

window.showFinanceQuestionnaire = () => {
  // Remove banner
  const banner = document.getElementById('finance-banner');
  if (banner) {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 300);
  }

  // Show questionnaire modal
  const modal = document.createElement('div');
  modal.id = 'finance-modal';
  modal.className = 'modal-backdrop open';
  modal.innerHTML = `
    <div class="modal" style="max-width:520px">
      <button class="modal-close" onclick="document.getElementById('finance-modal').remove()">
        ${ICONS.x}
      </button>
      <h2 style="margin-bottom:var(--sp-2)">Property Finance Offers</h2>
      <p class="text-secondary" style="margin-bottom:var(--sp-6)">Answer a quick question to see relevant discounts</p>

      <div id="finance-question" style="display:flex;flex-direction:column;gap:var(--sp-3)">
        <p class="font-semibold">What best describes your situation?</p>

        <button class="btn btn-outline" style="text-align:left;justify-content:flex-start" onclick="showFinanceResult('mortgage')">
          <span style="color:var(--primary)">${ICONS.home}</span>
          I'm looking to purchase a new buy-to-let property
        </button>

        <button class="btn btn-outline" style="text-align:left;justify-content:flex-start" onclick="showFinanceResult('remortgage')">
          <span style="color:var(--accent-dark)">${ICONS.trendUp}</span>
          I want to remortgage an existing property
        </button>

        <button class="btn btn-outline" style="text-align:left;justify-content:flex-start" onclick="showFinanceResult('bridging')">
          <span style="color:var(--warning)">${ICONS.clock}</span>
          I need short-term bridging finance
        </button>

        <button class="btn btn-ghost text-sm" onclick="document.getElementById('finance-modal').remove()" style="margin-top:var(--sp-2)">
          Not right now
        </button>
      </div>

      <div id="finance-result" style="display:none"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};

window.showFinanceResult = (type) => {
  const resultEl = document.getElementById('finance-result');
  const questionEl = document.getElementById('finance-question');
  questionEl.style.display = 'none';
  resultEl.style.display = 'block';

  const config = {
    mortgage: {
      title: 'Buy-to-Let Mortgage Discount',
      discount: COUPONS.discounts.broker,
      description: 'Get a discounted broker fee on your buy-to-let mortgage application.',
      url: HOOKS.mortgage,
      code: COUPONS.code,
    },
    remortgage: {
      title: 'Remortgage Discount',
      discount: COUPONS.discounts.broker,
      description: 'Save on broker fees when remortgaging your buy-to-let property.',
      url: HOOKS.remortgage,
      code: COUPONS.code,
    },
    bridging: {
      title: 'Bridging Finance Discounts',
      discount: COUPONS.discounts.valuation + ' + ' + COUPONS.discounts.arrangement,
      description: 'Get discounted valuation and arrangement fees on bridging finance.',
      url: HOOKS.bridging,
      code: COUPONS.code,
    },
  };

  const c = config[type];

  resultEl.innerHTML = `
    <div style="text-align:center;padding:var(--sp-4) 0">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;margin:0 auto var(--sp-4)">
        ${ICONS.check}
      </div>
      <h3>${c.title}</h3>
      <p class="text-secondary" style="margin:var(--sp-2) 0 var(--sp-4)">${c.description}</p>

      <div style="background:var(--bg);border-radius:var(--radius-md);padding:var(--sp-4);margin-bottom:var(--sp-4)">
        <div class="text-xs text-muted" style="margin-bottom:4px">USE COUPON CODE</div>
        <div style="font-size:1.25rem;font-weight:800;color:var(--primary);letter-spacing:0.02em">${c.code}</div>
        <p class="text-xs text-muted" style="margin-top:4px">Apply after submitting your inquiry</p>
      </div>

      <a href="${c.url}" target="_blank" rel="noopener" class="btn btn-accent" style="width:100%">
        Apply Now - Get Your Discount
        ${ICONS.externalLink}
      </a>

      <button class="btn btn-ghost text-sm" onclick="document.getElementById('finance-modal').remove()" style="width:100%;margin-top:var(--sp-2)">
        Maybe Later
      </button>
    </div>
  `;
};


/* =========================================================================
   Hook 2: Lendlord Premium Popup
   Triggers: 3+ searches OR 2+ different postcode areas
   ========================================================================= */

function checkLendlordPopup() {
  // Don't show if already shown this session or dismissed
  if (ssGet('af_lendlord_shown')) return;
  try { if (localStorage.getItem('af_lendlord_dismissed')) return; } catch {}

  const searches = ssGet('af_searches', []);
  const postcodes = ssGet('af_postcodes', []);

  const multiSearch = searches.length >= 3;
  const multiLocation = postcodes.length >= 2;

  if (multiSearch || multiLocation) {
    showLendlordPopup(multiLocation);
  }
}

function showLendlordPopup(isMultiLocation) {
  ssSet('af_lendlord_shown', true);

  // Don't duplicate
  if (document.getElementById('lendlord-popup')) return;

  const message = isMultiLocation
    ? "We noticed you're looking at properties in multiple areas. Get 50% off Lendlord Premium and sync your data directly with your agent."
    : "Own 2+ properties? Get 50% off Lendlord Premium and sync your data directly with your agent.";

  const modal = document.createElement('div');
  modal.id = 'lendlord-popup';
  modal.className = 'modal-backdrop open lendlord-popup';
  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="dismissLendlord()">
        ${ICONS.x}
      </button>
      <div class="popup-icon">&#127968;</div>
      <h2>50% Off Lendlord Premium</h2>
      <p>${message}</p>
      <a href="${HOOKS.lendlord}" target="_blank" rel="noopener" class="btn btn-accent btn-lg">
        Get Started
        ${ICONS.arrowRight}
      </a>
      <button class="btn btn-ghost" onclick="dismissLendlord()">Not Now</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) dismissLendlord();
  });
}

window.dismissLendlord = () => {
  const modal = document.getElementById('lendlord-popup');
  if (modal) modal.remove();
  try { localStorage.setItem('af_lendlord_dismissed', 'true'); } catch {}
};

/**
 * Track a profile view (call from agent.html)
 */
export function trackProfileView() {
  const views = parseInt(ssGet('af_profile_views', 0));
  ssSet('af_profile_views', views + 1);
}
