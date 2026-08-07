interface LoaderProps {
  mode?: "screen" | "container";
  size?: "sm" | "md" | "lg";
}

export default function Loader({
  mode = "container",
  size = "md",
}: LoaderProps) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const borderMap = {
    sm: "border-2",
    md: "border-[3px]",
    lg: "border-4",
  };

  const layoutClass =
    mode === "screen"
      ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
      : "flex min-h-[200px] w-full items-center justify-center p-8";

  return (
    <div className={layoutClass}>
      <div className={`relative ${sizeMap[size]}`}>
        {/* Ambient Outer Glow */}
        <div
          className={`absolute inset-0 rounded-full border-[var(--accent-mid)]/30 blur-[4px] animate-pulse ${borderMap[size]}`}
        />

        {/* Background Track */}
        <div
          className={`absolute inset-0 rounded-full border-[var(--glass-border)] ${borderMap[size]}`}
        />

        {/* High-End Spinning Accent Line */}
        <div
          className={`
            absolute 
            inset-0 
            rounded-full 
            border-transparent 
            border-t-[var(--accent-start)] 
            border-r-[var(--accent-end)] 
            animate-spin
            ${borderMap[size]}
          `}
          style={{
            animationDuration: "0.75s",
            animationTimingFunction: "cubic-bezier(0.4, 0.1, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}
