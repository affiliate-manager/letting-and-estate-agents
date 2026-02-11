/* ==========================================================================
   Firebase Authentication Module
   Handles email/password + Google sign-in, blur wall state
   ========================================================================== */

import { FIREBASE_CONFIG, FREE_RESULTS } from './config.js';
import { lsGet, lsSet, showToast } from './utils.js';

let firebaseApp = null;
let firebaseAuth = null;
let currentUser = null;

/**
 * Initialize Firebase Auth.
 * Loads Firebase SDK from CDN if not already loaded.
 */
export async function initAuth() {
  // If Firebase config not set, use demo mode
  if (FIREBASE_CONFIG.apiKey === 'YOUR_FIREBASE_API_KEY') {
    console.log('[Auth] Firebase not configured - running in demo mode');
    currentUser = lsGet('af_user');
    updateUIState();
    return;
  }

  try {
    // Dynamically load Firebase SDKs
    if (!window.firebase) {
      await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js');
    }

    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    firebaseAuth = firebase.auth();

    // Listen for auth state changes
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        currentUser = { uid: user.uid, email: user.email, name: user.displayName };
        lsSet('af_user', currentUser);
      } else {
        currentUser = null;
        localStorage.removeItem('af_user');
      }
      updateUIState();
    });
  } catch (err) {
    console.error('[Auth] Firebase init failed:', err);
    currentUser = lsGet('af_user');
    updateUIState();
  }
}

/**
 * Sign in / sign up with email and password
 */
export async function signInWithEmail(email, password) {
  if (!firebaseAuth) {
    // Demo mode - accept any credentials
    currentUser = { uid: 'demo', email, name: email.split('@')[0] };
    lsSet('af_user', currentUser);
    updateUIState();
    showToast('Welcome! All agents are now unlocked.');
    return currentUser;
  }

  try {
    // Try sign in first
    const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
    showToast('Welcome back!');
    return result.user;
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      // Create new account
      const result = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      showToast('Account created! All agents unlocked.');
      return result.user;
    }
    throw err;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  if (!firebaseAuth) {
    // Demo mode
    currentUser = { uid: 'demo-google', email: 'demo@google.com', name: 'Demo User' };
    lsSet('af_user', currentUser);
    updateUIState();
    showToast('Welcome! All agents are now unlocked.');
    return currentUser;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebaseAuth.signInWithPopup(provider);
  showToast('Welcome!');
  return result.user;
}

/**
 * Sign out
 */
export async function signOut() {
  if (firebaseAuth) {
    await firebaseAuth.signOut();
  }
  currentUser = null;
  localStorage.removeItem('af_user');
  updateUIState();
  showToast('Signed out');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!currentUser || !!lsGet('af_user');
}

/**
 * Get current user
 */
export function getUser() {
  return currentUser || lsGet('af_user');
}

/**
 * Update all UI elements based on auth state
 */
function updateUIState() {
  const authed = isAuthenticated();
  const user = getUser();

  // Update auth button in header
  const authBtn = document.getElementById('auth-btn');
  if (authBtn) {
    if (authed && user) {
      authBtn.textContent = user.name || user.email?.split('@')[0] || 'Account';
      authBtn.onclick = () => signOut();
      authBtn.classList.remove('btn-outline');
      authBtn.classList.add('btn-ghost');
    } else {
      authBtn.textContent = 'Sign In';
      authBtn.onclick = () => window.showAuthModal && window.showAuthModal();
      authBtn.classList.add('btn-outline');
      authBtn.classList.remove('btn-ghost');
    }
  }

  // Remove blur from cards if authenticated
  if (authed) {
    document.querySelectorAll('.card-blurred').forEach(card => {
      card.classList.remove('card-blurred');
      const overlay = card.querySelector('.blur-overlay');
      if (overlay) overlay.remove();
      const body = card.querySelector('.card-body');
      if (body) body.style.filter = '';
    });
  }

  // Close auth modal
  const modal = document.getElementById('auth-modal');
  if (modal && authed) {
    modal.classList.remove('open');
  }
}

/**
 * Bind auth form events - call after modal is rendered
 */
export function bindAuthEvents() {
  // Email form
  const form = document.getElementById('email-auth-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const errorEl = document.getElementById('auth-error');
      try {
        errorEl.style.display = 'none';
        await signInWithEmail(email, password);
      } catch (err) {
        errorEl.textContent = err.message || 'Authentication failed';
        errorEl.style.display = 'block';
      }
    });
  }

  // Google button
  const googleBtn = document.getElementById('google-signin-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
          errorEl.textContent = err.message || 'Google sign-in failed';
          errorEl.style.display = 'block';
        }
      }
    });
  }
}

// Expose globally for blur wall buttons
window._isAuthenticated = isAuthenticated;

/**
 * Helper to load external script
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
