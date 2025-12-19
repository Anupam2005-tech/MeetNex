import React from "react";

type CardProps = {
  // We change these to be optional so they don't override className logic
  width?: string;
  height?: string;
  bgColor?: string;
  radius?: string;

  title?: string;
  description?: string;

  gradient?: string;
  imageSrc?: string;
  videoSrc?: string;

  mediaFit?: "cover" | "contain";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;

  className?: string;
  children?: React.ReactNode;
};

function Card({
  width = "",        // Default empty so className takes priority
  height = "",       // Default empty so className takes priority
  bgColor = "bg-neutral-900",
  radius = "rounded-3xl",
  title,
  description,
  gradient,
  imageSrc,
  videoSrc,
  mediaFit = "cover",
  autoPlay = true,
  muted = true,
  loop = true,
  className = "",
  children,
}: CardProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        ${width} ${height} ${bgColor} ${radius}
        ${className}
      `}
    >
      {/* MEDIA LAYER */}
      {(imageSrc || videoSrc) && (
        <div className="absolute inset-0 z-0">
          {imageSrc && (
            <img src={imageSrc} alt="" draggable={false} className={`w-full h-full object-${mediaFit}`} />
          )}
          {videoSrc && (
            <video src={videoSrc} autoPlay={autoPlay} muted={muted} loop={loop} playsInline className={`w-full h-full object-${mediaFit}`} />
          )}
        </div>
      )}

      {/* GRADIENT OVERLAY */}
      {gradient && <div className={`absolute inset-0 z-20 ${gradient}`} />}

      {/* CHILDREN / CONTENT LAYER */}
      {/* Removed "absolute inset-0" to allow height to adjust to children content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}

      {/* DEFAULT TEXT CONTENT */}
      {(title || description) && (
        <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
          {title && <h3 className="text-white font-medium mb-1">{title}</h3>}
          {description && <p className="text-sm text-neutral-300 max-w-xs">{description}</p>}
        </div>
      )}
    </div>
  );
}

export default Card;