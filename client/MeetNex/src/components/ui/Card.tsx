import React from "react";

type CardProps = {
  width?: string;
  height?: string;
  bgColor?: string;
  radius?: string;

  title?: string;
  description?: string;

  /** Visual layers */
  gradient?: string;
  imageSrc?: string;
  videoSrc?: string;

  /** Media behavior */
  mediaFit?: "cover" | "contain";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;

  className?: string;
  children?: React.ReactNode;
};

function Card({
  width = "w-full",
  height = "h-[320px]",
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
            <img
              src={imageSrc}
              alt=""
              draggable={false}
              className={`w-full h-full object-${mediaFit}`}
            />
          )}

          {videoSrc && (
            <video
              src={videoSrc}
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              playsInline
              className={`w-full h-full object-${mediaFit}`}
            />
          )}
        </div>
      )}

      {/* Custom content (Three.js, SVG, etc.) */}
      {children && (
        <div className="absolute inset-0 z-10">
          {children}
        </div>
      )}

      {/* GRADIENT OVERLAY */}
      {gradient && (
        <div
          className={`absolute inset-0 z-20 ${gradient}`}
        />
      )}

      {/* TEXT CONTENT */}
      {(title || description) && (
        <div className="absolute bottom-6 left-6 z-30">
          {title && (
            <h3 className="text-white font-medium mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-neutral-300 max-w-xs">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Card;
