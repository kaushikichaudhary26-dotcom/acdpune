import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

/**
 * Animated canvas-based particle grid with AWS-orange dots
 * connected by faint lines. Extremely subtle — acts as a
 * cinematic backdrop for the hero section.
 */
const ParticleGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const spacing = 50;
    const particles: Particle[] = [];
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing;
        const y = row * spacing;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const maxDist = 100;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;

      if (!reducedMotion) {
        // Update positions with slow drift
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          // Drift back toward base position (elastic)
          const dx = p.baseX - p.x;
          const dy = p.baseY - p.y;
          p.vx += dx * 0.0003;
          p.vy += dy * 0.0003;

          // Damping
          p.vx *= 0.999;
          p.vy *= 0.999;
        }
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.06;
            ctx.strokeStyle = `rgba(255, 153, 0, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of particles) {
        ctx.fillStyle = 'rgba(255, 153, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current);
      } else {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      style={{ opacity: 0.8 }}
    />
  );
};

export default ParticleGrid;
