import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "cn";

const LOCKED_COLOR = "#525252";

const ASTEROID_SHAPES = [
  "46% 54% 42% 58% / 55% 44% 56% 45%",
  "58% 42% 55% 45% / 47% 58% 42% 53%",
  "42% 58% 60% 40% / 52% 46% 54% 48%",
  "54% 46% 44% 56% / 42% 55% 45% 58%",
];
const ASTEROID_ROTATIONS = [-12, 18, 6, -24];

const CRATERS = [
  [
    { top: "16%", left: "58%", size: "20%" },
    { top: "62%", left: "20%", size: "15%" },
    { top: "66%", left: "66%", size: "10%" },
  ],
  [
    { top: "22%", left: "18%", size: "16%" },
    { top: "58%", left: "60%", size: "20%" },
    { top: "14%", left: "64%", size: "9%" },
  ],
  [
    { top: "64%", left: "38%", size: "18%" },
    { top: "20%", left: "24%", size: "11%" },
    { top: "30%", left: "68%", size: "14%" },
  ],
];

function surface(color: string): string {
  return `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 55%, white) 0%, ${color} 45%, color-mix(in srgb, ${color} 45%, black) 100%)`;
}

function glow(color: string, isLocked: boolean): string {
  const shade = "inset -8px -10px 0 rgba(0, 0, 0, 0.2)";
  return isLocked ? shade : `${shade}, 0 0 28px color-mix(in srgb, ${color} 50%, transparent)`;
}

interface CelestialBodyProps {
  color: string;
  isLocked: boolean;
  children: ReactNode;
}

interface AsteroidProps extends CelestialBodyProps {
  variant: number;
}

export function Asteroid({ color, isLocked, variant, children }: AsteroidProps) {
  const base = isLocked ? LOCKED_COLOR : color;

  return (
    <>
      <span
        className="absolute inset-0"
        style={{
          borderRadius: ASTEROID_SHAPES[variant % ASTEROID_SHAPES.length],
          rotate: `${ASTEROID_ROTATIONS[variant % ASTEROID_ROTATIONS.length]}deg`,
          background: surface(base),
          boxShadow: glow(base, isLocked),
        }}
      >
        {CRATERS[variant % CRATERS.length].map((crater) => (
          <span
            key={`${crater.top}-${crater.left}`}
            className="absolute rounded-full"
            style={{
              top: crater.top,
              left: crater.left,
              width: crater.size,
              height: crater.size,
              backgroundColor: `color-mix(in srgb, ${base} 70%, black)`,
              boxShadow: "inset 2px 2px 0 rgba(0, 0, 0, 0.3), 1px 1px 0 rgba(255, 255, 255, 0.15)",
            }}
          />
        ))}
      </span>
      <span className={cn("relative flex drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]", isLocked && "text-neutral-400")}>
        {children}
      </span>
    </>
  );
}

interface PlanetProps extends CelestialBodyProps {
  variant: number;
}

const RING_CLASS =
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] pointer-events-none";

function crater(base: string, top: string, left: string, size: string): CSSProperties {
  return {
    top,
    left,
    width: size,
    height: size,
    backgroundColor: `color-mix(in srgb, ${base} 70%, black)`,
    boxShadow: "inset 2px 2px 0 rgba(0, 0, 0, 0.3), 1px 1px 0 rgba(255, 255, 255, 0.12)",
  };
}

// Anel com metade de trás e metade da frente, para "abraçar" o planeta
function Ring({ color, className, isLocked, front }: { color: string; className: string; isLocked: boolean; front?: boolean }) {
  return (
    <span
      className={cn(RING_CLASS, className, isLocked && "opacity-50")}
      style={{ borderColor: color, clipPath: front ? "inset(50% 0 0 0)" : undefined }}
    />
  );
}

// Cada módulo ganha um planeta com personalidade própria
export function Planet({ color, isLocked, variant, children }: PlanetProps) {
  const base = isLocked ? LOCKED_COLOR : color;
  const light = `color-mix(in srgb, ${base} 55%, white)`;
  const dark = `color-mix(in srgb, ${base} 60%, black)`;
  const kind = PLANET_ORDER[(variant - 1 + PLANET_ORDER.length) % PLANET_ORDER.length];

  const body = (surfaceDetails: ReactNode, extraShadow = "") => (
    <span
      className="absolute inset-0 rounded-full overflow-hidden"
      style={{ background: surface(base), boxShadow: `${glow(base, isLocked)}${extraShadow}` }}
    >
      {surfaceDetails}
    </span>
  );

  const icon = (
    <span className={cn("relative flex drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]", isLocked && "text-neutral-400")}>
      {children}
    </span>
  );

  // 1. Gigante com anel
  if (kind === 0) {
    const ring = "w-[165%] h-[40%] -rotate-18 border-[5px] lg:border-[6px]";
    return (
      <>
        <Ring color={light} className={ring} isLocked={isLocked} />
        {body(
          <>
            <span className="absolute -left-[10%] top-[26%] w-[120%] h-[12%] -rotate-12 bg-black/15" />
            <span className="absolute -left-[10%] top-[52%] w-[120%] h-[8%] -rotate-12 bg-white/15" />
            <span className="absolute -left-[10%] top-[68%] w-[120%] h-[10%] -rotate-12 bg-black/10" />
            <span className="absolute rounded-full" style={crater(base, "14%", "56%", "16%")} />
          </>,
        )}
        <Ring color={light} className={ring} isLocked={isLocked} front />
        {icon}
      </>
    );
  }

  // 2. Rochoso com lua em órbita
  if (kind === 1) {
    return (
      <>
        <span className="absolute -inset-[22%] rounded-full border-2 border-dashed border-white/15 pointer-events-none" />
        {body(
          <>
            <span className="absolute rounded-full" style={crater(base, "12%", "20%", "22%")} />
            <span className="absolute rounded-full" style={crater(base, "58%", "62%", "26%")} />
            <span className="absolute rounded-full" style={crater(base, "66%", "18%", "12%")} />
            <span className="absolute rounded-full" style={crater(base, "18%", "66%", "10%")} />
            <span className="absolute rounded-full" style={crater(base, "42%", "40%", "8%")} />
          </>,
        )}
        <motion.span
          className="absolute -inset-[22%] pointer-events-none"
          animate={isLocked ? undefined : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          <span
            className="absolute left-1/2 -top-[6%] w-[18%] h-[18%] -translate-x-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, #f5f5f5, #a3a3a3 60%, #525252)",
              boxShadow: "inset -2px -3px 0 rgba(0, 0, 0, 0.25)",
            }}
          />
        </motion.span>
        {icon}
      </>
    );
  }

  // 3. Habitável: continentes, nuvens e atmosfera
  if (kind === 2) {
    return (
      <>
        <span
          className="absolute -inset-[8%] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, transparent 58%, color-mix(in srgb, ${light} 45%, transparent) 64%, transparent 74%)` }}
        />
        {body(
          <>
            <span
              className="absolute top-[12%] left-[8%] w-[46%] h-[34%] -rotate-12"
              style={{ backgroundColor: dark, borderRadius: "58% 42% 55% 45% / 47% 58% 42% 53%" }}
            />
            <span
              className="absolute top-[52%] left-[48%] w-[44%] h-[36%] rotate-12"
              style={{ backgroundColor: dark, borderRadius: "42% 58% 60% 40% / 52% 46% 54% 48%" }}
            />
            <span
              className="absolute top-[62%] left-[14%] w-[20%] h-[14%]"
              style={{ backgroundColor: dark, borderRadius: "46% 54% 42% 58% / 55% 44% 56% 45%" }}
            />
            <span className="absolute top-[34%] -left-[5%] w-[60%] h-[7%] rounded-full bg-white/35" />
            <span className="absolute top-[46%] left-[50%] w-[50%] h-[6%] rounded-full bg-white/30" />
            <span className="absolute top-[78%] left-[20%] w-[40%] h-[5%] rounded-full bg-white/25" />
          </>,
        )}
        {icon}
      </>
    );
  }

  // 4. Gasoso com faixas e tempestade
  if (kind === 3) {
    return (
      <>
        {body(
          <>
            {[10, 24, 40, 58, 74, 86].map((top, index) => (
              <span
                key={top}
                className={cn("absolute -left-[5%] w-[110%]", index % 2 ? "bg-white/15 h-[7%]" : "bg-black/15 h-[10%]")}
                style={{ top: `${top}%`, rotate: "-6deg" }}
              />
            ))}
            <span
              className="absolute top-[54%] left-[54%] w-[28%] h-[16%] rounded-[50%]"
              style={{ backgroundColor: dark, boxShadow: `inset 0 0 0 3px ${light}`, rotate: "-6deg" }}
            />
          </>,
        )}
        {icon}
      </>
    );
  }

  // 5. Gelado com anéis duplos cruzados
  const ringA = "w-[150%] h-[34%] rotate-24 border-[3px] lg:border-4";
  const ringB = "w-[175%] h-[30%] -rotate-12 border-2 lg:border-[3px]";
  return (
    <>
      <Ring color={light} className={ringA} isLocked={isLocked} />
      <Ring color={`color-mix(in srgb, ${light} 60%, transparent)`} className={ringB} isLocked={isLocked} />
      {body(
        <>
          <span className="absolute top-0 left-[15%] w-[70%] h-[22%] rounded-[50%] bg-white/45" />
          <span className="absolute bottom-0 left-[22%] w-[56%] h-[16%] rounded-[50%] bg-white/30" />
          <span className="absolute top-[38%] left-[10%] w-[50%] h-[3%] -rotate-20 bg-white/30" />
          <span className="absolute top-[56%] left-[40%] w-[45%] h-[3%] rotate-12 bg-white/25" />
        </>,
      )}
      <Ring color={light} className={ringA} isLocked={isLocked} front />
      <Ring color={`color-mix(in srgb, ${light} 60%, transparent)`} className={ringB} isLocked={isLocked} front />
      {icon}
    </>
  );
}

// Módulo 1: anel, 2: habitável, 3: gelado; depois rochoso e gasoso
const PLANET_ORDER = [0, 2, 4, 1, 3];
