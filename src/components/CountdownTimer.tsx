import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const eventDate = new Date('2026-03-21T09:00:00+05:30').getTime();
  
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = eventDate - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 md:gap-4">
          <div className="text-center">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl px-3 py-2 md:px-5 md:py-3 min-w-[60px] md:min-w-[80px]">
              <div className="text-2xl md:text-4xl font-bold gradient-text font-display">
                {String(unit.value).padStart(2, '0')}
              </div>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider">
              {unit.label}
            </div>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="text-2xl md:text-3xl text-accent font-bold mb-6">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
