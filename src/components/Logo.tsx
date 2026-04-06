interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon"
  className?: string
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 52,
  xl: 80,
}

export function Logo({ size = "md", variant = "full", className = "" }: LogoProps) {
  const imgSize = sizeMap[size]

  if (variant === "icon" || size === "sm") {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src="/t.png"
          alt="TransferIntelligence"
          style={{ width: imgSize, height: imgSize, objectFit: "contain" }}
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/t.png"
        alt="TransferIntelligence"
        style={{ width: imgSize, height: imgSize, objectFit: "contain" }}
      />
      <div className="flex flex-col leading-none">
        <span className="font-bold tracking-tight text-foreground text-sm">
          Transfer<span style={{ color: "var(--brand)" }}>Intelligence</span>
        </span>
        <span className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
          TransInt
        </span>
      </div>
    </div>
  )
}

export function LogoHero() {
  return (
    <div className="flex flex-col items-center">
      <img
        src="/logo_full.png"
        alt="TransferIntelligence logo"
        className="mix-blend-multiply"
        style={{ width: 640, maxWidth: "90vw", objectFit: "contain" }}
      />
    </div>
  )
}
