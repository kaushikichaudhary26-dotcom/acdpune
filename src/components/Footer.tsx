import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Linkedin, Mail, MapPin, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo_new.png';
import { useTheme } from '@/hooks/use-theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { addNewsletterSubscriber } from '@/lib/firestore';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const logo = resolvedTheme === 'dark' ? logoDark : logoLight;
  const reducedMotion = useReducedMotion();
  const [subscribed, setSubscribed] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onNewsletterSubmit = async (data: NewsletterForm) => {
    await addNewsletterSubscriber({ email: data.email });
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-[#0A0A0A] px-[22px] pb-8 pt-12">
      {/* ── Animated gradient separator ──────────────── */}
      <div className="animated-separator mb-12" />

      <div className="site-container">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <img src={logo} alt="AWS User Group Pune" className="h-12 w-auto" />
            <p className="mt-5 text-[13px] leading-[1.8] text-[#9CA3AF]">
              AWS User Group Pune is a thriving community of 20,000+ cloud and AI enthusiasts.
              We host meetups, workshops, and mentorship to help builders grow.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {[
                { href: 'https://www.linkedin.com/company/aws-user-group-pune/', icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://x.com/AwsPune', icon: X, label: 'X' },
                { href: 'mailto:aws.acd.pune@gmail.com', icon: Mail, label: 'Email' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  whileHover={reducedMotion ? {} : { scale: 1.1 }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] text-[#9CA3AF] transition-all duration-200 hover:border-[#FF9900]/40 hover:text-[#FF9900]"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 text-[13px] text-[#9CA3AF]">
              <MapPin className="h-4 w-4 text-[#FF9900]" />
              <span>Pune, India</span>
            </div>
          </div>

          <div>
            <div className="section-eyebrow text-[#FF9900]">Navigation</div>
            <div className="mt-5 flex flex-col gap-3 text-[13px] text-[#9CA3AF]">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="#women-in-tech" className="hover:text-white transition-colors">Women in Tech</a>
              <a href="#team" className="hover:text-white transition-colors">Community Team</a>
              <a href="#highlights" className="hover:text-white transition-colors">Highlights</a>
              <a href="#join" className="hover:text-white transition-colors">Join</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
            </div>
          </div>

          <div>
            <div className="section-eyebrow text-[#FF9900]">Stay Updated</div>
            <p className="mt-5 text-[13px] leading-[1.8] text-[#9CA3AF]">
              Subscribe for updates about meetups, workshops, and community milestones.
            </p>

            {/* ── Newsletter form ─────────────────────── */}
            {subscribed ? (
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3"
              >
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <p className="text-[14px] font-medium text-emerald-400">You're subscribed!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onNewsletterSubmit)} className="mt-6 space-y-3">
                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#141414] px-4 py-3 text-[14px] text-white placeholder:text-[#9CA3AF] focus:border-[#FF9900]/40 focus:outline-none focus:ring-1 focus:ring-[#FF9900]/30 transition-all"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[12px] text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-full px-5 text-[13px] font-semibold"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}

            <p className="mt-4 text-[13px] text-[#9CA3AF]/60">
              Tip: Use the notification bell in the header to receive meetup updates.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(255,255,255,0.08)] pt-6 text-center text-[13px] text-[#9CA3AF]/60">
          © {new Date().getFullYear()} AWS User Group Pune. All rights reserved. Community-led learning supported by AWS.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
