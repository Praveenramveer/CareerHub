import { useEffect } from "react";

/**
 * Global hook to track pointer coordinates on all glass cards.
 * When the cursor hits any glass card or button, it sets CSS variables
 * --cursor-x and --cursor-y relative to that element so the edge glow
 * dynamically follows and illuminates the exact point of cursor impact.
 */
export function useGlassCardGlow() {
  useEffect(() => {
    let rafId: number | null = null;
    let pendingEvent: PointerEvent | null = null;

    const updateGlow = () => {
      if (!pendingEvent) return;
      const e = pendingEvent;
      pendingEvent = null;

      // Find closest glass card or interactive container
      const target = (e.target as HTMLElement | null)?.closest?.(
        ".glass-card, .neu-flat, .glass-panel, .glass-btn, .neu-btn, .glass-card-sm, .neu-flat-sm"
      ) as HTMLElement | null;

      if (target) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        target.style.setProperty("--cursor-x", `${x}px`);
        target.style.setProperty("--cursor-y", `${y}px`);
        target.setAttribute("data-cursor-hit", "true");
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      pendingEvent = e;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateGlow();
          rafId = null;
        });
      }
    };

    const handlePointerLeave = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        ".glass-card, .neu-flat, .glass-panel, .glass-btn, .neu-btn, .glass-card-sm, .neu-flat-sm"
      ) as HTMLElement | null;

      if (target) {
        target.removeAttribute("data-cursor-hit");
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);
}
