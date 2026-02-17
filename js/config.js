/* ==========================================================================
   Configuration & Constants
   ========================================================================== */

// Firebase configuration - replace with your project's config
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "YOUR_APP_ID"
};

// Free results limit before blur wall
export const FREE_RESULTS = 3;

// Trust Score thresholds
export const TRUST = {
  HIGH: 80,
  MID: 68,
};

// Activity thresholds (already computed in JSON)
export const ACTIVITY_LABELS = {
  active: 'Active',
  moderate: 'Moderate',
  low: 'Low Activity',
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'trust', label: 'Trust Score' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'has_fees', label: 'Has Fee Data' },
  { value: 'fees_low', label: 'Lowest Fees' },
  { value: 'years', label: 'Most Experienced' },
  { value: 'name', label: 'Name (A-Z)' },
];

// Agent type labels
export const AGENT_TYPES = {
  high_street: 'High Street',
  online: 'Online',
  hybrid: 'Hybrid',
};

// Regulatory body labels
export const REGULATORY_LABELS = {
  arla: 'ARLA Propertymark',
  tpo: 'The Property Ombudsman',
  prs: 'Property Redress Scheme',
  cmp: 'Client Money Protection',
  deposit: 'Deposit Protection',
};

// Hook URLs
export const HOOKS = {
  bridging: 'https://app.lendlord.io/bridging-application?country=uk&utm_source=Lendlord&utm_campaign=letting_agents',
  mortgage: 'https://app.lendlord.io/online-mortgage-broker?country=uk&utm_source=Lendlord&utm_campaign=letting_agents',
  remortgage: 'https://app.lendlord.io/buy-to-let-remortgage?country=uk&utm_source=Lendlord&utm_campaign=letting_agents',
  lendlord: 'https://app.lendlord.io/signup?country=uk&utm_source=Lendlord&utm_campaign=letting_agents',
};

// Coupon info
export const COUPONS = {
  code: 'letting_agents',
  discounts: {
    broker: '£250 broker fee discount',
    valuation: '£200 valuation fee discount',
    arrangement: '£200 arrangement fee discount',
  }
};

// Site name
export const SITE_NAME = 'Lendlord';
export const SITE_TAGLINE = 'Find the Right Letting & Estate Agent for Your Property';
