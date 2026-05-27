import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FaCross } from "react-icons/fa6";

const AnimatedVerseLine = ({
  text,
  delay = 0,
  isVisible,
  className = "",
  style = {},
}) => {
  return (
    <div className={`overflow-visible ${className}`}>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={
          isVisible
            ? { width: "100%", opacity: 1 }
            : { width: 0, opacity: 0 }
        }
        transition={{
          duration: 2,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="overflow-hidden whitespace-nowrap"
      >
        <span
          className="inline-block bg-gradient-to-b from-white via-white to-rose-100 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
          style={style}
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
};

const BibleVerseSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-800 to-red-700 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,182,193,0.18),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/18 via-rose-700/10 to-black/20" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-pink-300/16 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-red-300/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-white/5 blur-2xl" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8 flex items-center gap-4 sm:mb-10"
        >
          <span className="h-px w-10 bg-white/45 sm:w-14" />
          <FaCross size={13} className="text-white/95" />
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/95 sm:text-xs sm:tracking-[0.4em]">
            Mark 10:9
          </p>
          <FaCross size={13} className="text-white/95" />
          <span className="h-px w-10 bg-white/45 sm:w-14" />
        </motion.div>

        <div className="flex min-h-[150px] flex-col items-center justify-center sm:min-h-[170px] lg:min-h-[190px]">
          <AnimatedVerseLine
            text="Therefore what God has joined together,"
            delay={0.2}
            isVisible={isVisible}
            className="text-[1.7rem] leading-[1.2] sm:text-[2.4rem] lg:text-[3.35rem]"
            style={{
              fontFamily: "'Great Vibes', 'Allura', 'Alex Brush', cursive",
              fontWeight: 400,
            }}
          />

          <AnimatedVerseLine
            text="let no one separate."
            delay={1.9}
            isVisible={isVisible}
            className="mt-3 text-[1.7rem] leading-[1.2] sm:mt-4 sm:text-[2.4rem] lg:text-[3.35rem]"
            style={{
              fontFamily: "'Great Vibes', 'Allura', 'Alex Brush', cursive",
              fontWeight: 400,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 3.2, ease: "easeOut" }}
          className="mt-8 flex items-center gap-4 sm:mt-10"
        >
          <span className="h-px w-16 bg-white/40 sm:w-20" />
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white/90" />
            <Heart size={14} className="text-white" fill="currentColor" />
            <span className="h-2 w-2 rounded-full bg-white/90" />
          </div>
          <span className="h-px w-16 bg-white/40 sm:w-20" />
        </motion.div>
      </div>
    </section>
  );
};

export default BibleVerseSection;