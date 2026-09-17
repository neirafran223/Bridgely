interface BridgeLoaderProps {
  texto?: string;
}

export default function BridgeLoader({ texto = "Conectando..." }: BridgeLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-5" role="status" aria-label={texto}>
      {/* Bridge animation */}
      <div className="relative w-40 h-24">
        <svg
          viewBox="0 0 160 96"
          fill="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Left tower */}
          <g className="animate-tower-left" style={{ transformOrigin: "30px 80px" }}>
            <rect x="24" y="30" width="12" height="50" rx="3" fill="#1F2F98" opacity="0.9" />
            <circle cx="30" cy="28" r="6" fill="#787FF6" className="animate-pulse-node" />
          </g>

          {/* Right tower */}
          <g className="animate-tower-right" style={{ transformOrigin: "130px 80px" }}>
            <rect x="124" y="30" width="12" height="50" rx="3" fill="#1F2F98" opacity="0.9" />
            <circle cx="130" cy="28" r="6" fill="#4ADEDE" className="animate-pulse-node-delayed" />
          </g>

          {/* Bridge cables - main arc */}
          <path
            d="M30 34 Q80 0 130 34"
            stroke="url(#bridgeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="animate-draw-cable"
          />

          {/* Secondary cables */}
          <path
            d="M30 38 Q80 10 130 38"
            stroke="url(#bridgeGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="animate-draw-cable-delayed"
            opacity="0.6"
          />

          {/* Bridge deck */}
          <path
            d="M24 50 L136 50"
            stroke="#1F2F98"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-draw-deck"
          />

          {/* Support pillars */}
          <line x1="55" y1="50" x2="55" y2="80" stroke="#1F2F98" strokeWidth="2" className="animate-pillar" style={{ animationDelay: "0.8s" }} />
          <line x1="80" y1="50" x2="80" y2="80" stroke="#1F2F98" strokeWidth="2" className="animate-pillar" style={{ animationDelay: "0.9s" }} />
          <line x1="105" y1="50" x2="105" y2="80" stroke="#1F2F98" strokeWidth="2" className="animate-pillar" style={{ animationDelay: "1s" }} />

          {/* Traveling light along the cable */}
          <circle r="4" fill="#787FF6" className="animate-travel-light" filter="url(#glow)">
            <animateMotion
              path="M30 34 Q80 0 130 34"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Second traveling light (opposite direction) */}
          <circle r="3" fill="#4ADEDE" className="animate-travel-light" filter="url(#glow)">
            <animateMotion
              path="M130 34 Q80 0 30 34"
              dur="2s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>

          {/* Gradient definition */}
          <defs>
            <linearGradient id="bridgeGradient" x1="30" y1="34" x2="130" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#787FF6" />
              <stop offset="100%" stopColor="#4ADEDE" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Loading text */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-[#1F2F98]/70">{texto}</p>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#787FF6] animate-bounce-dot" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#787FF6] animate-bounce-dot" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#787FF6] animate-bounce-dot" style={{ animationDelay: "300ms" }} />
        </span>
      </div>

      <span className="sr-only">{texto}</span>
    </div>
  );
}
