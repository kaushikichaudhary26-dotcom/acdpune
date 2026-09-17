import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Mic2, HandHeart, Loader2, CheckCircle2, LogIn, Linkedin, Phone, Mail, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import {
  submitApplication,
  type ApplicationRole,
  type SessionType,
  type ApplicationFormData,
} from '@/hooks/use-community-applications';

interface JoinFormModalProps {
  open: boolean;
  onClose: () => void;
  initialRole?: ApplicationRole;
}

/**
 * Lightweight join form modal — uses CSS transitions instead of framer-motion
 * to avoid layout-thrashing on every keystroke.
 */
const JoinFormModal = ({ open, onClose, initialRole }: JoinFormModalProps) => {
  const { user, loginWithOAuth } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const [role, setRole] = useState<ApplicationRole | null>(initialRole ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Form fields stored in a single ref-backed object to avoid per-keystroke re-renders
  const [formData, setFormData] = useState({
    phone: '',
    linkedin: '',
    experience: '',
    motivation: '',
    availability: '',
    topicTitle: '',
    topicAbstract: '',
    sessionType: 'both' as SessionType,
    priorSpeaking: '',
  });

  const updateField = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Animate in after mount
  useEffect(() => {
    if (open) {
      // Reset form state
      setRole(initialRole ?? null);
      setSubmitted(false);
      setError(null);
      setFormData({
        phone: '',
        linkedin: '',
        experience: '',
        motivation: '',
        availability: '',
        topicTitle: '',
        topicAbstract: '',
        sessionType: 'both',
        priorSpeaking: '',
      });
      // Trigger CSS transition on next frame
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open, initialRole]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSubmit = useCallback(async () => {
    if (!role || !user) return;

    const { phone, motivation, topicTitle, linkedin, experience, availability, topicAbstract, sessionType, priorSpeaking } = formData;

    if (!phone.trim()) { setError('Phone number is required'); return; }
    if (!motivation.trim()) { setError('Please tell us why you want to join'); return; }
    if (role === 'speaker' && !topicTitle.trim()) { setError('Please provide a topic title'); return; }

    setError(null);
    setSubmitting(true);

    try {
      const data: ApplicationFormData = {
        role,
        name: user.name || '',
        email: user.email || '',
        phone: phone.trim(),
        linkedin: linkedin.trim() || undefined,
        experience: experience.trim() || undefined,
        motivation: motivation.trim(),
        userId: user.$id,
      };

      if (role === 'volunteer') {
        data.availability = availability.trim() || undefined;
      } else {
        data.topicTitle = topicTitle.trim() || undefined;
        data.topicAbstract = topicAbstract.trim() || undefined;
        data.sessionType = sessionType;
        data.priorSpeaking = priorSpeaking.trim() || undefined;
      }

      await submitApplication(data);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [role, user, formData]);

  const handleOAuthLogin = useCallback(() => {
    loginWithOAuth('/her-tech-era');
  }, [loginWithOAuth]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Backdrop — no backdrop-blur to avoid GPU stall */}
      <div
        className="absolute inset-0 bg-black/75"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className="join-form-modal"
        style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.25s ease, opacity 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── Success ── */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold text-white">Application Submitted!</h3>
            <p className="mt-3 text-[15px] text-white/60 max-w-[400px]">
              Thank you for your interest in <span className="text-[#9361A1] font-semibold">Her Tech Era</span>. We'll review your application and get back to you soon.
            </p>
            <Button onClick={onClose} className="mt-8 rounded-full bg-[#6D64AD] px-8 text-white hover:bg-[#7B6FC0]">
              Close
            </Button>
          </div>
        ) : !user ? (
          /* ── Login prompt ── */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6D64AD]/20 text-[#9361A1] mb-6">
              <LogIn className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-white">Sign in to continue</h3>
            <p className="mt-3 text-[15px] text-white/60 max-w-[400px]">
              We use your Google account to auto-fill your details and verify your identity.
            </p>
            <Button onClick={handleOAuthLogin} className="mt-8 rounded-full bg-white px-8 text-[#483184] font-semibold hover:bg-white/90">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
          </div>
        ) : !role ? (
          /* ── Role selection ── */
          <div className="py-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white">How would you like to contribute?</h3>
              <p className="mt-2 text-[14px] text-white/50">Choose your path to join Her Tech Era</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <button onClick={() => setRole('volunteer')} className="join-form-role-card group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6D64AD]/15 text-[#9361A1] transition-colors group-hover:bg-[#6D64AD]/25">
                  <HandHeart className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-[17px] font-semibold text-white">Support as Volunteer</h4>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">
                  Help organize events, manage sessions, and build a welcoming community space.
                </p>
              </button>
              <button onClick={() => setRole('speaker')} className="join-form-role-card group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6D64AD]/15 text-[#9361A1] transition-colors group-hover:bg-[#6D64AD]/25">
                  <Mic2 className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-[17px] font-semibold text-white">Speak at a Session</h4>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">
                  Share your cloud expertise through talks, panels, or hands-on workshops.
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <div className="py-2">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setRole(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
                aria-label="Back to role selection"
              >
                ←
              </button>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {role === 'volunteer' ? 'Volunteer Application' : 'Speaker Application'}
                </h3>
                <p className="text-[12px] text-white/40">Fields marked with * are required</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 join-form-scrollbar">
              {/* Auto-filled (read-only) */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] text-white/50 flex items-center gap-1.5">
                    <UserIcon className="h-3 w-3" /> Name
                  </Label>
                  <Input value={user.name || ''} readOnly className="join-form-input-readonly" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] text-white/50 flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input value={user.email || ''} readOnly className="join-form-input-readonly" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-[12px] text-white/50 flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> Phone Number *
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="join-form-input"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1.5">
                <Label className="text-[12px] text-white/50 flex items-center gap-1.5">
                  <Linkedin className="h-3 w-3" /> LinkedIn Profile
                </Label>
                <Input
                  value={formData.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="join-form-input"
                />
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <Label className="text-[12px] text-white/50">Relevant Experience</Label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  placeholder="Brief overview of your background..."
                  rows={2}
                  className="join-form-input resize-none"
                />
              </div>

              {/* Motivation */}
              <div className="space-y-1.5">
                <Label className="text-[12px] text-white/50">Why do you want to join? *</Label>
                <Textarea
                  value={formData.motivation}
                  onChange={(e) => updateField('motivation', e.target.value)}
                  placeholder={role === 'volunteer'
                    ? "What motivates you to volunteer for Her Tech Era?"
                    : "Why do you want to speak at our community sessions?"
                  }
                  rows={3}
                  className="join-form-input resize-none"
                />
              </div>

              {/* ── Volunteer-only ── */}
              {role === 'volunteer' && (
                <div className="space-y-1.5">
                  <Label className="text-[12px] text-white/50">Availability</Label>
                  <Textarea
                    value={formData.availability}
                    onChange={(e) => updateField('availability', e.target.value)}
                    placeholder="e.g., Weekends, evenings after 6 PM, specific dates..."
                    rows={2}
                    className="join-form-input resize-none"
                  />
                </div>
              )}

              {/* ── Speaker-only ── */}
              {role === 'speaker' && (
                <div className="space-y-4">
                  <div className="h-px bg-white/[0.06] my-2" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9361A1]">Session Details</p>

                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-white/50">Topic Title *</Label>
                    <Input
                      value={formData.topicTitle}
                      onChange={(e) => updateField('topicTitle', e.target.value)}
                      placeholder="e.g., Building Serverless APIs with AWS Lambda"
                      className="join-form-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-white/50">Topic Abstract</Label>
                    <Textarea
                      value={formData.topicAbstract}
                      onChange={(e) => updateField('topicAbstract', e.target.value)}
                      placeholder="A brief summary of what you'll cover..."
                      rows={3}
                      className="join-form-input resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-white/50">Preferred Session Format</Label>
                    <Select value={formData.sessionType} onValueChange={(v) => updateField('sessionType', v)}>
                      <SelectTrigger className="join-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[70]">
                        <SelectItem value="offline">Offline (In-person)</SelectItem>
                        <SelectItem value="online">Online (Virtual)</SelectItem>
                        <SelectItem value="both">Either works</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-white/50">Prior Speaking Experience</Label>
                    <Textarea
                      value={formData.priorSpeaking}
                      onChange={(e) => updateField('priorSpeaking', e.target.value)}
                      placeholder="Any previous talks, meetups, conferences..."
                      rows={2}
                      className="join-form-input resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 text-[13px] text-red-400">{error}</p>
            )}

            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-full bg-[#6D64AD] px-8 text-white hover:bg-[#7B6FC0] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinFormModal;
