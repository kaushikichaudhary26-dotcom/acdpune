import { useState, useEffect, useRef } from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/hooks/use-auth';

const DISMISS_COUNT_KEY = 'acd_notif_prompt_dismissals';
const INITIAL_DELAY_MS = 4000;    // 4s after preloader
const BASE_RE_PROMPT_MS = 30000;  // 30s base for re-prompts
const MAX_RE_PROMPT_MS = 300000;  // 5 min cap

interface NotificationPromptProps {
  preloaderDone: boolean;
}

/**
 * Persistent notification prompt — re-appears with increasing delay
 * each time the user dismisses it, until they grant or deny permission.
 */
export default function NotificationPrompt({ preloaderDone }: NotificationPromptProps) {
  const { user, needsProfileCompletion } = useAuth();
  const { status, isSupported, requestPermission } = useNotifications();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate delay based on how many times the user has dismissed
  const getDismissCount = () => {
    return parseInt(sessionStorage.getItem(DISMISS_COUNT_KEY) || '0', 10);
  };

  const getDelay = (dismissals: number) => {
    if (dismissals === 0) return INITIAL_DELAY_MS;
    // Exponential backoff: 30s → 60s → 120s → 240s → cap at 5min
    return Math.min(BASE_RE_PROMPT_MS * Math.pow(2, dismissals - 1), MAX_RE_PROMPT_MS);
  };

  // Schedule showing the prompt
  const schedulePrompt = (delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setExiting(false);
      setVisible(true);
    }, delay);
  };

  // Main effect: show prompt when conditions are met
  useEffect(() => {
    if (!preloaderDone) return;
    if (!isSupported) return;
    // Don't show notification prompt if user is guest or needs to complete profile
    if (!user || needsProfileCompletion) return;
    if (status === 'granted' || status === 'denied' || status === 'unsupported') return;

    const dismissals = getDismissCount();
    const delay = getDelay(dismissals);
    schedulePrompt(delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [preloaderDone, isSupported, status, user, needsProfileCompletion]);

  // Auto-hide when permission is granted
  useEffect(() => {
    if (status === 'granted' && visible) {
      animateOut();
    }
  }, [status, visible]);

  const animateOut = () => {
    setExiting(true);
    setTimeout(() => setVisible(false), 400);
  };

  const dismiss = () => {
    // Increment dismissal count and re-schedule with longer delay
    const count = getDismissCount() + 1;
    sessionStorage.setItem(DISMISS_COUNT_KEY, String(count));

    animateOut();

    // Schedule next appearance with longer delay
    if (status !== 'granted' && status !== 'denied') {
      const nextDelay = getDelay(count);
      setTimeout(() => schedulePrompt(nextDelay), 500);
    }
  };

  const handleEnable = async () => {
    await requestPermission();
    // If granted, the useEffect above will auto-hide
    // If not granted (user closed the browser prompt), treat as dismissal
    if (Notification.permission !== 'granted') {
      dismiss();
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed z-[9999] transition-all duration-500 ease-out
        bottom-6 left-1/2 -translate-x-1/2 w-[92vw] max-w-md
        md:left-auto md:translate-x-0 md:right-6 md:bottom-6 md:w-[420px] md:max-w-[420px]
        lg:right-8 lg:bottom-8 lg:w-[440px] lg:max-w-[440px]
        ${exiting
          ? 'translate-y-full opacity-0 scale-95'
          : 'translate-y-0 opacity-100 scale-100'
        }`}
      style={{
        animation: exiting ? undefined : 'notif-prompt-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/20
        bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/10"
      >
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 animate-gradient bg-[length:200%_100%] pointer-events-none" />

        {/* Content */}
        <div className="relative p-5">
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground/60
              hover:text-foreground hover:bg-secondary transition-all duration-200"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon with pulse ring */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20
                flex items-center justify-center border border-primary/20"
              >
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-primary/10 animate-ping pointer-events-none" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Stay Updated
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Stay in sync with AWSUG Pune updates
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get notified about meetups, workshops, and community announcements.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleEnable}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold
                hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]
                active:scale-[0.98] transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              Enable Notifications
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground
                hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              Not now
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes notif-prompt-enter {
          0% {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
