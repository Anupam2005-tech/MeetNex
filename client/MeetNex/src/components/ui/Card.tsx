import React from "react";

type CardProps = {
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
  width = "",
  height = "",
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
              className={`w-full h-full ${
                mediaFit === "cover" ? "object-cover" : "object-contain"
              }`}
            />
          )}

          {videoSrc && (
            <video
              src={videoSrc}
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              playsInline
              className={`w-full h-full ${
                mediaFit === "cover" ? "object-cover" : "object-contain"
              }`}
            />
          )}
        </div>
      )}

      {/* DARK OVERLAY FOR TEXT READABILITY */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* GRADIENT OVERLAY (OPTIONAL) */}
      {gradient && (
        <div className={`absolute inset-0 z-20 ${gradient}`} />
      )}

      {/* CHILDREN */}
      {children && (
        <div className="relative z-30 p-6">
          {children}
        </div>
      )}

      {/* DEFAULT TEXT CONTENT */}
      {(title || description) && (
        <div className="absolute bottom-6 left-6 z-30 max-w-xs">
          {title && (
            <h3 className="text-white text-lg font-medium mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-neutral-200">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Card;
