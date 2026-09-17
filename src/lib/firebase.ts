/**
 * Firebase Configuration & Service Exports
 *
 * Reads config from Vite env vars (VITE_PUBLIC_FIREBASE_*).
 * Initialises the Firebase app and exposes commonly used services.
 */

import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAnalytics, logEvent, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported as isMessagingSupported,
  type Messaging,
  type MessagePayload,
} from 'firebase/messaging';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getRemoteConfig, fetchAndActivate, getValue, type RemoteConfig } from 'firebase/remote-config';

// ── Config from Vite env ─────────────────────────────────────────────

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

const VAPID_KEY = import.meta.env.VITE_PUBLIC_FIREBASE_VAPID_KEY || '';

// Check if Firebase is configured (at minimum needs apiKey + projectId)
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

// ── Initialise App ───────────────────────────────────────────────────

let app: FirebaseApp | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
}

// ═══════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════

let analytics: Analytics | null = null;

/**
 * Lazily initialise Google Analytics (only in supported browsers).
 */
export async function initAnalytics(): Promise<Analytics | null> {
  if (!app || analytics) return analytics;

  const supported = await isAnalyticsSupported();
  if (supported) {
    analytics = getAnalytics(app);
  }
  return analytics;
}

/**
 * Log a custom analytics event.
 * Safe to call before analytics is initialised — it's a no-op if not ready.
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}

/**
 * Track a page view. Call this on route changes.
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════
// CLOUD MESSAGING (FCM)
// ═══════════════════════════════════════════════════════════════════════

let messaging: Messaging | null = null;

/**
 * Lazily initialise Firebase Cloud Messaging.
 * Returns null in browsers that don't support service workers / notifications.
 */
export async function initMessaging(): Promise<Messaging | null> {
  if (!app || messaging) return messaging;

  const supported = await isMessagingSupported();
  if (supported) {
    messaging = getMessaging(app);
  }
  return messaging;
}

/**
 * Request notification permission and retrieve the FCM device token.
 * Explicitly registers the service worker so Firebase can bind to it.
 * Returns the token string, or null if denied / unsupported.
 */
export async function requestNotificationToken(): Promise<string | null> {
  try {
    const msg = await initMessaging();
    if (!msg) {
      console.warn('[Firebase] Messaging not supported in this browser');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[Firebase] Notification permission denied');
      return null;
    }

    // Register the FCM service worker explicitly
    const swRegistration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' },
    );
    console.info('[Firebase] Service worker registered:', swRegistration.scope);

    // Wait for the SW to be ready
    await navigator.serviceWorker.ready;

    const token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      console.info('[Firebase] FCM token obtained:', token);
    } else {
      console.warn('[Firebase] getToken returned empty — check VAPID key and SW');
    }

    return token;
  } catch (err) {
    console.error('[Firebase] Failed to get FCM token:', err);
    return null;
  }
}

/**
 * Listen for foreground push messages.
 * Call once in a top-level component (e.g. App.tsx).
 *
 * @returns Unsubscribe function, or null if messaging isn't available.
 */
export async function onForegroundMessage(
  callback: (payload: MessagePayload) => void,
): Promise<(() => void) | null> {
  const msg = await initMessaging();
  if (!msg) return null;

  return onMessage(msg, callback);
}

// ═══════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════════

let perf: FirebasePerformance | null = null;

/**
 * Initialise Firebase Performance Monitoring.
 * Automatically records page load times, network requests, etc.
 */
export function initPerformance(): FirebasePerformance | null {
  if (!app || perf) return perf;
  perf = getPerformance(app);
  return perf;
}

// ═══════════════════════════════════════════════════════════════════════
// REMOTE CONFIG
// ═══════════════════════════════════════════════════════════════════════

let remoteConfig: RemoteConfig | null = null;

/**
 * Initialise Remote Config with default values and fetch latest.
 */
export async function initRemoteConfig(
  defaults?: Record<string, string | number | boolean>,
): Promise<RemoteConfig | null> {
  if (!app) return null;
  if (remoteConfig) return remoteConfig;

  remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

  if (defaults) {
    remoteConfig.defaultConfig = defaults;
  }

  try {
    await fetchAndActivate(remoteConfig);
  } catch (err) {
    console.warn('[Firebase] Remote Config fetch failed:', err);
  }

  return remoteConfig;
}

/**
 * Get a Remote Config value by key.
 */
export function getConfigValue(key: string): string {
  if (!remoteConfig) return '';
  return getValue(remoteConfig, key).asString();
}

// ═══════════════════════════════════════════════════════════════════════
// COMBINED INIT — call once at app startup
// ═══════════════════════════════════════════════════════════════════════

/**
 * One-shot initialiser for all Firebase services.
 * Call this in App.tsx inside a useEffect.
 *
 * Services that aren't supported in the current browser are silently skipped.
 */
export async function initFirebase() {
  if (!isFirebaseConfigured) {
    console.info('[Firebase] Not configured — skipping init');
    return;
  }

  await Promise.all([
    initAnalytics(),
    initMessaging(),
    initRemoteConfig(),
  ]);

  initPerformance();
  console.info('[Firebase] All services initialised');
}

// ── Exports ──────────────────────────────────────────────────────────

export { app, analytics, messaging };
