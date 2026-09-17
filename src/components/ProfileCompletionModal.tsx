import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { avatars } from '@/lib/appwrite';
import { X, Cake, User, Sparkles, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileCompletionModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Glassmorphic modal shown once after first Google login.
 * Collects birthday + gender, saves to Appwrite prefs.
 */
export default function ProfileCompletionModal({ open, onClose }: ProfileCompletionModalProps) {
  const { user, completeProfile } = useAuth();
  const { toast } = useToast();
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open || !user) return null;

  const avatarUrl = (user.prefs as Record<string, unknown>)?.['picture'] as string
    || avatars.getInitials(user.name || user.email, 120, 120).toString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await completeProfile({ birthday, gender });
      toast({
        title: '🎉 Profile complete!',
        description: 'We\'ll remember your special day.',
      });
      onClose();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      // Mark profile as complete even if skipped
      await completeProfile({});
      onClose();
    } catch {
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/20
          bg-card/90 backdrop-blur-xl shadow-2xl shadow-primary/10"
        style={{ animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Gradient accent top bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground/60
            hover:text-foreground hover:bg-secondary transition-all duration-200"
          aria-label="Skip"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <img
                src={avatarUrl}
                alt={user.name || 'User'}
                className="w-20 h-20 rounded-full border-2 border-primary/30 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500
                flex items-center justify-center border-2 border-card">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Welcome
              </span>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>

            <h2 className="text-lg font-bold text-foreground">
              Hey {user.name?.split(' ')[0] || 'there'}! 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete your profile so we can personalize your community experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Birthday */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                <Cake className="w-4 h-4 text-primary" />
                Birthday
              </label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/50
                  text-foreground text-sm placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                  transition-all duration-200"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                <User className="w-4 h-4 text-primary" />
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/50
                  text-foreground text-sm appearance-none cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                  transition-all duration-200"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold
                hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]
                active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? 'Saving...' : '✨ Save & Continue'}
            </button>

            {/* Skip */}
            <button
              type="button"
              onClick={handleSkip}
              disabled={saving}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
