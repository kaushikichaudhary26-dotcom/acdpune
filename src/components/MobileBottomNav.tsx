import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Handshake, HeartHandshake, Info, Users } from 'lucide-react';

// Standard evenly spaced nav items for mobile
const navItems = [
  { href: '#about', label: 'About', Icon: Info },
  { href: '#women-in-tech', label: 'Women in Tech', Icon: HeartHandshake },
  { href: '#team', label: 'Team', Icon: Users },
  { href: '#join', label: 'Join', Icon: Handshake },
];

const MobileBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" aria-label="Mobile navigation">
      <div
        className="mx-4 mb-4 rounded-full border border-[#2A2A2A] bg-[#1F1F1F]/80 backdrop-blur-[24px]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between py-2">
            {navItems.map(({ href, label, Icon }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <a
                    href={href}
                    className="flex items-center justify-center rounded-full p-2 text-[#7A7870] hover:text-[#FF9900] transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
