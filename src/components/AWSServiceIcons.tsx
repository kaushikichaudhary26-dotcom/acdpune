import { motion } from 'framer-motion';

// AWS Service Icon Components
const S3Icon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <path d="M40 8L12 24v32l28 16 28-16V24L40 8z" fill="hsl(var(--accent))" fillOpacity="0.2" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <path d="M40 40v32M12 24l28 16 28-16" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <text x="40" y="36" textAnchor="middle" fill="hsl(var(--accent))" fontSize="12" fontWeight="bold">S3</text>
  </svg>
);

const LambdaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <rect x="16" y="16" width="48" height="48" rx="4" fill="hsl(var(--primary))" fillOpacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
    <path d="M28 52l8-24 8 16 8-24" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="40" y="62" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8" fontWeight="bold">Lambda</text>
  </svg>
);

const EC2Icon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <rect x="20" y="20" width="40" height="40" rx="4" fill="hsl(var(--accent))" fillOpacity="0.2" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <rect x="28" y="28" width="24" height="16" rx="2" fill="none" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <line x1="32" y1="52" x2="32" y2="56" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <line x1="48" y1="52" x2="48" y2="56" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <text x="40" y="40" textAnchor="middle" fill="hsl(var(--accent))" fontSize="10" fontWeight="bold">EC2</text>
  </svg>
);

const Route53Icon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <circle cx="40" cy="40" r="24" fill="hsl(var(--primary))" fillOpacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
    <ellipse cx="40" cy="40" rx="24" ry="10" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
    <ellipse cx="40" cy="40" rx="10" ry="24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
    <text x="40" y="68" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8" fontWeight="bold">Route53</text>
  </svg>
);

const DynamoDBIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <ellipse cx="40" cy="24" rx="20" ry="8" fill="hsl(var(--accent))" fillOpacity="0.2" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <path d="M20 24v32c0 4.4 8.954 8 20 8s20-3.6 20-8V24" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <ellipse cx="40" cy="40" rx="20" ry="8" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeDasharray="4 2"/>
    <text x="40" y="50" textAnchor="middle" fill="hsl(var(--accent))" fontSize="7" fontWeight="bold">DynamoDB</text>
  </svg>
);

const CloudFrontIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <circle cx="40" cy="40" r="20" fill="hsl(var(--primary))" fillOpacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
    <circle cx="40" cy="40" r="10" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"/>
    <path d="M40 20v-8M40 68v-8M20 40h-8M68 40h-8M26 26l-6-6M60 60l-6-6M54 26l6-6M20 60l6-6" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
    <text x="40" y="72" textAnchor="middle" fill="hsl(var(--primary))" fontSize="6" fontWeight="bold">CloudFront</text>
  </svg>
);

const APIGatewayIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <rect x="24" y="16" width="32" height="48" rx="4" fill="hsl(var(--accent))" fillOpacity="0.2" stroke="hsl(var(--accent))" strokeWidth="2"/>
    <path d="M32 28h16M32 40h16M32 52h16" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="40" cy="28" r="3" fill="hsl(var(--accent))"/>
    <circle cx="40" cy="40" r="3" fill="hsl(var(--accent))"/>
    <circle cx="40" cy="52" r="3" fill="hsl(var(--accent))"/>
    <text x="40" y="72" textAnchor="middle" fill="hsl(var(--accent))" fontSize="6" fontWeight="bold">API GW</text>
  </svg>
);

const SQSIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <rect x="16" y="24" width="48" height="32" rx="4" fill="hsl(var(--primary))" fillOpacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
    <path d="M24 36h12M24 44h12M44 36h12M44 44h12" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
    <line x1="36" y1="28" x2="36" y2="52" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="3 2"/>
    <text x="40" y="66" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">SQS</text>
  </svg>
);

interface FloatingIconProps {
  Icon: React.ComponentType<{ className?: string }>;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
  duration?: number;
  size?: string;
}

const FloatingIcon = ({ Icon, position, delay = 0, duration = 6, size = "w-16 h-16" }: FloatingIconProps) => (
  <motion.div
    className={`absolute ${size} opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
    style={position}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.7, 0.4],
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      scale: 1,
    }}
    transition={{
      opacity: { duration, repeat: Infinity, delay },
      y: { duration: duration * 0.8, repeat: Infinity, delay, ease: "easeInOut" },
      rotate: { duration: duration * 1.2, repeat: Infinity, delay },
      scale: { duration: 0.5, delay: delay * 0.5 },
    }}
    whileHover={{ scale: 1.2, opacity: 1 }}
  >
    <Icon className="w-full h-full drop-shadow-lg" />
  </motion.div>
);

const AWSServiceIcons = () => {
  const icons = [
    { Icon: S3Icon, position: { top: '15%', left: '8%' }, delay: 0, size: "w-14 h-14 md:w-20 md:h-20" },
    { Icon: LambdaIcon, position: { top: '25%', right: '10%' }, delay: 0.5, size: "w-12 h-12 md:w-18 md:h-18" },
    { Icon: EC2Icon, position: { top: '45%', left: '5%' }, delay: 1, size: "w-14 h-14 md:w-16 md:h-16" },
    { Icon: Route53Icon, position: { top: '60%', right: '8%' }, delay: 1.5, size: "w-12 h-12 md:w-16 md:h-16" },
    { Icon: DynamoDBIcon, position: { bottom: '25%', left: '12%' }, delay: 2, size: "w-14 h-14 md:w-18 md:h-18" },
    { Icon: CloudFrontIcon, position: { top: '35%', right: '5%' }, delay: 2.5, size: "w-10 h-10 md:w-14 md:h-14" },
    { Icon: APIGatewayIcon, position: { bottom: '35%', right: '12%' }, delay: 3, size: "w-12 h-12 md:w-16 md:h-16" },
    { Icon: SQSIcon, position: { top: '70%', left: '6%' }, delay: 3.5, size: "w-10 h-10 md:w-14 md:h-14" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, index) => (
        <FloatingIcon key={index} {...icon} />
      ))}
    </div>
  );
};

export default AWSServiceIcons;
