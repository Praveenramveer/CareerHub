import React, { useEffect, useRef, useState, useCallback } from "react";
import { Droplets, RefreshCw, Waves, Sliders, ChevronDown, ChevronUp } from "lucide-react";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

export type ClothPreset = "liquidSilk" | "tranquil" | "elastic";
export type PointerScale = "fine" | "compact" | "medium";

export const POINTER_SCALES: Record<PointerScale, { label: string; multiplier: number; pixelDesc: string }> = {
  fine: { label: "Fine", multiplier: 0.72, pixelDesc: "~45px precision" },
  compact: { label: "Compact", multiplier: 1.0, pixelDesc: "~65px refined" },
  medium: { label: "Medium", multiplier: 1.35, pixelDesc: "~90px soft" },
};

interface PresetConfig {
  name: string;
  description: string;
  homeSpring: number; // Restoring force to rest lattice
  damping: number; // Kinetic damping (prevents sticking and overshooting)
  neighborTension: number; // Shear coupling between adjacent dots
  neighborZ: number; // Z-axis wave curvature coupling
  depth: number; // 3D depth bending indentation
  pushForce: number; // Radial displacement away from cursor
  dragFactor: number; // Wake velocity dragging dots smoothly along stroke
  interactionRadius: number; // Meniscus influence radius
}

const CLOTH_PRESETS: Record<ClothPreset, PresetConfig> = {
  liquidSilk: {
    name: "Liquid Silk",
    description: "Ultra-fluid silk membrane with continuous smooth bending and zero stickiness",
    homeSpring: 0.052,
    damping: 0.135,
    neighborTension: 0.085,
    neighborZ: 0.115,
    depth: 44,
    pushForce: 1.75,
    dragFactor: 0.36,
    interactionRadius: 65,
  },
  tranquil: {
    name: "Tranquil Pool",
    description: "Glassy calm layer with delicate, immediate tactile bending and swift recovery",
    homeSpring: 0.075,
    damping: 0.165,
    neighborTension: 0.060,
    neighborZ: 0.085,
    depth: 34,
    pushForce: 1.35,
    dragFactor: 0.24,
    interactionRadius: 58,
  },
  elastic: {
    name: "Elastic Surface",
    description: "Energetic elastic surface with crisp recoil and smooth radial contour",
    homeSpring: 0.092,
    damping: 0.185,
    neighborTension: 0.105,
    neighborZ: 0.140,
    depth: 52,
    pushForce: 2.15,
    dragFactor: 0.44,
    interactionRadius: 72,
  },
};

interface ClothMouldingBackgroundProps {
  theme: "dark" | "light";
  className?: string;
  showControls?: boolean;
}

interface ClothNode {
  x: number;
  y: number;
  z: number;
  ox: number; // Rest X
  oy: number; // Rest Y
  vx: number;
  vy: number;
  vz: number;
  col: number;
  row: number;
  isPinned: boolean;
}

interface RippleWave {
  x: number;
  y: number;
  startTime: number;
  speed: number;
  maxRadius: number;
  strength: number;
}

export const ClothMouldingBackground: React.FC<ClothMouldingBackgroundProps> = ({
  theme,
  className = "",
  showControls = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDark = theme === "dark";

  const [activePreset, setActivePreset] = useState<ClothPreset>("liquidSilk");
  const [pointerScale, setPointerScale] = useState<PointerScale>("fine");
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  const triggerRippleRef = useRef<((x?: number, y?: number) => void) | null>(null);
  const resetClothRef = useRef<(() => void) | null>(null);
  const presetRef = useRef<ClothPreset>(activePreset);
  const pointerScaleRef = useRef<PointerScale>(pointerScale);

  useEffect(() => {
    presetRef.current = activePreset;
  }, [activePreset]);

  useEffect(() => {
    pointerScaleRef.current = pointerScale;
  }, [pointerScale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let cols = 0;
    let rows = 0;
    let spacing = 32;

    let grid: ClothNode[][] = [];
    const allNodes: ClothNode[] = [];
    const dynamicNodes: ClothNode[] = [];
    const ripples: RippleWave[] = [];

    // Pointer state with smooth exponential tracking (no lag, no sticking)
    const mouse = {
      targetX: -1000,
      targetY: -1000,
      isHovered: false,
      isDown: false,
    };

    const pointer = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
    };

    // Build the cloth membrane lattice
    const buildClothSimulation = () => {
      allNodes.length = 0;
      dynamicNodes.length = 0;
      grid = [];

      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Adaptive spacing for optimal density
      spacing = Math.max(26, Math.min(36, Math.round(width / 36)));

      const margin = spacing * 1.5;
      cols = Math.ceil((width + margin * 2) / spacing) + 1;
      rows = Math.ceil((height + margin * 2) / spacing) + 1;

      const startX = -margin;
      const startY = -margin;

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const ox = startX + c * spacing;
          const oy = startY + r * spacing;
          const isPinned = c === 0 || c === cols - 1 || r === 0 || r === rows - 1;

          const node: ClothNode = {
            x: ox,
            y: oy,
            z: 0,
            ox,
            oy,
            vx: 0,
            vy: 0,
            vz: 0,
            col: c,
            row: r,
            isPinned,
          };

          grid[r][c] = node;
          allNodes.push(node);
          if (!isPinned) {
            dynamicNodes.push(node);
          }
        }
      }

      setParticleCount(dynamicNodes.length);
    };

    buildClothSimulation();

    // Trigger acoustic ripple pulse
    const triggerRipple = (targetX?: number, targetY?: number) => {
      const rx = targetX ?? width * 0.5;
      const ry = targetY ?? height * 0.5;
      ripples.push({
        x: rx,
        y: ry,
        startTime: performance.now(),
        speed: 320,
        maxRadius: Math.max(width, height) * 0.85,
        strength: 0.0075,
      });

      // Direct smooth dip at impulse point
      const radius = 75;
      for (let i = 0; i < dynamicNodes.length; i++) {
        const node = dynamicNodes[i];
        const dx = node.x - rx;
        const dy = node.y - ry;
        const distSq = dx * dx + dy * dy;
        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          const t = 1 - dist / radius;
          const factor = t * t * (3 - 2 * t);
          node.vz -= factor * 16;
        }
      }
    };
    triggerRippleRef.current = triggerRipple;

    // Reset cloth back to rest grid
    const resetCloth = () => {
      for (let i = 0; i < dynamicNodes.length; i++) {
        const n = dynamicNodes[i];
        n.x = n.ox;
        n.y = n.oy;
        n.z = 0;
        n.vx = 0;
        n.vy = 0;
        n.vz = 0;
      }
      ripples.length = 0;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      pointer.x = -1000;
      pointer.y = -1000;
      pointer.vx = 0;
      pointer.vy = 0;
    };
    resetClothRef.current = resetCloth;

    // Pointer events
    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      mouse.isDown = true;
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        triggerRipple(clickX, clickY);
      }
    };

    const handlePointerUp = () => {
      mouse.isDown = false;
    };

    const handlePointerLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isDown = false;
      pointer.x = -1000;
      pointer.y = -1000;
      pointer.vx = 0;
      pointer.vy = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      buildClothSimulation();
    });
    resizeObserver.observe(container);

    const FOV = 520; // 3D perspective field of view

    // 60-120fps Smooth Cloth Membrane Loop
    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      const currentConfig = CLOTH_PRESETS[presetRef.current];
      const scaleMultiplier = POINTER_SCALES[pointerScaleRef.current].multiplier;
      const radius = currentConfig.interactionRadius * scaleMultiplier;
      const radiusSq = radius * radius;

      // 1. Smooth, instantaneous pointer tracking without sluggish inertia or sticking
      if (mouse.isHovered && mouse.targetX > -500) {
        if (pointer.x < -500) {
          pointer.x = mouse.targetX;
          pointer.y = mouse.targetY;
          pointer.prevX = mouse.targetX;
          pointer.prevY = mouse.targetY;
          pointer.vx = 0;
          pointer.vy = 0;
        } else {
          pointer.prevX = pointer.x;
          pointer.prevY = pointer.y;
          // Clean exponential smoothing (smooth response without lag)
          pointer.x += (mouse.targetX - pointer.x) * 0.44;
          pointer.y += (mouse.targetY - pointer.y) * 0.44;
          pointer.vx = pointer.x - pointer.prevX;
          pointer.vy = pointer.y - pointer.prevY;
        }
      } else {
        pointer.x = -1000;
        pointer.y = -1000;
        pointer.vx = 0;
        pointer.vy = 0;
      }

      const pSpeed = Math.min(22, Math.hypot(pointer.vx, pointer.vy));
      const hasPointer = pointer.x > -500;

      // 2. Physics Step: Discrete Elastic Membrane Dynamics (Zero sticking, guaranteed convergence)
      const homeK = currentConfig.homeSpring;
      const damp = currentConfig.damping;
      const nTension = currentConfig.neighborTension;
      const nZ = currentConfig.neighborZ;
      const push = currentConfig.pushForce * (mouse.isDown ? 1.7 : 1.0);
      const drag = currentConfig.dragFactor * (mouse.isDown ? 1.4 : 1.0);
      const bendDepth = currentConfig.depth * (mouse.isDown ? 1.5 : 1.0);

      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          const node = grid[r][c];
          if (node.isPinned) continue;

          // A. Neighbor cloth curvature coupling (elastic shear & bending)
          const left = grid[r][c - 1];
          const right = grid[r][c + 1];
          const top = grid[r - 1][c];
          const bottom = grid[r + 1][c];

          const lapX = (left.x - left.ox + right.x - right.ox + top.x - top.ox + bottom.x - bottom.ox) * 0.25 - (node.x - node.ox);
          const lapY = (left.y - left.oy + right.y - right.oy + top.y - top.oy + bottom.y - bottom.oy) * 0.25 - (node.y - node.oy);
          const lapZ = (left.z + right.z + top.z + bottom.z) * 0.25 - node.z;

          // B. Home anchor spring + damping
          let fx = -homeK * (node.x - node.ox) - damp * node.vx + lapX * nTension;
          let fy = -homeK * (node.y - node.oy) - damp * node.vy + lapY * nTension;
          let fz = -homeK * 1.1 * node.z - damp * 1.1 * node.vz + lapZ * nZ;

          // C. Active Pointer Deformation (Smooth C2-continuous falloff)
          if (hasPointer) {
            const dx = node.x - pointer.x;
            const dy = node.y - pointer.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < radiusSq) {
              const dist = Math.max(1, Math.sqrt(distSq));
              const t = 1 - dist / radius;
              // Smooth quintic Hermite polynomial for completely seamless entry and exit (never sticks!)
              const smooth = t * t * t * (t * (t * 6 - 15) + 10);

              // Radial moulding displacement
              const normX = dx / dist;
              const normY = dy / dist;
              fx += normX * smooth * push;
              fy += normY * smooth * push;

              // Fluid wake drag
              fx += pointer.vx * smooth * drag * pSpeed;
              fy += pointer.vy * smooth * drag * pSpeed;

              // 3D Depth bending depression
              const targetZ = -bendDepth * smooth;
              fz += (targetZ - node.z) * 0.24;
            }
          }

          // D. Integrate velocity and position
          node.vx += fx;
          node.vy += fy;
          node.vz += fz;

          node.x += node.vx;
          node.y += node.vy;
          node.z += node.vz;
        }
      }

      // 3. Process Shockwave Ripples (clean acoustic pulse without sticking)
      for (let ri = ripples.length - 1; ri >= 0; ri--) {
        const wave = ripples[ri];
        const age = (currentTime - wave.startTime) / 1000;
        const currentRadius = age * wave.speed;

        if (currentRadius > wave.maxRadius) {
          ripples.splice(ri, 1);
          continue;
        }

        const waveWidth = 55;
        for (let i = 0; i < dynamicNodes.length; i++) {
          const node = dynamicNodes[i];
          const dx = node.x - wave.x;
          const dy = node.y - wave.y;
          const dist = Math.hypot(dx, dy);
          const diff = Math.abs(dist - currentRadius);

          if (diff < waveWidth) {
            const envelope = Math.cos((diff / waveWidth) * Math.PI * 0.5) * (1 - currentRadius / wave.maxRadius);
            const impulse = envelope * wave.strength;
            node.vx += (dx / (dist || 1)) * impulse * 14;
            node.vy += (dy / (dist || 1)) * impulse * 14;
            node.vz += Math.sin((diff / waveWidth) * Math.PI * 2) * 4.5 * envelope;
          }
        }
      }

      // 4. Render to Canvas - DOTS ONLY (NO CONNECTING LINES, NO AMBIENT OCEAN SWELL)
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Colors matching Neumorphic Slate Palette with Emerald Green (#059669) accents
      const calmDotColor = isDark ? "rgba(148, 163, 184, 0.38)" : "rgba(71, 85, 105, 0.28)";
      const accentGreen = "#059669";
      const meniscusGlow = isDark ? "rgba(5, 150, 105, 0.22)" : "rgba(5, 150, 105, 0.14)";

      // 3D Perspective Projection (zero ambient idle motion - perfectly calm at rest)
      const project = (x: number, y: number, z: number) => {
        const p = FOV / (FOV - z);
        return {
          px: x * p - (p - 1) * (width * 0.5),
          py: y * p - (p - 1) * (height * 0.5),
          p,
        };
      };

      // 4A. Subtle Precision Pointer Glow & Focal Meniscus Drop
      if (hasPointer) {
        const glowRadius = radius * 0.95;
        const radGrad = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          glowRadius
        );
        radGrad.addColorStop(0, meniscusGlow);
        radGrad.addColorStop(0.5, isDark ? "rgba(15, 23, 42, 0.18)" : "rgba(241, 245, 249, 0.16)");
        radGrad.addColorStop(1, "transparent");

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Delicate liquid meniscus ring
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, Math.max(3.5, radius * 0.26), 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(5, 150, 105, 0.38)" : "rgba(5, 150, 105, 0.28)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Tiny precision pointer focal dot
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = accentGreen;
        ctx.fill();
      }

      // 4B. Render Individual Unconnected Dots with Smooth Bending Strain Glow
      for (let i = 0; i < dynamicNodes.length; i++) {
        const node = dynamicNodes[i];
        const { px, py, p } = project(node.x, node.y, node.z);

        // Calculate displacement curvature from home rest coordinate
        const dispX = node.x - node.ox;
        const dispY = node.y - node.oy;
        const strain = Math.hypot(dispX, dispY, node.z);

        const baseRadius = 2.1;
        const dotRadius = Math.max(1.1, baseRadius * p);

        ctx.beginPath();
        ctx.arc(px, py, dotRadius, 0, Math.PI * 2);

        // Under active deformation/bending, illuminate dots in Emerald Green with smooth fading
        if (strain > 3.5) {
          const alpha = Math.min(0.95, 0.35 + (strain / 24) * 0.6);
          ctx.fillStyle = `rgba(5, 150, 105, ${alpha})`;
          if (strain > 10) {
            ctx.shadowColor = accentGreen;
            ctx.shadowBlur = 4;
          } else {
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = calmDotColor;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver.disconnect();
    };
  }, [isDark]);

  // Preset switch
  const handleSelectPreset = useCallback((preset: ClothPreset) => {
    setActivePreset(preset);
    presetRef.current = preset;
    triggerRippleRef.current?.();
  }, []);

  // Pointer scale switch
  const handleSelectPointerScale = useCallback((scale: PointerScale) => {
    setPointerScale(scale);
    pointerScaleRef.current = scale;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block absolute inset-0 z-0"
      />

      {/* Floating Interactive Controls Pill in Main Chat Area */}
      {showControls && (
        <div
          className="absolute top-3 right-3 sm:right-6 pointer-events-auto z-30 flex flex-col items-end"
          aria-hidden="false"
        >
          <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-flat-sm backdrop-blur-md text-xs">
            {/* Engine Status Badge */}
            <button
              onClick={() => setIsPanelExpanded((prev) => !prev)}
              onKeyDown={onKeyEnterOrSpace(() => setIsPanelExpanded((prev) => !prev))}
              className="px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-semibold text-[#1E293B] dark:text-slate-200 hover:text-[#059669] dark:hover:text-[#059669] transition-colors cursor-pointer"
              title="Toggle Cloth Bending & Pointer Controls"
              aria-expanded={isPanelExpanded}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
              </span>
              <span className="hidden sm:inline font-mono text-[11px] font-bold">Cloth Dots</span>
              <span className="text-[10px] text-[#059669] font-bold px-1.5 py-0.5 rounded-lg neu-inset-sm">
                {CLOTH_PRESETS[activePreset].name.split(" ")[0]} • {POINTER_SCALES[pointerScale].label}
              </span>
              {isPanelExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Ripple Button */}
            <button
              onClick={() => triggerRippleRef.current?.()}
              onKeyDown={onKeyEnterOrSpace(() => triggerRippleRef.current?.())}
              className="p-1.5 rounded-xl neu-btn text-[#475569] hover:text-[#059669] dark:text-slate-300 dark:hover:text-[#059669] transition-colors cursor-pointer"
              title="Trigger Elastic Ripple"
              aria-label="Trigger Elastic Ripple"
            >
              <Waves className="w-3.5 h-3.5" />
            </button>

            {/* Reset Button */}
            <button
              onClick={() => resetClothRef.current?.()}
              onKeyDown={onKeyEnterOrSpace(() => resetClothRef.current?.())}
              className="p-1.5 rounded-xl neu-btn text-[#475569] hover:text-[#059669] dark:text-slate-300 dark:hover:text-[#059669] transition-colors cursor-pointer"
              title="Reset Dots to Glassy Calm"
              aria-label="Reset Dots to Glassy Calm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Expanded Drawer for Cloth Physics & Pointer Controls */}
          {isPanelExpanded && (
            <div className="mt-2 p-3 rounded-2xl neu-flat text-xs w-64 sm:w-72 space-y-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#475569]/20 dark:border-[#475569]/30">
                <span className="text-[11px] font-bold text-[#1E293B] dark:text-slate-200 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#059669]" />
                  Smooth Cloth Bending
                </span>
                <span className="text-[10px] text-[#475569] dark:text-slate-400 font-mono">
                  {particleCount} dots
                </span>
              </div>

              {/* Pointer Precision Selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider block">
                    Pointer Size
                  </label>
                  <span className="text-[10px] text-[#059669] font-medium">
                    {POINTER_SCALES[pointerScale].pixelDesc}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(["fine", "compact", "medium"] as PointerScale[]).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => handleSelectPointerScale(scale)}
                      onKeyDown={onKeyEnterOrSpace(() => handleSelectPointerScale(scale))}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        pointerScale === scale
                          ? "neu-btn-accent text-white"
                          : "neu-btn text-[#475569] dark:text-slate-300 hover:text-[#1E293B]"
                      }`}
                    >
                      {POINTER_SCALES[scale].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Membrane Presets */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider block">
                  Cloth Presets
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(["liquidSilk", "tranquil", "elastic"] as ClothPreset[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSelectPreset(p)}
                      onKeyDown={onKeyEnterOrSpace(() => handleSelectPreset(p))}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        activePreset === p
                          ? "neu-btn-accent text-white"
                          : "neu-btn text-[#475569] dark:text-slate-300 hover:text-[#1E293B]"
                      }`}
                    >
                      {p === "liquidSilk" ? "Silk" : p === "elastic" ? "Elastic" : "Tranquil"}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed bg-[#F1F5F9]/50 dark:bg-slate-900/50 p-2 rounded-xl border border-[#475569]/10">
                {CLOTH_PRESETS[activePreset].description}
              </p>

              <div className="pt-1 flex items-center justify-between text-[10px] text-[#475569] dark:text-slate-400">
                <span>Move cursor to bend dots smoothly</span>
                <span className="text-[#059669] font-semibold">Click to ripple</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
