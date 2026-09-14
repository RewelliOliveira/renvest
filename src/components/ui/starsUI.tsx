import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface StarBurstProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  backgroundColor?: string;
  transparent?: boolean;
  /**
   * Limite de altura (em %) onde as estrelas aparecem de cima para baixo.
   * 42 = cobre os primeiros 42% do topo da tela (um pouco menos da metade).
   * @default 42
   */
  maxHeightPercent?: number;
  /**
   * Ativar ou desativar as estrelas cadentes ocasionais (CadentStars.svg).
   * @default true
   */
  enableShootingStars?: boolean;
  /**
   * Tempo mínimo (em segundos) entre uma estrela cadente e outra.
   * @default 1.2
   */
  minInterval?: number;
  /**
   * Tempo máximo (em segundos) entre uma estrela cadente e outra.
   * @default 3.0
   */
  maxInterval?: number;
  /**
   * Escala de tamanho das estrelas cadentes.
   * @default 1.0
   */
  shootingStarScale?: number;
  /**
   * Multiplicador de velocidade das estrelas cadentes.
   * @default 1.0
   */
  shootingStarSpeed?: number;
  /**
   * Ativar ou desativar as estrelas estáticas (StarPoint e StarNormal) no fundo.
   * @default true
   */
  showStaticStars?: boolean;
  /**
   * Quantidade de pontos de estrelas estáticos (StarPoint) espalhados no topo.
   * @default 65
   */
  staticPointCount?: number;
  /**
   * Quantidade de estrelas normais de 4 pontas estáticas (StarNormal) espalhadas no topo.
   * @default 16
   */
  staticNormalCount?: number;

  // Propriedades mantidas para retrocompatibilidade
  speed?: number;
  starCount?: number;
  centerX?: number;
  centerY?: number;
  angle?: number;
  spread?: number;
  travelDistance?: number;
  starSize?: number;
  opacity?: number;
  flowerIntensity?: number;
  twinkleSpeed?: number;
}

function parseColor(input: string): [number, number, number] {
  if (!input) return [255, 255, 255];
  const s = input.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }
  return [255, 255, 255];
}

// Caminho vetorial exato do StarNormal.svg (estrela de 4 pontas ~12x8px)
const STAR_NORMAL_PATH =
  "M7.67767 3.44932L11.1669 6.43286L6.64758 5.57233L3.76243 7.50565L3.48915 4.05627L-3.61092e-05 1.0727L4.51924 1.93326L7.40417 -1.04238e-05L7.67767 3.44932Z";

// SVG exato do CadentStars.svg ampliado 5x (75x25) para máxima nitidez
const CADENT_STAR_SVG = `<svg width="75" height="25" viewBox="0 0 15 5" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.382542 3.55923C0.1386 3.62619 -0.0184647 3.79414 0.00175764 4.04026C0.0247325 4.32008 0.307377 4.63586 0.687262 4.80788C1.12573 5.00641 1.55355 4.98122 1.77331 4.79658L1.77461 4.79771L14.6919 0.373131C14.807 0.333705 14.8147 0.214123 14.7088 0.112576C14.6181 0.0256809 14.4733 -0.0190057 14.3685 0.00760037L0.382542 3.55923Z" fill="url(#cadentGrad)" />
  <defs>
    <linearGradient id="cadentGrad" x1="-0.685971" y1="2.82787" x2="12.5005"
      y2="-4.11476" gradientUnits="userSpaceOnUse">
      <stop offset="0.001422" stop-color="white" />
      <stop offset="0.996715" stop-color="white" stop-opacity="0" />
    </linearGradient>
  </defs>
</svg>`;

// Ângulo natural do vetor cauda->cabeça no SVG original (~163.5 graus)
const CADENT_NATURAL_ANGLE_RAD = 2.8532;

interface StaticStarPoint {
  relX: number;
  relY: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
}

interface StaticStarNormal {
  relX: number;
  relY: number;
  scale: number;
  rotation: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
}

interface ActiveShootingStar {
  startX: number;
  startY: number;
  angle: number;
  distance: number;
  duration: number;
  elapsed: number;
  scale: number;
  maxOpacity: number;
}

export function StarBurst({
  color = "#FFFFFF",
  backgroundColor = "#000000",
  transparent = false,
  maxHeightPercent = 42,
  enableShootingStars = true,
  minInterval = 1.2,
  maxInterval = 3.0,
  shootingStarScale = 1.0,
  shootingStarSpeed = 1.0,
  showStaticStars = true,
  staticPointCount = 65,
  staticNormalCount = 16,
  className,
  children,
  style,
  ...props
}: StarBurstProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cStar = parseColor(color);

    // Fração da altura máxima (ex: 42% = 0.42)
    const maxHeightRatio = Math.max(
      0.15,
      Math.min(1.0, (maxHeightPercent ?? 42) / 100),
    );

    const makeRng = (seed: number) => {
      let s = seed >>> 0;
      return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };

    // ==========================================
    // 1. Estrelas Estáticas de Fundo (Apenas no topo até maxHeightRatio)
    // ==========================================
    const staticRng = makeRng(0xcafe123);
    const staticPoints: StaticStarPoint[] = [];
    if (showStaticStars) {
      for (let i = 0; i < staticPointCount; i++) {
        staticPoints.push({
          relX: 0.02 + staticRng() * 0.96,
          // Restrito à faixa do topo até maxHeightRatio
          relY: 0.01 + staticRng() * (maxHeightRatio - 0.03),
          radius: 0.4 + staticRng() * 1.0, // Tamanho delicado para mobile
          baseOpacity: 0.15 + staticRng() * 0.65,
          twinkleSpeed: 0.7 + staticRng() * 2.0,
          phase: staticRng() * Math.PI * 2,
        });
      }
    }

    const staticNormals: StaticStarNormal[] = [];
    if (showStaticStars) {
      for (let i = 0; i < staticNormalCount; i++) {
        staticNormals.push({
          relX: 0.03 + staticRng() * 0.94,
          // Restrito à faixa do topo até maxHeightRatio
          relY: 0.02 + staticRng() * (maxHeightRatio - 0.04),
          scale: 0.35 + staticRng() * 0.65, // Proporção mais compacta e nítida
          rotation: (staticRng() - 0.5) * 0.6,
          baseOpacity: 0.2 + staticRng() * 0.65,
          twinkleSpeed: 0.8 + staticRng() * 2.2,
          phase: staticRng() * Math.PI * 2,
        });
      }
    }

    const starNormalPath =
      typeof Path2D !== "undefined" ? new Path2D(STAR_NORMAL_PATH) : null;

    // ==========================================
    // 2. Imagem do CadentStars.svg
    // ==========================================
    const cadentImg = new Image();
    cadentImg.src = `data:image/svg+xml;utf8,${encodeURIComponent(CADENT_STAR_SVG)}`;

    // ==========================================
    // 3. Sistema de Estrelas Cadentes (Alta Frequência & First Mobile)
    // ==========================================
    const shootingStars: ActiveShootingStar[] = [];
    let timeUntilNextSpawn = 0.6; // Primeira estrela cadente surge logo no início (0.6s)
    let timeSinceLastSpawn = 0;

    const spawnShootingStar = (w: number, h: number) => {
      const isMobile = w < 640;
      const topLimitY = maxHeightRatio * h;

      // Ponto de início: nasce na parte superior (entre 2% e metade da zona permitida)
      const startX = w * (0.15 + Math.random() * 0.8);
      const startY = h * (0.02 + Math.random() * (maxHeightRatio * 0.45));

      // Ângulo de queda: ~150° a ~175° (descendo suavemente para a esquerda)
      const angleDeg = 152 + (Math.random() - 0.5) * 24;
      const angle = (angleDeg * Math.PI) / 180;

      // Proporção de distância adaptada para telas mobile
      const baseDistance = isMobile
        ? Math.min(w * 0.36, 140)
        : Math.min(w * 0.28, 260);

      const wantedDistance =
        (baseDistance * 0.8 + Math.random() * (baseDistance * 0.4)) *
        (shootingStarScale ?? 1);

      // Limita a distância para que a estrela nunca ultrapasse a linha do maxHeightPercent
      const remainingY = topLimitY * 0.96 - startY;
      const maxAllowedDist = Math.max(
        60,
        remainingY / Math.max(0.1, Math.sin(angle)),
      );
      const distance = Math.min(wantedDistance, maxAllowedDist);

      // Duração rápida e fluida (0.55s a 0.85s no mobile)
      const baseDuration = (isMobile ? 0.55 : 0.65) + Math.random() * 0.3;
      const duration = baseDuration / Math.max(0.1, shootingStarSpeed ?? 1);

      // Escala visual ajustada para mobile first
      const mobileScaleFactor = isMobile ? 0.65 : 0.95;
      const scale =
        (0.75 + Math.random() * 0.45) *
        mobileScaleFactor *
        (shootingStarScale ?? 1);

      const maxOpacity = 0.7 + Math.random() * 0.3;

      shootingStars.push({
        startX,
        startY,
        angle,
        distance,
        duration,
        elapsed: 0,
        scale,
        maxOpacity,
      });
    };

    const resize = (entry?: ResizeObserverEntry) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cr = entry?.contentRect;
      const rectW =
        cr?.width ||
        container.clientWidth ||
        container.getBoundingClientRect().width;
      const rectH =
        cr?.height ||
        container.clientHeight ||
        container.getBoundingClientRect().height;
      const w = Math.max(1, Math.floor(rectW) || 400);
      const h = Math.max(1, Math.floor(rectH) || 800);
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver((entries) => resize(entries[0]));
    ro.observe(container);

    let timeSec = 0;

    const drawFrame = (deltaSec: number) => {
      const { w, h, dpr } = sizeRef.current;
      const dt = Math.max(0.001, Math.min(0.05, deltaSec));
      timeSec += dt;

      if (w < 2 || h < 2) return;

      const topLimitY = maxHeightRatio * h;

      // Fundo escuro total
      if (transparent) {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      // ==========================================
      // A. Desenho das Estrelas Estáticas no Topo
      // ==========================================
      if (showStaticStars) {
        ctx.globalCompositeOperation = "source-over";

        // 1. StarPoint (pontos sutis com fade-out gradual na borda inferior)
        for (let i = 0; i < staticPoints.length; i++) {
          const pt = staticPoints[i];
          const px = pt.relX * w;
          const py = pt.relY * h;

          // Fade suave conforme se aproxima do limite inferior (maxHeightRatio)
          const yProgress = py / topLimitY;
          const edgeFade =
            yProgress > 0.8 ? Math.max(0, (1 - yProgress) / 0.2) : 1.0;

          const twinkle =
            0.8 + 0.2 * Math.sin(timeSec * pt.twinkleSpeed + pt.phase);
          const a = Math.min(
            1,
            Math.max(0, pt.baseOpacity * twinkle * edgeFade),
          );
          if (a <= 0.01) continue;

          ctx.beginPath();
          ctx.arc(px, py, pt.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a})`;
          ctx.fill();
        }

        // 2. StarNormal (estrelas de 4 pontas com fade na borda inferior)
        if (starNormalPath) {
          for (let i = 0; i < staticNormals.length; i++) {
            const sn = staticNormals[i];
            const px = sn.relX * w;
            const py = sn.relY * h;

            const yProgress = py / topLimitY;
            const edgeFade =
              yProgress > 0.8 ? Math.max(0, (1 - yProgress) / 0.2) : 1.0;

            const twinkle =
              0.75 + 0.25 * Math.sin(timeSec * sn.twinkleSpeed + sn.phase);
            const a = Math.min(
              1,
              Math.max(0, sn.baseOpacity * twinkle * edgeFade),
            );
            if (a <= 0.01) continue;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(sn.rotation);
            ctx.scale(sn.scale, sn.scale);
            ctx.translate(-5.58, -3.75);
            ctx.fillStyle = `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a})`;
            ctx.fill(starNormalPath);
            ctx.restore();
          }
        }
      }

      // ==========================================
      // B. Animação das Estrelas Cadentes (CadentStars.svg)
      // ==========================================
      if (enableShootingStars) {
        timeSinceLastSpawn += dt;

        if (timeSinceLastSpawn >= timeUntilNextSpawn) {
          timeSinceLastSpawn = 0;
          const safeMin = Math.max(0.4, minInterval);
          const safeMax = Math.max(safeMin, maxInterval);
          // Frequência dinâmica aumentada
          timeUntilNextSpawn = safeMin + Math.random() * (safeMax - safeMin);

          // Permite até 2 estrelas cadentes simultâneas
          if (shootingStars.length < 2) {
            spawnShootingStar(w, h);
          }
        }

        ctx.globalCompositeOperation = "lighter";

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const star = shootingStars[i];
          star.elapsed += dt;

          const progress = star.elapsed / star.duration;

          if (progress >= 1.0) {
            shootingStars.splice(i, 1);
            continue;
          }

          // Entrada rápida (15%) e saída suave (40%)
          let fade: number;
          if (progress < 0.15) {
            fade = progress / 0.15;
          } else if (progress < 0.6) {
            fade = 1.0;
          } else {
            fade = (1.0 - progress) / 0.4;
          }

          const alpha = Math.min(1, Math.max(0, fade * star.maxOpacity));
          if (alpha <= 0.01) continue;

          const currentDist = progress * star.distance;
          const px = star.startX + Math.cos(star.angle) * currentDist;
          const py = star.startY + Math.sin(star.angle) * currentDist;

          // Se passar do limite superior por segurança, encerra
          if (py > topLimitY) {
            shootingStars.splice(i, 1);
            continue;
          }

          // Desenho do rastro vetorizado com SVG
          if (cadentImg.complete) {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(star.angle - CADENT_NATURAL_ANGLE_RAD);
            ctx.scale(star.scale, star.scale);
            ctx.translate(-4.4, -21.5);
            ctx.globalAlpha = alpha;
            ctx.drawImage(cadentImg, 0, 0, 75, 25);
            ctx.restore();
          }

          // Ponto de luz na ponta da estrela cadente
          const flareRadius = 3.5 * star.scale;
          const flare = ctx.createRadialGradient(
            px,
            py,
            0,
            px,
            py,
            flareRadius,
          );
          flare.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          flare.addColorStop(
            0.4,
            `rgba(${cStar[0]}, ${cStar[1]}, ${cStar[2]}, ${alpha * 0.6})`,
          );
          flare.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = flare;
          ctx.beginPath();
          ctx.arc(px, py, flareRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalAlpha = 1;
      }
    };

    let lastT = performance.now();
    const loop = (t: number) => {
      const deltaSec = (t - lastT) / 1000;
      lastT = t;
      drawFrame(deltaSec);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [
    color,
    backgroundColor,
    transparent,
    maxHeightPercent,
    enableShootingStars,
    minInterval,
    maxInterval,
    shootingStarScale,
    shootingStarSpeed,
    showStaticStars,
    staticPointCount,
    staticNormalCount,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden",
        !transparent && "bg-black",
        className,
      )}
      style={{
        ...(!transparent ? { backgroundColor } : {}),
        ...style,
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}

export default StarBurst;
