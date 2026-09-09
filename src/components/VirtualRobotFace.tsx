import React, { useRef, useEffect } from 'react';
import type { TamagotchiExpression, ColorTheme, Vector2D } from '../types/tamagotchi';

interface VirtualRobotFaceProps {
  expression: TamagotchiExpression;
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

export const VirtualRobotFace: React.FC<VirtualRobotFaceProps> = ({ expression, theme, onPet }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<Vector2D>({ x: 0, y: 0 });
  const blinkStateRef = useRef({ isBlinking: false });

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

    const render = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;
      const colors = THEME_COLORS[theme] || THEME_COLORS.cyan;

      // 1. Clear background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      // Add subtle CRT scanlines
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

      // Pupil offset target calculation (look towards cursor)
      const mouseX = mousePosRef.current.x || centerX;
      const mouseY = mousePosRef.current.y || centerY;

      const deltaX = (mouseX - centerX) / width;
      const deltaY = (mouseY - centerY) / height;

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

      // 2. Draw Eyes
      const drawEye = (pos: Vector2D) => {
        ctx.save();
        ctx.translate(pos.x, pos.y);

        if (isBlinking) {
          // Closed eye line
          ctx.beginPath();
          ctx.moveTo(-eyeRadius, 0);
          ctx.lineTo(eyeRadius, 0);
          ctx.stroke();
        } else if (expression === 'happy' || expression === 'love') {
          if (expression === 'love') {
            // Heart-shaped eye
            ctx.font = `${eyeRadius * 1.6}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', 0, 0);
          } else {
            // Curved arc happy eye `^`
            ctx.beginPath();
            ctx.arc(0, eyeRadius * 0.2, eyeRadius * 0.8, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();
          }
        } else if (expression === 'excited') {
          // Star/Sparkle eye `★`
          ctx.font = `${eyeRadius * 1.5}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', 0, 0);
        } else if (expression === 'low_battery') {
          // Low battery warning eye `!` or flickering `X`
          const opacity = Math.sin(frameCount * 0.1) > 0 ? 1 : 0.3;
          ctx.globalAlpha = opacity;
          ctx.font = `bold ${eyeRadius * 1.2}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('!', 0, 0);
          ctx.globalAlpha = 1.0;
        } else {
          // Standard / Neutral / Hungry / Surprised Eye (Outer circle + inner pupil)
          const currentRadius = expression === 'surprised' ? eyeRadius * 1.2 : eyeRadius;

          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fill();

          // Inner dark pupil looking around
          ctx.fillStyle = colors.bg;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(pupilOffset.x, pupilOffset.y, currentRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Highlighting glare circle
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

      // 3. Draw Mouth
      const mouthY = centerY + eyeRadius + 50;
      ctx.save();
      ctx.translate(centerX, mouthY);

      ctx.shadowBlur = 20;
      ctx.shadowColor = colors.glow;
      ctx.strokeStyle = colors.main;
      ctx.fillStyle = colors.main;

      if (expression === 'happy' || expression === 'excited') {
        // Smiling mouth open
        ctx.beginPath();
        ctx.arc(0, -10, 35, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.closePath();
        ctx.fill();
      } else if (expression === 'hungry') {
        // Open oval mouth waiting for food
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 35, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (expression === 'love') {
        // Sweet smile
        ctx.beginPath();
        ctx.arc(0, -15, 30, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else if (expression === 'surprised') {
        // Small round `o` mouth
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
      } else if (expression === 'sleeping' || expression === 'sleepy') {
        // Quiet flat line mouth
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.stroke();
      } else {
        // Neutral slight gentle curve
        const breathingOffset = Math.sin(frameCount * 0.05) * 3;
        ctx.beginPath();
        ctx.arc(0, -15 + breathingOffset, 30, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      }

      ctx.restore();

      // 4. Render Floating Particles (Zzz)
      if (expression === 'sleeping') {
        ctx.save();
        ctx.fillStyle = colors.main;
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors.glow;
        ctx.font = 'bold 28px sans-serif';

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
  }, [expression, theme]);

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
