import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const COLORS = ["#f05656", "#fbbf24", "#38bdf8", "#34d399", "#a78bfa", "#ffffff"];
const PIECE_COUNT = 36;

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  drift: number;
  color: string;
  size: number;
}

function createPieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.6,
    rotate: (Math.random() - 0.5) * 720,
    drift: (Math.random() - 0.5) * 120,
    color: COLORS[id % COLORS.length],
    size: 6 + Math.random() * 6,
  }));
}

export function Confetti() {
  const [pieces] = useState(createPieces);
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", x: piece.drift, rotate: piece.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: "easeIn" }}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.45,
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}
