import React from "react";

interface CareerSphereLogoProps {
  size?: number;
  className?: string;
  showAura?: boolean;
}

export const CareerSphereLogo: React.FC<CareerSphereLogoProps> = ({
  size = 96,
  className = "",
  showAura = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Radial Aura Glow */}
      {showAura && (
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60 dark:opacity-75 pointer-events-none transition-all"
          style={{
            background:
              "radial-gradient(circle, rgba(5, 150, 105, 0.45) 0%, rgba(16, 185, 129, 0.20) 45%, transparent 75%)",
            transform: "scale(1.3)",
          }}
        />
      )}

      {/* SVG Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-md"
      >
        <defs>
          {/* Emerald Gradient */}
          <linearGradient id="csEmeraldGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Accent Gold/Cyan Sparkle Gradient */}
          <linearGradient id="csSparkleGrad" x1="40" y1="30" x2="90" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          {/* Inner Sphere Subtle Depth Gradient */}
          <radialGradient id="csSphereGlow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#059669" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.01" />
          </radialGradient>
        </defs>

        {/* Outer Circular Glow Boundary */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="url(#csSphereGlow)"
          stroke="#059669"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />

        {/* Latitude and Longitude Sphere Lines (Global Career Horizon) */}
        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="20"
          transform="rotate(-28 60 60)"
          stroke="url(#csEmeraldGrad)"
          strokeWidth="2.2"
          strokeDasharray="4 2"
          strokeOpacity="0.75"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="34"
          transform="rotate(32 60 60)"
          stroke="#059669"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />

        {/* Central Core Disc */}
        <circle
          cx="60"
          cy="60"
          r="26"
          className="fill-slate-100 dark:fill-[#0F172A]"
          stroke="url(#csEmeraldGrad)"
          strokeWidth="2"
        />

        {/* Inner Emerald Pulse Orb */}
        <circle
          cx="60"
          cy="60"
          r="16"
          fill="url(#csEmeraldGrad)"
          fillOpacity="0.9"
        />

        {/* Ascending Trajectory Vector Arrow (Career Acceleration) */}
        <path
          d="M44 76L76 44M76 44H58M76 44V62"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Planetary Satellite Nodes (Skill / Career Connections) */}
        <circle cx="28" cy="40" r="3.5" fill="#10B981" />
        <circle cx="92" cy="78" r="3" fill="#34D399" />
        <circle cx="86" cy="32" r="4" fill="#059669" />
        <circle cx="34" cy="84" r="2.5" fill="#059669" />

        {/* Top-Right North Star / AI Sparkle */}
        <path
          d="M98 22L100 27L105 29L100 31L98 36L96 31L91 29L96 27L98 22Z"
          fill="#34D399"
        />
      </svg>
    </div>
  );
};
