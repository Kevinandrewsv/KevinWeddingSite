/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const HERO_FIREWORK_KEY = "kj_wedding_fireworks_shown";

export const useWeddingTimeline = () => {
  const marriageDate = useMemo(() => {
    return new Date("2026-06-25T10:30:00+05:30").getTime();
  }, []);

  const afterWeddingWeekDate = useMemo(() => {
    return marriageDate + 7 * 24 * 60 * 60 * 1000;
  }, [marriageDate]);

  const [currentTime, setCurrentTime] = useState(() => new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weddingStatus = useMemo(() => {
    if (currentTime < marriageDate) return "before";
    if (currentTime >= marriageDate && currentTime < afterWeddingWeekDate) {
      return "wedding-week";
    }
    return "after-week";
  }, [currentTime, marriageDate, afterWeddingWeekDate]);

  const timeLeft = useMemo(() => {
    const difference = marriageDate - currentTime;

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }, [currentTime, marriageDate]);

  return {
    weddingStatus,
    timeLeft,
  };
};

const WeddingTimelineBox = ({ weddingStatus, timeLeft }) => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (weddingStatus !== "wedding-week") {
      setShowFireworks(false);
      return undefined;
    }

    const alreadyShown =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(HERO_FIREWORK_KEY) === "true";

    if (alreadyShown) return undefined;

    setShowFireworks(true);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(HERO_FIREWORK_KEY, "true");
    }

    const fireworksTimer = setTimeout(() => {
      setShowFireworks(false);
    }, 30000);

    return () => clearTimeout(fireworksTimer);
  }, [weddingStatus]);

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  const fireworks = useMemo(() => {
    return Array.from({ length: 32 }, (_, index) => {
      const angle = (index * 137.5) % 360;
      const radius = 55 + (index % 6) * 18;
      const delay = (index % 9) * 0.18;
      const duration = 1.4 + (index % 5) * 0.22;
      const left = 12 + ((index * 23) % 76);
      const top = 12 + ((index * 31) % 66);

      return {
        id: index,
        angle,
        radius,
        delay,
        duration,
        left,
        top,
      };
    });
  }, []);

  return (
    <div className="relative mt-11 max-w-[680px] overflow-hidden rounded-[2.4rem] border border-rose-100 bg-white p-4 backdrop-blur-2xl shadow-2xl shadow-rose-100">
      {showFireworks && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[2.2rem]">
          {fireworks.map((spark) => (
            <motion.span
              key={spark.id}
              className="absolute h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.9)]"
              style={{
                left: `${spark.left}%`,
                top: `${spark.top}%`,
              }}
              animate={{
                x: [
                  0,
                  Math.cos((spark.angle * Math.PI) / 180) * spark.radius,
                  0,
                ],
                y: [
                  0,
                  Math.sin((spark.angle * Math.PI) / 180) * spark.radius,
                  0,
                ],
                opacity: [0, 1, 0],
                scale: [0.4, 1.7, 0.2],
              }}
              transition={{
                duration: spark.duration,
                delay: spark.delay,
                repeat: Infinity,
                repeatDelay: 1.15,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(244,63,94,0.18),transparent_36%)]"
            animate={{
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {weddingStatus === "before" && (
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-rose-100 bg-white px-4 py-6 text-center shadow-xl shadow-rose-100/70 backdrop-blur-xl"
            >
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl transition group-hover:bg-rose-200/70" />

              <div className="relative">
                <p className="text-4xl md:text-5xl font-black rose-text-gradient tabular-nums leading-none">
                  {item.value}
                </p>

                <p className="mt-3 text-[10px] md:text-xs font-black uppercase tracking-[0.24em] text-gray-500">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {weddingStatus === "wedding-week" && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[1.9rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50/70 to-pink-50 p-7 text-center shadow-xl shadow-rose-100/70"
        >
          <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-rose-200/50 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-pink-200/50 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-700 text-white shadow-xl shadow-rose-200">
              <Sparkles size={24} />
            </div>

            <p className="text-xs uppercase tracking-[0.38em] text-rose-600 font-black">
              Blessed Moment
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-black rose-text-gradient leading-tight">
              Wedding Celebration Has Begun
            </h2>

            <p className="mt-4 text-sm md:text-base font-bold text-gray-600">
              25 June 2026 • 10:30 AM
            </p>

            <p className="mt-3 text-base md:text-lg text-gray-600">
              With God&apos;s grace, the celebration has begun.
            </p>
          </div>
        </motion.div>
      )}

      {weddingStatus === "after-week" && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[1.9rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50/60 to-pink-50 p-7 text-center shadow-xl shadow-rose-100/70"
        >
          <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-rose-200/45 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-pink-200/45 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-700 border border-rose-100 shadow-xl shadow-rose-100">
              <Heart size={25} fill="#be123c" />
            </div>

            <p className="text-xs uppercase tracking-[0.38em] text-rose-600 font-black">
              New Beginning
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-black rose-text-gradient leading-tight">
              Our Happy Life Has Started
            </h2>

            <p className="mt-4 text-base md:text-lg text-gray-600">
              Thank you for being part of our blessed beginning.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeddingTimelineBox;