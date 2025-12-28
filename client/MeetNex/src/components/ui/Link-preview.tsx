"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { encode } from "qss";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "../../lib/Utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  let src;
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.width": width * 3,
      "viewport.height": height * 3,
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }

  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const x = useMotionValue(0);
  const translateX = useSpring(x, { stiffness: 100, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  return (
    <>
      {isMounted && (
        <div className="hidden">
          <img src={src} width={width} height={height} alt="hidden image" />
        </div>
      )}
      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={setOpen}
      >
        <HoverCardPrimitive.Trigger
          asChild
          onMouseMove={handleMouseMove}
        >
          <a
            href={url}
            className={cn("inline-block text-white underline decoration-dotted underline-offset-2 transition-colors cursor-pointer hover:text-blue-400", className)}
          >
            {children}
          </a>
        </HoverCardPrimitive.Trigger>
        <HoverCardPrimitive.Content
          className="z-50 [transform-origin:var(--radix-hover-card-content-transform-origin)]"
          side="top"
          align="center"
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 20 },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-white/10"
                style={{ x: translateX }}
              >
                <a
                  href={url}
                  className="block p-1 bg-white dark:bg-neutral-900"
                  style={{ fontSize: 0 }}
                >
                  <img
                    src={isStatic ? imageSrc : src}
                    width={width}
                    height={height}
                    className="rounded-lg object-cover"
                    alt="preview image"
                  />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
};