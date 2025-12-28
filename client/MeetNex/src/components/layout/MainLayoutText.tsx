import { useEffect, useState } from "react";
import { Typewriter } from "../ui/TypewriterEffect";

type SlideItem = {
  image: string;
  text: string;
};

type MainLayoutTextProps = {
  imageSize?: string;
  containerHeight?: string;
};

const slides: SlideItem[] = [
  {
    image: "/sliderImages/slide1banner.svg",
    text: "Crystal Clear Video Calls",
  },
  {
    image: "/sliderImages/slide3banner.svg",
    text: "Secure & Private Meetings",
  },
  {
    image: "/sliderImages/slide2banner.svg",
    text: "Seamless Screen Sharing",
  },
];

function MainLayoutText({
  imageSize = "w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72",
  containerHeight = "h-[240px] sm:h-[300px] md:h-[380px]",
}: MainLayoutTextProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
      
      {/* ================= HEADING ================= */}
    <h1
  className="
    text-center font-bold leading-snug
    text-lg sm:text-2xl md:text-4xl lg:text-5xl
    max-w-4xl
    whitespace-nowrap
    flex items-center justify-center gap-2 sm:gap-3
  "
>
  <span className="text-gray-700">Because</span>
  <span className="text-gray-700">Every</span>
  <span className="text-gray-700">Conversation</span>
  <span className="text-gray-700">Matters :</span>

  {/* TYPEWRITER */}
  <span className="inline-block min-w-[7ch] text-blue-600">
    <Typewriter text="MeetNex." />
  </span>
</h1>

      {/* GAP */}
      <div className="h-4 sm:h-6 md:h-8" />

      {/* ================= SUB TEXT ================= */}
      <p className="text-gray-500 text-xs sm:text-sm md:text-base text-center max-w-md sm:max-w-xl">
        MeetNeX makes it easy to meet face-to-face, share ideas, and stay
        connected — anywhere.
      </p>

      {/* GAP */}
      <div className="h-8 sm:h-16 md:h-24" />

      {/* ================= CAROUSEL ================= */}
      <div
        className={`relative w-full max-w-4xl ${containerHeight} overflow-hidden`}
      >
        {slides.map((slide, index) => {
          const isCurrent = index === current;

          return (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center
                transition-all duration-700 ${
                  isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
            >
              <div className={`rounded-full overflow-hidden ${imageSize}`}>
                <img
                  src={slide.image}
                  alt={slide.text}
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl font-semibold text-gray-900 text-center">
                {slide.text}
              </h2>
            </div>
          );
        })}
      </div>

      {/* ================= DOTS ================= */}
      <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`rounded-full transition-all duration-300 ${
              current === index
                ? "bg-indigo-600 w-8 sm:w-10 h-2.5"
                : "bg-gray-300 w-2.5 h-2.5 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default MainLayoutText;
