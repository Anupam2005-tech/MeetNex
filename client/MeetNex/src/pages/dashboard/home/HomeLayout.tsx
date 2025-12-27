import React, { useRef, Suspense, lazy } from "react";
import { MoveRight } from "lucide-react";
import Navbar from "./homePageComponents/Navbar";
import LaserFlow from "./homePageComponents/LaserFlow";
import GlowButton from "@/components/ui/buttons/GlowButton";
import AnimatedText from "@/components/ui/AnimatedText";
import { FeatureSection } from "./homePageComponents/FeatureSection";
import { OriginSection } from "./homePageComponents/OriginSection";
import TechArchitectLayout from "./homePageComponents/ArchitectureLayout";

/* ------------------- Lazy-loaded components ------------------- */
const HeroShowcase = lazy(() => import("./homePageComponents/HeroShowcase"));
const InterectiveRevel = lazy(() => import("./homePageComponents/InterectiveRevel"));
const Footer = lazy(() => import("./homePageComponents/Footer"));

export default function HomeLayout() {
  const revealImgRef = useRef<HTMLImageElement>(null);

  return (
    <>
      {/* Border animation */}
      <style>{`
        @keyframes rotateBorder {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <div
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#060010",
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y + rect.height * 0.5}px`);
          }
        }}
        onMouseLeave={() => {
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", "-9999px");
            el.style.setProperty("--my", "-9999px");
          }
        }}
      >
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#8684f1"
        />

        <Navbar />

        {/* ================= HERO TEXT ================= */}
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: "8%",
            transform: "translateY(-50%)",
            maxWidth: "520px",
            zIndex: 7,
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              lineHeight: "1.05",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "20px",
            }}
          >
            <AnimatedText text="Collaborate at the" />
            <br />
            <span style={{ color: "#8684f1" }}>
              <AnimatedText text="Speed of Thought" delay={0.15} />
            </span>
          </h1>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#b6b6c9",
              marginBottom: "28px",
            }}
          >
            <AnimatedText
              delay={0.35}
              text="MeetNex orchestrates your entire product lifecycle. A high-performance replacement for fragmented tools, built for the era of instant sync."
            />
          </p>

          <GlowButton text="See in Action" icon={<MoveRight size={16} />} />
        </div>

        {/* ================= HERO IMAGE ================= */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "49%",
            height: "52%",
            backgroundColor: "#060010",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 6,
            padding: "0.3rem",
            overflow: "hidden",
          }}
        >
          {/* Rotating border */}
          <div
            style={{
              position: "absolute",
              width: "150%",
              height: "300%",
              background:
                "conic-gradient(from 0deg, transparent, #8684f1, transparent 30%, #8684f1, transparent)",
              animation: "rotateBorder 6s linear infinite",
              zIndex: 1,
            }}
          />

          {/* Inner container */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#060010",
              borderTopLeftRadius: "18px",
              borderTopRightRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              zIndex: 2,
            }}
          >
            <img
              src="/main.avif"
              alt="Preview"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* ================= REVEAL OVERLAY ================= */}
        <img
          ref={revealImgRef}
          src="/hero-illustration.jpg"
          alt="Reveal effect"
          style={{
            position: "absolute",
            width: "100%",
            top: "-50%",
            zIndex: 5,
            mixBlendMode: "lighten",
            opacity: 0.3,
            pointerEvents: "none",
            "--mx": "-9999px",
            "--my": "-9999px",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0) 240px)",
            maskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0) 240px)",
            maskRepeat: "no-repeat",
          } as any}
        />
      </div>

      {/* ================= LAZY-LOADED SECTIONS ================= */}
      <Suspense fallback={<div className="h-96" />}>
        <HeroShowcase />
      </Suspense>

      <Suspense fallback={<div className="h-96" />}>
        <InterectiveRevel />
      </Suspense>
       <Suspense fallback={<div className="h-96" />}>
        <TechArchitectLayout />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <FeatureSection />
      </Suspense>


      <Suspense fallback={<div className="h-96" />}>
        <OriginSection />
      </Suspense>

      <Suspense fallback={<div className="h-48" />}>
        <Footer />
      </Suspense>
    </>
  );
}
