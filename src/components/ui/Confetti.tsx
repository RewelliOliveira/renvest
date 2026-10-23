import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const DEFAULT_COLORS = ["#f05656", "#fbbf24", "#38bdf8", "#34d399", "#a78bfa", "#ffffff"];
const GRAVITY = 0.32;
const DRAG = 0.985;
const TERMINAL_VELOCITY = 4.5;

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  spin: number;
  // Fase da "virada" do papel, que dá a sensação de confete de verdade
  flip: number;
  flipSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  delay: number;
}

interface ConfettiProps {
  colors?: string[];
}

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Dois "canhões" nos cantos de baixo, com uma segunda leva mais fraca logo depois
function createBurst(width: number, height: number, colors: string[]): Piece[] {
  const pieces: Piece[] = [];
  const scale = Math.min(1, width / 900) * 0.5 + 0.5;
  const shots = [
    { count: 70, delay: 0, power: 1 },
    { count: 35, delay: 14, power: 0.8 },
  ];

  for (const side of [-1, 1]) {
    for (const shot of shots) {
      for (let i = 0; i < shot.count; i++) {
        const angle = (side === -1 ? -60 : -120) * (Math.PI / 180) + random(-0.35, 0.35);
        const speed = random(14, 24) * scale * shot.power * Math.sqrt(height / 800);
        const size = random(7, 12);
        pieces.push({
          x: side === -1 ? random(-10, 10) : width + random(-10, 10),
          y: height + 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          width: size,
          height: size * random(0.4, 0.65),
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: random(0, Math.PI * 2),
          spin: random(-0.15, 0.15),
          flip: random(0, Math.PI * 2),
          flipSpeed: random(0.08, 0.2),
          wobble: random(0, Math.PI * 2),
          wobbleSpeed: random(0.03, 0.08),
          delay: shot.delay + Math.floor(random(0, 6)),
        });
      }
    }
  }
  return pieces;
}

export function Confetti({ colors = DEFAULT_COLORS }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || reduceMotion) return;

    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);

    const pieces = createBurst(width, height, colors);
    let frame = 0;
    let tick = 0;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      let alive = 0;

      for (const piece of pieces) {
        if (tick < piece.delay) {
          alive++;
          continue;
        }
        piece.vx *= DRAG;
        piece.vy = Math.min(piece.vy * DRAG + GRAVITY, TERMINAL_VELOCITY);
        piece.wobble += piece.wobbleSpeed;
        piece.x += piece.vx + Math.sin(piece.wobble) * 0.8;
        piece.y += piece.vy;
        piece.rotation += piece.spin;
        piece.flip += piece.flipSpeed;
        if (piece.y > height + 20) continue;
        alive++;

        const flip = Math.cos(piece.flip);
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.scale(1, flip);
        context.fillStyle = piece.color;
        // O lado de "trás" do papel fica um pouco mais escuro
        context.globalAlpha = flip < 0 ? 0.75 : 1;
        context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        context.restore();
      }

      tick++;
      if (alive > 0) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [colors, reduceMotion]);

  if (reduceMotion) return null;

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-50 w-full h-full" />;
}
