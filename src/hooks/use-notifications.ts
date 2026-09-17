import { useState, useEffect, useCallback, useRef } from 'react';
import { requestNotificationToken, onForegroundMessage, isFirebaseConfigured } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';

type NotificationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

interface UseNotificationsReturn {
  /** Current permission status */
  status: NotificationStatus;
  /** The FCM device token (null until permission is granted) */
  token: string | null;
  /** Whether notifications are supported in this browser */
  isSupported: boolean;
  /** Request notification permission and get the FCM token */
  requestPermission: () => Promise<string | null>;
}

const TOKEN_STORAGE_KEY = 'acd_fcm_token';
const PUSH_TARGET_KEY = 'acd_push_target_id';

/**
 * Sync FCM token to Appwrite — saves in user prefs AND
 * creates/updates an Appwrite push target for Appwrite Messaging.
 */
async function syncTokenToAppwrite(fcmToken: string): Promise<void> {
  try {
    // Check if user is logged in
    const user = await account.get();
    if (!user) return;

    const prefs = (user.prefs || {}) as Record<string, unknown>;
    const existingToken = prefs['fcmToken'] as string | undefined;
    const existingTargetId = localStorage.getItem(PUSH_TARGET_KEY) || (prefs['pushTargetId'] as string | undefined);

    // Only update if token has changed
    if (existingToken === fcmToken && existingTargetId) return;

    // 1. Update Appwrite prefs with new token
    await account.updatePrefs({
      prefs: {
        ...prefs,
        fcmToken,
        notifEnabled: true,
        notifUpdatedAt: new Date().toISOString(),
      }
    });

    // 2. Create or update Appwrite push target
    if (existingTargetId) {
      try {
        await account.updatePushTarget({
          targetId: existingTargetId,
          identifier: fcmToken,
        });
      } catch {
        // Target might not exist anymore — create new one
        const target = await account.createPushTarget({
          targetId: ID.unique(),
          identifier: fcmToken,
        });
        localStorage.setItem(PUSH_TARGET_KEY, target.$id);
        // Also save in prefs for cross-device reference
        await account.updatePrefs({
          prefs: { ...prefs, fcmToken, pushTargetId: target.$id, notifEnabled: true }
        });
      }
    } else {
      try {
        const target = await account.createPushTarget({
          targetId: ID.unique(),
          identifier: fcmToken,
        });
        localStorage.setItem(PUSH_TARGET_KEY, target.$id);
        await account.updatePrefs({
          prefs: { ...prefs, fcmToken, pushTargetId: target.$id, notifEnabled: true }
        });
      } catch (err: any) {
        // If target already exists for this user, it's fine
        console.warn('[syncTokenToAppwrite] Push target creation:', err.message);
      }
    }

    console.log('[syncTokenToAppwrite] Token synced to Appwrite');
  } catch (err) {
    // User not logged in — that's fine, we'll sync on next login
    console.debug('[syncTokenToAppwrite] Skipped (user not logged in)');
  }
}

/**
 * Hook for managing Firebase Cloud Messaging notifications.
 *
 * - Auto-fetches token on mount if permission is already granted
 * - Provides `requestPermission()` to prompt the user
 * - Automatically listens for foreground messages and shows toasts
 * - Syncs FCM token to Appwrite prefs + push targets
 * - Updates status in real-time after granting permission
 */
export function useNotifications(): UseNotificationsReturn {
  const { toast } = useToast();
  const [status, setStatus] = useState<NotificationStatus>('idle');
  const [token, setToken] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const isSupported =
    isFirebaseConfigured &&
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator;

  /**
   * Internal helper: fetch FCM token (assumes permission is already granted).
   * Handles service worker registration, token retrieval, caching, and Appwrite sync.
   */
  const fetchToken = useCallback(async (): Promise<string | null> => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return null;
    fetchingRef.current = true;

    try {
      const fcmToken = await requestNotificationToken();

      if (fcmToken) {
        setToken(fcmToken);
        setStatus('granted');
        localStorage.setItem(TOKEN_STORAGE_KEY, fcmToken);

        // Sync to Appwrite (non-blocking)
        syncTokenToAppwrite(fcmToken).catch(() => {});

        return fcmToken;
      }

      return null;
    } catch (err) {
      console.error('[useNotifications] Token fetch failed:', err);
      return null;
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // On mount: check existing permission and auto-fetch token if already granted
  useEffect(() => {
    if (!isSupported) {
      setStatus('unsupported');
      return;
    }

    const permission = Notification.permission;

    if (permission === 'denied') {
      setStatus('denied');
      return;
    }

    if (permission === 'granted') {
      const cached = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (cached) {
        setToken(cached);
        setStatus('granted');
        // Re-sync on every visit to keep Appwrite prefs up to date
        syncTokenToAppwrite(cached).catch(() => {});
      } else {
        setStatus('granted');
        fetchToken();
      }
      return;
    }

    // permission === 'default' → user hasn't decided yet
    setStatus('idle');
  }, [isSupported, fetchToken]);

  // Poll Notification.permission every 2s for real-time status detection
  useEffect(() => {
    if (!isSupported) return;

    const interval = setInterval(() => {
      const permission = Notification.permission;

      if (permission === 'granted' && status !== 'granted') {
        setStatus('granted');
        if (!token && !localStorage.getItem(TOKEN_STORAGE_KEY)) {
          fetchToken();
        } else if (!token) {
          const cached = localStorage.getItem(TOKEN_STORAGE_KEY);
          if (cached) setToken(cached);
        }
      } else if (permission === 'denied' && status !== 'denied') {
        setStatus('denied');
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } else if (permission === 'default' && status === 'granted') {
        setStatus('idle');
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isSupported, status, token, fetchToken]);

  // Request permission and get FCM token
  const requestPermission = useCallback(async (): Promise<string | null> => {
    if (!isSupported) {
      setStatus('unsupported');
      return null;
    }

    if (status === 'granted' && token) {
      toast({
        title: '🔔 Notifications already enabled',
        description: 'You\'re all set to receive updates!',
      });
      return token;
    }

    setStatus('requesting');

    const fcmToken = await fetchToken();

    if (fcmToken) {
      toast({
        title: '🔔 Notifications enabled!',
        description: "You'll receive updates from AWS User Group Pune.",
      });
      return fcmToken;
    }

    const permission = Notification.permission;
    if (permission === 'denied') {
      setStatus('denied');
      toast({
        title: 'Notifications blocked',
        description: 'You can enable them in your browser settings.',
        variant: 'destructive',
      });
    } else {
      setStatus('idle');
      toast({
        title: 'Could not enable notifications',
        description: 'Please check your network and try again.',
        variant: 'destructive',
      });
    }

    return null;
  }, [isSupported, status, token, fetchToken, toast]);

  // Listen for foreground messages — show BOTH in-app toast AND native notification
  useEffect(() => {
    if (status !== 'granted' || !token) return;

    let unsubscribe: (() => void) | null = null;

    onForegroundMessage((payload) => {
      const notification = payload.notification;
      if (!notification) return;

      const title = notification.title || 'AWS User Group Pune';
      const body = notification.body || '';

      // 1. In-app toast
      toast({
        title,
        description: body,
      });

      // 2. Native OS notification (shows in notification center)
      if (Notification.permission === 'granted') {
        const nativeNotif = new Notification(title, {
          body,
          icon: '/android-chrome-192x192.png',
          badge: '/android-chrome-192x192.png',
          tag: 'awsugpune-foreground',
          data: { url: payload.data?.url || '/' },
        });

        nativeNotif.onclick = () => {
          window.focus();
          nativeNotif.close();
        };
      }
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [status, token, toast]);

  return { status, token, isSupported, requestPermission };
}
