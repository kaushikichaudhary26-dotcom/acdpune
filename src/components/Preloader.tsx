import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 28);

    // Start exit animation after lottie plays
    const exitTimer = setTimeout(() => setIsExiting(true), 3000);
    const completeTimer = setTimeout(() => onComplete(), 3800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px]"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">

            {/* Welcome Text - Positioned at top */}
            <div className="absolute top-8 md:top-12 lg:top-20 left-0 right-0 text-center overflow-hidden px-4 z-20">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]">
                  Welcome
                </h1>
              </motion.div>

              <motion.p
                className="text-sm md:text-lg lg:text-xl xl:text-2xl text-muted-foreground font-medium tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                AWS User Group Pune
              </motion.p>
            </div>

            {/* Full Page Handshake Lottie Animation */}
            <motion.div
              className="w-full aspect-square"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <DotLottieReact
                src="/lottie/handshake.lottie"
                autoplay
                loop={false}
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>

            {/* Enhanced Loading Bar with Percentage - Positioned at bottom */}
            <div className="absolute bottom-8 md:bottom-12 lg:bottom-20 left-0 right-0 px-4 z-20">
              <div className="w-full max-w-md lg:max-w-lg mx-auto space-y-3">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Loading Bar Container */}
                  <div className="relative h-2 md:h-2.5 lg:h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-primary/10">
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    {/* Progress Bar */}
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    >
                      {/* Glow Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Progress Percentage */}
                  <motion.div
                    className="flex items-center justify-center mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-sm md:text-base lg:text-lg font-semibold text-primary/80 tabular-nums">
                      {progress}%
                    </span>
                  </motion.div>
                </motion.div>

                {/* Loading Status Text */}
                <motion.p
                  className="text-xs md:text-sm lg:text-base text-center text-muted-foreground/60 font-light tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.5,
                    times: [0, 0.1, 0.9, 1],
                    repeat: Infinity,
                  }}
                >
                  Preparing your experience...
                </motion.p>
              </div>
            </div>

          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Preloader;