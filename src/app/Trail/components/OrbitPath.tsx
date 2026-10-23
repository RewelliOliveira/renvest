import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { TrailNodeItem } from "../types/types";

interface Point {
  x: number;
  y: number;
}

interface OrbitPathProps {
  nodes: TrailNodeItem[];
}

// Rota pontilhada entre os corpos de um módulo, medida a partir do DOM
export function OrbitPath({ nodes }: OrbitPathProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>([]);

  useLayoutEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const measure = () => {
      const box = container.getBoundingClientRect();
      setPoints(
        nodes.flatMap((node) => {
          const rect = container
            .querySelector(`[data-node-key="${node.key}"]`)
            ?.getBoundingClientRect();
          return rect
            ? [{ x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top }]
            : [];
        }),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [nodes]);

  return (
    <svg ref={svgRef} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden>
      {points.slice(1).map((to, index) => {
        const from = points[index];
        const target = nodes[index + 1];
        const midY = (from.y + to.y) / 2;
        const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
        const isLocked = target.status === "locked";
        const isCurrent = target.status === "current";

        return (
          <motion.path
            key={target.key}
            d={d}
            fill="none"
            stroke={isLocked ? "rgba(255, 255, 255, 0.15)" : target.module.color}
            strokeOpacity={isLocked ? 1 : 0.75}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="1 12"
            animate={isCurrent ? { strokeDashoffset: [0, -26] } : undefined}
            transition={isCurrent ? { repeat: Infinity, duration: 1, ease: "linear" } : undefined}
          />
        );
      })}
    </svg>
  );
}
