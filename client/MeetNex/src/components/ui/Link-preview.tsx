import { useState } from "react";
import { Link } from "react-router-dom";
import { encode } from "qss";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/Utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url?: string;
  className?: string;
  width?: number;
  height?: number;
  isStatic?: boolean;
  imageSrc?: string;
  previewComponent?: React.ReactNode; 
};

export default function LinkPreview ({
  children,
  url = "#",
  className,
  width = 300,
  height = 200,
  isStatic = false,
  imageSrc = "",
  previewComponent,
}: LinkPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [side, setSide] = useState<"top" | "bottom">("top");

  const params = encode({
    url,
    screenshot: true,
    meta: false,
    embed: "screenshot.url",
    "viewport.isMobile": true,
    "viewport.width": width * 2,
    "viewport.height": height * 2,
  });
  const src = isStatic ? imageSrc : `https://api.microlink.io/?${params}`;

  const x = useMotionValue(0);
  const translateX = useSpring(x, { stiffness: 100, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);

    if (targetRect.top < height + 50) setSide("bottom");
    else setSide("top");
  };

  const isExternal = url.startsWith("http");

  // VIRTUAL VIEWPORT LOGIC
  // We simulate a 1280px wide screen and scale it down to the 'width' prop
  const virtualWidth = 1280;
  const virtualHeight = (height / width) * virtualWidth;
  const scale = width / virtualWidth;

  const RenderContent = () => (
    <>
      <div className="opacity-100 flex items-center justify-center">
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: side === "top" ? 20 : -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 20 : -20, scale: 0.8 }}
            style={{ x: translateX, left: "50%", translateX: "-50%" }}
            className={cn(
              "absolute z-[100] pointer-events-none",
              side === "top" ? "bottom-full mb-4" : "top-full mt-4"
            )}
          >
            <div className="shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-white/10 p-1">
              <div 
                className="rounded-xl overflow-hidden bg-white dark:bg-black"
                style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}
              >
                {previewComponent ? (
                  <div 
                    className="origin-top-left"
                    style={{ 
                        width: `${virtualWidth}px`, 
                        height: `${virtualHeight}px`,
                        transform: `scale(${scale})`,
                        pointerEvents: 'none' 
                    }}
                  >
                    {previewComponent}
                  </div>
                ) : (
                  <img src={src} width={width} height={height} className="object-cover block w-full h-full" alt="preview" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const commonProps = {
    className: cn("relative inline-block cursor-pointer", className),
    onMouseEnter: () => setIsOpen(true),
    onMouseLeave: () => setIsOpen(false),
    onMouseMove: handleMouseMove,
  };

  return isExternal ? (
    <a href={url} target="_blank" rel="noopener noreferrer" {...commonProps}>
      <RenderContent />
    </a>
  ) : (
    <Link to={url} {...commonProps}>
      <RenderContent />
    </Link>
  );
};