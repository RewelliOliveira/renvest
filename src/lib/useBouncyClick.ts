import { useEffect } from "react";

const CLICKABLE = 'button, a[href], [role="button"], [role="tab"], summary, label:has(input)';
const SKIP = ':disabled, [aria-disabled="true"], .press-3d, [data-no-bounce]';
const PRESS_MS = 90;
const RELEASE_MS = 360;

function pressedScale(el: HTMLElement) {
  const size = Math.max(el.offsetWidth, el.offsetHeight, 1);
  return 1 - Math.min(0.06, 10 / size);
}

export function useBouncyClick() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pressed: { el: HTMLElement; scale: number; animation: Animation } | null = null;

    function release() {
      if (!pressed) return;
      const { el, scale, animation } = pressed;
      pressed = null;
      const overshoot = 1 + (1 - scale) / 3;
      el.animate(
        [
          { transform: `scale(${scale})` },
          { transform: `scale(${overshoot})`, offset: 0.45 },
          { transform: "scale(1)" },
        ],
        { duration: RELEASE_MS, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
      animation.cancel();
    }

    function press(event: PointerEvent) {
      if (event.button !== 0 || !(event.target instanceof Element)) return;
      const el = event.target.closest<HTMLElement>(CLICKABLE);
      if (!el || el.matches(SKIP)) return;

      release();
      const scale = pressedScale(el);
      const animation = el.animate(
        [{ transform: "scale(1)" }, { transform: `scale(${scale})` }],
        { duration: PRESS_MS, easing: "ease-out", fill: "forwards" }
      );
      pressed = { el, scale, animation };
    }

    document.addEventListener("pointerdown", press, true);
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", release, true);
    return () => {
      document.removeEventListener("pointerdown", press, true);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
    };
  }, []);
}
