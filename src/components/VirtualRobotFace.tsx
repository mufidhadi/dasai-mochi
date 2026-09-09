import React, { useRef, useEffect } from 'react';
import type { TamagotchiExpression, TamagotchiActionState, ColorTheme, Vector2D } from '../types/tamagotchi';

interface VirtualRobotFaceProps {
  expression: TamagotchiExpression;
  activeAction: TamagotchiActionState;
  theme: ColorTheme;
  onPet: () => void;
}

const THEME_COLORS: Record<ColorTheme, { main: string; glow: string; bg: string }> = {
  cyan: { main: '#00f3ff', glow: 'rgba(0, 243, 255, 0.6)', bg: '#030d14' },
  amber: { main: '#ffb700', glow: 'rgba(255, 183, 0, 0.6)', bg: '#140c03' },
  green: { main: '#00ff66', glow: 'rgba(0, 255, 102, 0.6)', bg: '#031408' },
  magenta: { main: '#ff0055', glow: 'rgba(255, 0, 85, 0.6)', bg: '#14030a' },
  white: { main: '#e2f1f8', glow: 'rgba(226, 241, 248, 0.6)', bg: '#080a0c' },
};

interface BallObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface BubbleObject {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobble: number;
}

export const VirtualRobotFace: React.FC<VirtualRobotFaceProps> = ({
  expression,
  activeAction,
  theme,
  onPet,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<Vector2D>({ x: 0, y: 0 });
  const blinkStateRef = useRef({ isBlinking: false });

  // Animation State Refs for Physics & Props
  const foodProgressRef = useRef(0);
  const ballRef = useRef<BallObject | null>(null);
  const bubblesRef = useRef<BubbleObject[]>([]);

  // Mouse / Touch position tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let frameCount = 0;

    // Reset action state parameters on action change
    if (activeAction === 'feeding') {
      foodProgressRef.current = 0;
    } else if (activeAction === 'playing') {
      ballRef.current = {
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        vx: 8,
        vy: 6,
        radius: 24,
      };
    } else if (activeAction === 'cleaning') {
      bubblesRef.current = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        radius: 12 + Math.random() * 28,
        speed: 1.5 + Math.random() * 2.5,
        wobble: Math.random() * Math.PI * 2,
      }));
    }

    const render = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;
      const colors = THEME_COLORS[theme] || THEME_COLORS.cyan;

      // 1. Clear background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      // CRT Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      // Calculate eye and mouth positions scaled to screen
      const centerX = width / 2;
      const centerY = height / 2 - 20;

      const eyeDistance = Math.min(width * 0.22, 180);
      const leftEyePos = { x: centerX - eyeDistance, y: centerY };
      const rightEyePos = { x: centerX + eyeDistance, y: centerY };
      const eyeRadius = Math.min(width * 0.08, 65);
      const mouthY = centerY + eyeRadius + 50;

      // Pupil offset target calculation (look towards cursor OR bouncing ball)
      let targetX = mousePosRef.current.x || centerX;
      let targetY = mousePosRef.current.y || centerY;

      if (activeAction === 'playing' && ballRef.current) {
        targetX = ballRef.current.x;
        targetY = ballRef.current.y;
      }

      const deltaX = (targetX - centerX) / width;
      const deltaY = (targetY - centerY) / height;

      const maxPupilOffset = eyeRadius * 0.35;
      const pupilOffset = {
        x: Math.max(-maxPupilOffset, Math.min(maxPupilOffset, deltaX * maxPupilOffset * 2.5)),
        y: Math.max(-maxPupilOffset, Math.min(maxPupilOffset, deltaY * maxPupilOffset * 2.5)),
      };

      // Random blinking logic
      if (!blinkStateRef.current.isBlinking && Math.random() < 0.005) {
        blinkStateRef.current.isBlinking = true;
        setTimeout(() => {
          blinkStateRef.current.isBlinking = false;
        }, 150);
      }

      const isBlinking = blinkStateRef.current.isBlinking || expression === 'sleeping';

      // Glow style setup
      ctx.shadowBlur = 25;
      ctx.shadowColor = colors.glow;
      ctx.fillStyle = colors.main;
      ctx.strokeStyle = colors.main;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';

      // 2. Draw Cheeks (Blushing when pet or happy)
      if (expression === 'love' || activeAction === 'petting') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 100, 0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0066';
        ctx.beginPath();
        ctx.ellipse(leftEyePos.x, leftEyePos.y + eyeRadius + 15, 25, 12, 0, 0, Math.PI * 2);
        ctx.ellipse(rightEyePos.x, rightEyePos.y + eyeRadius + 15, 25, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Eyes
      const drawEye = (pos: Vector2D) => {
        ctx.save();
        ctx.translate(pos.x, pos.y);

        if (isBlinking) {
          ctx.beginPath();
          ctx.moveTo(-eyeRadius, 0);
          ctx.lineTo(eyeRadius, 0);
          ctx.stroke();
        } else if (expression === 'happy' || expression === 'love') {
          if (expression === 'love') {
            ctx.font = `${eyeRadius * 1.6}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', 0, 0);
          } else {
            ctx.beginPath();
            ctx.arc(0, eyeRadius * 0.2, eyeRadius * 0.8, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();
          }
        } else if (expression === 'excited' || activeAction === 'playing') {
          ctx.font = `${eyeRadius * 1.5}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', 0, 0);
        } else if (expression === 'low_battery') {
          const opacity = Math.sin(frameCount * 0.1) > 0 ? 1 : 0.3;
          ctx.globalAlpha = opacity;
          ctx.font = `bold ${eyeRadius * 1.2}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('!', 0, 0);
          ctx.globalAlpha = 1.0;
        } else {
          const currentRadius = expression === 'surprised' ? eyeRadius * 1.2 : eyeRadius;

          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = colors.bg;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(pupilOffset.x, pupilOffset.y, currentRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(
            pupilOffset.x - currentRadius * 0.2,
            pupilOffset.y - currentRadius * 0.2,
            currentRadius * 0.18,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        ctx.restore();
      };

      drawEye(leftEyePos);
      drawEye(rightEyePos);

      // 4. Draw Mouth with Chewing & Expression Animations
      ctx.save();
      ctx.translate(centerX, mouthY);

      ctx.shadowBlur = 20;
      ctx.shadowColor = colors.glow;
      ctx.strokeStyle = colors.main;
      ctx.fillStyle = colors.main;

      if (activeAction === 'feeding') {
        // Chewing animation: mouth opens and closes rhythmically
        const chewingCycle = Math.abs(Math.sin(frameCount * 0.25));
        const mouthOpen = 10 + chewingCycle * 25;

        ctx.beginPath();
        ctx.ellipse(0, 0, 30, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flying food crumbs during chewing
        ctx.fillStyle = colors.main;
        for (let i = 0; i < 4; i++) {
          const crumbX = Math.sin(frameCount * 0.2 + i) * 35;
          const crumbY = Math.cos(frameCount * 0.3 + i) * 20 + 15;
          ctx.fillRect(crumbX, crumbY, 4, 4);
        }
      } else if (expression === 'happy' || expression === 'excited') {
        ctx.beginPath();
        ctx.arc(0, -10, 35, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.closePath();
        ctx.fill();
      } else if (expression === 'hungry') {
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 35, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (expression === 'love') {
        ctx.beginPath();
        ctx.arc(0, -15, 30, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else if (expression === 'surprised') {
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
      } else if (expression === 'sleeping' || expression === 'sleepy') {
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.stroke();
      } else {
        const breathingOffset = Math.sin(frameCount * 0.05) * 3;
        ctx.beginPath();
        ctx.arc(0, -15 + breathingOffset, 30, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      }

      ctx.restore();

      // 5. ANIMATED ACTION OVERLAYS

      // A. Feeding Animation: Food items gliding into mouth
      if (activeAction === 'feeding') {
        foodProgressRef.current = Math.min(1.0, foodProgressRef.current + 0.02);
        const progress = foodProgressRef.current;

        const startY = height + 50;
        const currentY = startY - progress * (startY - mouthY);
        const foodSize = Math.max(10, 45 * (1 - progress * 0.5));

        ctx.save();
        ctx.font = `${foodSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors.glow;
        ctx.fillText('🍱', centerX, currentY);
        ctx.restore();
      }

      // B. Playing Animation: Bouncing 2D ball physics
      if (activeAction === 'playing' && ballRef.current) {
        const ball = ballRef.current;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off canvas walls
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
          ball.vx *= -1;
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > height - 100) {
          ball.vy *= -1;
        }

        ctx.save();
        ctx.font = `${ball.radius * 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 20;
        ctx.shadowColor = colors.glow;
        ctx.fillText('⚽', ball.x, ball.y);
        ctx.restore();
      }

      // C. Cleaning / Bathing Animation: Soap Bubbles & Water Spray
      if (activeAction === 'cleaning') {
        ctx.save();
        bubblesRef.current.forEach((bubble) => {
          bubble.y -= bubble.speed;
          bubble.x += Math.sin(frameCount * 0.05 + bubble.wobble) * 1.5;

          if (bubble.y < -50) {
            bubble.y = height + 50;
            bubble.x = Math.random() * width;
          }

          ctx.strokeStyle = colors.main;
          ctx.fillStyle = colors.glow;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 15;
          ctx.shadowColor = colors.glow;

          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();

          // Bubble highlight shine
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.25, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // D. Petting Animation: Hearts floating up
      if (activeAction === 'petting') {
        ctx.save();
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < 5; i++) {
          const heartX = centerX + Math.sin(frameCount * 0.05 + i) * (80 + i * 20);
          const heartY = centerY - (frameCount % 80) * 2 - i * 30;
          ctx.fillText('💖', heartX, heartY);
        }
        ctx.restore();
      }

      // E. Sleeping Animation: Zzz
      if (expression === 'sleeping') {
        ctx.save();
        ctx.fillStyle = colors.main;
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors.glow;
        ctx.font = 'bold 32px sans-serif';

        const zX = rightEyePos.x + 40 + Math.sin(frameCount * 0.03) * 15;
        const zY = rightEyePos.y - 40 - (frameCount % 100) * 0.8;
        ctx.fillText('Zzz', zX, zY);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [expression, activeAction, theme]);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden cursor-pointer select-none"
      onClick={onPet}
    >
      <canvas 
        ref={canvasRef}
        data-testid="virtual-robot-canvas"
        className="w-full h-full block"
      />
    </div>
  );
};
