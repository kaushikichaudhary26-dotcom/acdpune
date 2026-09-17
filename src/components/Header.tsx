import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Bell, BellRing, LayoutDashboard } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo_new.png';

import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';
import { avatars } from '@/lib/appwrite';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const SECTION_IDS = ['about', 'faq', 'team', 'join'];

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
  { href: '/her-tech-era', label: 'Her Tech Era', isPage: true },
  { href: '#team', label: 'Team' },
  { href: '#join', label: 'Join' },
] as const;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { status: notifStatus, isSupported: notifSupported } = useNotifications();
  const reducedMotion = useReducedMotion();
  const logo = resolvedTheme === 'dark' ? logoDark : logoLight;

  const userInitials = user
    ? (user.name || user.email || '')
        .split(/[\s@]+/)
        .slice(0, 2)
        .map((s) => s.charAt(0).toUpperCase())
        .join('')
    : '';

  const avatarUrl = user
    ? avatars
        .getInitials({
          name: user.name || user.email || '',
          width: 80,
          height: 80,
        })
        .toString()
    : '';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY <= 50) setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) return;
        const mostVisible = visibleEntries.reduce((best, entry) =>
          entry.intersectionRatio > best.intersectionRatio ? entry : best,
        );
        setActiveSection(mostVisible.target.id);
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = useCallback((href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
      setIsMenuOpen(false);
      return;
    }
    const id = href.replace('#', '');
    // If we're not on the homepage, navigate there first with the hash
    if (window.location.pathname !== '/') {
      navigate('/' + href);
      setIsMenuOpen(false);
      return;
    }
    setActiveSection(id);
    setIsMenuOpen(false);
  }, [navigate]);

  // Full-page overlay animation variants
  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    open: {
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const menuContainerVariants = {
    closed: {
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.15 },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════ */}
      {/* DESKTOP HEADER — single unified floating bar             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <header className="site-header hidden lg:block fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <motion.div
          initial={reducedMotion ? {} : { y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto w-full max-w-6xl px-6 pt-4"
        >
          {/* ── Single unified pill ── */}
          <nav className="unified-nav-bar pointer-events-auto">
            {/* Logo — left */}
            <a
              href="#"
              onClick={() => setActiveSection('')}
              className="unified-nav-logo"
            >
              <img src={logo} alt="AWS User Group Pune" className="h-12 w-auto" />
            </a>

            {/* Thin vertical separator */}
            <div className="unified-nav-divider" />

            {/* Nav links — center */}
            <div className="unified-nav-links">
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isPage = 'isPage' in link && link.isPage;
                const isActive = isPage
                  ? false
                  : activeSection === sectionId;

                if (isPage) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="unified-nav-link"
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`unified-nav-link ${isActive ? 'active' : ''}`}
                  >
                    {/* Animated pill background for active state */}
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-pill"
                        className="unified-nav-active-pill"
                        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Thin vertical separator */}
            <div className="unified-nav-divider" />

            {/* Right actions — notification + avatar */}
            <div className="unified-nav-actions">
              {/* Notification bell */}
              {notifSupported && (
                <div
                  className="unified-nav-icon-btn"
                  aria-label={
                    notifStatus === 'granted' ? 'Notifications enabled' : 'Notifications not enabled'
                  }
                  title={
                    notifStatus === 'granted' ? 'Notifications enabled' : 'Notifications not enabled'
                  }
                >
                  {notifStatus === 'granted' ? (
                    <BellRing className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <>
                      <Bell className="h-4 w-4 text-[#9CA3AF]" />
                      {notifStatus !== 'denied' && (
                        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#FF9900] animate-pulse" />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* User avatar dropdown */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full ring-2 ring-[#FF9900]/20 hover:ring-[#FF9900]/50 transition-all duration-200 focus:outline-none focus:ring-[#FF9900]">
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src={avatarUrl} alt={user.name || user.email || 'User'} />
                        <AvatarFallback className="bg-[#FF9900] text-white text-[10px] font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="truncate text-sm font-medium">{user.name || 'User'}</p>
                      <p className="truncate text-xs text-[#9CA3AF]">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {isAdmin ? (
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </nav>
        </motion.div>
      </header>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE HEADER — single unified floating bar              */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="site-header lg:hidden fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <motion.div
          initial={reducedMotion ? {} : { y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="px-4 pt-3"
        >
          <nav className="unified-nav-bar-mobile pointer-events-auto">
            {/* Logo — left */}
            <a
              href="#"
              onClick={() => { setActiveSection(''); setIsMenuOpen(false); }}
              className="unified-nav-logo"
            >
              <img src={logo} alt="AWS User Group Pune" className="h-12 w-auto" />
            </a>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* User avatar — mobile */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 focus:outline-none active:scale-95">
                      <Avatar className="h-7 w-7 cursor-pointer">
                        <AvatarImage src={avatarUrl} alt={user.name || user.email || 'User'} />
                        <AvatarFallback className="bg-[#FF9900] text-white text-[10px] font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="truncate text-sm font-medium">{user.name || 'User'}</p>
                      <p className="truncate text-xs text-[#9CA3AF]">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {isAdmin ? (
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="unified-nav-hamburger"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isMenuOpen ? 'close' : 'open'}
                    initial={reducedMotion ? {} : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={reducedMotion ? {} : { rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white"
                  >
                    {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE FULL-PAGE MENU OVERLAY                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed inset-0 z-40 flex flex-col"
          >
            {/* Dark backdrop with blur */}
            <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl" />

            {/* Subtle gradient accent */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 20%, rgba(255,153,0,0.04) 0%, transparent 60%)',
              }}
            />

            {/* Menu content */}
            <motion.div
              variants={menuContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative flex flex-col items-center justify-center flex-1 gap-2 px-8 pt-20 pb-12"
            >
              {/* Nav links */}
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isPage = 'isPage' in link && link.isPage;
                const isActive = isPage
                  ? false
                  : activeSection === sectionId;

                if (isPage) {
                  return (
                    <motion.button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      variants={menuItemVariants}
                      className="group relative w-full max-w-xs text-center py-4 text-2xl font-semibold tracking-tight transition-colors duration-200 text-white/70 hover:text-white"
                    >
                      {link.label}
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px w-0 bg-white/20 transition-all duration-300 group-hover:w-full" />
                    </motion.button>
                  );
                }

                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    variants={menuItemVariants}
                    className={`group relative w-full max-w-xs text-center py-4 text-2xl font-semibold tracking-tight transition-colors duration-200 ${
                      isActive ? 'text-[#FF9900]' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {/* Active dot indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="mobile-nav-dot"
                        className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-1 w-1 rounded-full bg-[#FF9900]"
                        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {/* Hover underline */}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px w-0 bg-white/20 transition-all duration-300 group-hover:w-full" />
                  </motion.a>
                );
              })}

              {/* Divider */}
              <motion.div
                variants={menuItemVariants}
                className="w-12 h-px bg-white/10 my-4"
              />

              {/* Join Now CTA */}
              <motion.a
                href="#join"
                onClick={() => handleNavClick('#join')}
                variants={menuItemVariants}
                whileTap={reducedMotion ? {} : { scale: 0.97 }}
                className="flex items-center justify-center h-12 w-full max-w-xs rounded-full bg-[#FF9900] text-[15px] font-bold text-white shadow-lg shadow-[#FF9900]/20 transition-colors hover:bg-[#FFB133]"
              >
                Join Now
              </motion.a>

              {/* Social/info links at bottom */}
              <motion.div
                variants={menuItemVariants}
                className="mt-8 text-center"
              >
                <p className="text-[11px] text-white/30 tracking-widest uppercase">
                  AWS User Group Pune
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
