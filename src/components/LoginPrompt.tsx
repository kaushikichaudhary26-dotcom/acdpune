  import { useState, useEffect, useRef } from 'react';
  import { LogIn, X, Sparkles } from 'lucide-react';
  import { useAuth } from '@/hooks/use-auth';

const DISMISS_COUNT_KEY = 'acd_login_prompt_dismissals';
const INITIAL_DELAY_MS = 6000;     // 6s after preloader
const BASE_RE_PROMPT_MS = 45000;   // 45s base for re-prompts
const MAX_RE_PROMPT_MS = 300000;   // 5 min cap

interface LoginPromptProps {
  preloaderDone: boolean;
}

/**
 * Persistent login prompt — shown to guest (non-authenticated) visitors.
 * Re-appears with increasing delay if dismissed, similar to NotificationPrompt.
 * Uses Appwrite OAuth2 (Google) for authentication.
 */
export default function LoginPrompt({ preloaderDone }: LoginPromptProps) {
  const { user, loading, loginWithOAuth } = useAuth();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDismissCount = () => {
    return parseInt(sessionStorage.getItem(DISMISS_COUNT_KEY) || '0', 10);
  };

  const getDelay = (dismissals: number) => {
    if (dismissals === 0) return INITIAL_DELAY_MS;
    return Math.min(BASE_RE_PROMPT_MS * Math.pow(2, dismissals - 1), MAX_RE_PROMPT_MS);
  };

  const schedulePrompt = (delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setExiting(false);
      setVisible(true);
    }, delay);
  };

  // Show prompt for guests only
  useEffect(() => {
    if (!preloaderDone) return;
    if (loading) return;
    // Don't show if user is logged in
    if (user) {
      setVisible(false);
      return;
    }

    const dismissals = getDismissCount();
    const delay = getDelay(dismissals);
    schedulePrompt(delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [preloaderDone, loading, user]);

  // Auto-hide when user logs in
  useEffect(() => {
    if (user && visible) {
      animateOut();
    }
  }, [user, visible]);

  const animateOut = () => {
    setExiting(true);
    setTimeout(() => setVisible(false), 400);
  };

  const dismiss = () => {
    const count = getDismissCount() + 1;
    sessionStorage.setItem(DISMISS_COUNT_KEY, String(count));
    animateOut();

    // Schedule next appearance with longer delay
    if (!user) {
      const nextDelay = getDelay(count);
      setTimeout(() => schedulePrompt(nextDelay), 500);
    }
  };

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    try {
      await loginWithOAuth('/');
      // This will redirect to Google — page will unload
    } catch {
      setSigningIn(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed z-[9998] transition-all duration-500 ease-out
        bottom-6 left-1/2 -translate-x-1/2 w-[92vw] max-w-md
        md:left-auto md:translate-x-0 md:right-6 md:bottom-6 md:w-[420px] md:max-w-[420px]
        lg:right-8 lg:bottom-8 lg:w-[440px] lg:max-w-[440px]
        ${exiting
          ? 'translate-y-full opacity-0 scale-95'
          : 'translate-y-0 opacity-100 scale-100'
        }`}
      style={{
        animation: exiting ? undefined : 'login-prompt-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20
        bg-card/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10"
      >
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-blue-500/20 animate-gradient bg-[length:200%_100%] pointer-events-none" />

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
            {/* Icon */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20
                flex items-center justify-center border border-blue-500/20"
              >
                <LogIn className="w-6 h-6 text-blue-500" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-blue-500/10 animate-ping pointer-events-none" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Join the Community
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Sign in to personalize your experience
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get birthday wishes, event reminders, and exclusive updates tailored just for you.
              </p>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="flex-1 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl
                bg-white text-gray-700 text-sm font-semibold border border-gray-200
                hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02]
                active:scale-[0.98] transition-all duration-200
                disabled:opacity-60 disabled:pointer-events-none"
            >
              <svg className="w-1 h-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {signingIn ? 'Redirecting...' : 'Continue with Google'}
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
        @keyframes login-prompt-enter {
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
