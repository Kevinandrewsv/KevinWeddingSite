import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  MessageCircleHeart,
  Quote,
  Sparkles,
} from "lucide-react";

import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

const FeaturedWishesSection = ({ wishes = [], wishesLoading = false }) => {
  const trackRef = useRef(null);
  const groupRef = useRef(null);
  const animationRef = useRef(null);

  const visibleWishes = useMemo(() => {
    return wishes.slice(0, 8);
  }, [wishes]);

  const marqueeWishes = useMemo(() => {
    if (visibleWishes.length === 0) return [];

    if (visibleWishes.length === 1) {
      return Array.from({ length: 8 }, () => visibleWishes[0]);
    }

    if (visibleWishes.length === 2) {
      return [
        ...visibleWishes,
        ...visibleWishes,
        ...visibleWishes,
        ...visibleWishes,
      ];
    }

    if (visibleWishes.length === 3) {
      return [...visibleWishes, ...visibleWishes, ...visibleWishes];
    }

    return visibleWishes;
  }, [visibleWishes]);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;

    if (!track || !group || marqueeWishes.length === 0) return undefined;

    let resizeObserver;

    const startRolling = () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }

      track.style.transform = "translate3d(0, 0, 0)";

      const groupWidth = group.scrollWidth;

      if (!groupWidth || groupWidth < 10) return;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      const duration = isMobile ? 52000 : isTablet ? 62000 : 76000;

      animationRef.current = track.animate(
        [
          {
            transform: "translate3d(0, 0, 0)",
          },
          {
            transform: `translate3d(-${groupWidth}px, 0, 0)`,
          },
        ],
        {
          duration,
          iterations: Infinity,
          easing: "linear",
        }
      );
    };

    const startTimer = window.setTimeout(startRolling, 80);

    resizeObserver = new ResizeObserver(() => {
      startRolling();
    });

    resizeObserver.observe(group);

    window.addEventListener("resize", startRolling);

    return () => {
      window.clearTimeout(startTimer);
      window.removeEventListener("resize", startRolling);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [marqueeWishes.length]);

  const renderWishCard = (wish, index, groupName) => {
    const sizeClass =
      index % 3 === 0
        ? "h-[220px] w-[285px] sm:h-[225px] sm:w-[335px] lg:h-[245px] lg:w-[390px]"
        : index % 3 === 1
        ? "h-[210px] w-[270px] sm:h-[215px] sm:w-[310px] lg:h-[220px] lg:w-[330px]"
        : "h-[215px] w-[280px] sm:h-[222px] sm:w-[325px] lg:h-[235px] lg:w-[360px]";

    const messageText = wish.message || "";

    const messageSizeClass =
      messageText.length > 180
        ? "text-[0.82rem] leading-[1.42] line-clamp-5 sm:text-[0.9rem] lg:text-[0.92rem] lg:leading-[1.45]"
        : messageText.length > 120
        ? "text-[0.88rem] leading-[1.48] line-clamp-5 sm:text-[0.94rem] lg:text-[0.98rem] lg:leading-[1.5]"
        : "text-[0.96rem] leading-relaxed line-clamp-4 sm:text-[1rem] lg:text-[1.06rem]";

    const floatClass =
      index % 2 === 0
        ? "translate-y-2 sm:translate-y-3 lg:translate-y-4"
        : "-translate-y-2 sm:-translate-y-3 lg:-translate-y-4";

    return (
      <div
        key={`${groupName}-${wish._id || wish.name || "wish"}-${index}`}
        className={`group relative shrink-0 transform-gpu ${sizeClass} ${floatClass}`}
      >
        <div className="relative h-full overflow-hidden rounded-[2rem] border border-rose-100 bg-white px-4 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-3xl transition-[box-shadow,border-color,background-color,transform] duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.015] group-hover:border-rose-200 group-hover:bg-white group-hover:shadow-[0_14px_34px_rgba(15,23,42,0.055)] sm:rounded-[2.5rem] sm:px-6 sm:py-6 lg:rounded-[3rem] lg:px-7 lg:py-7 lg:shadow-[0_12px_30px_rgba(15,23,42,0.045)] lg:group-hover:shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
          <div className="absolute inset-0 rounded-[2rem] bg-white sm:rounded-[2.5rem] lg:rounded-[3rem]" />

          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent sm:inset-x-10" />
          <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-100/70 to-transparent sm:inset-x-10" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-700 text-white shadow-sm transition-transform duration-500 ease-out group-hover:scale-105 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                <Quote
                  size={18}
                  className="sm:h-5 sm:w-5 lg:h-[21px] lg:w-[21px]"
                />
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-rose-100 bg-white px-3 py-2 text-rose-700 shadow-sm transition-colors duration-500 ease-out sm:gap-2 sm:px-3.5">
                <Sparkles size={12} className="sm:h-[13px] sm:w-[13px]" />

                <span className="text-[9px] font-black uppercase tracking-[0.14em] sm:text-[10px] sm:tracking-[0.18em]">
                  Blessing
                </span>
              </div>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-hidden sm:mt-5">
              <p className={`${messageSizeClass} break-words text-gray-700`}>
                “{messageText}”
              </p>
            </div>

            <div className="mt-4 flex shrink-0 items-center justify-between gap-3 sm:mt-5 sm:gap-4">
              <div className="min-w-0">
                <p className="truncate text-base font-black text-gray-950 sm:text-lg">
                  {wish.name}
                </p>

                {wish.relation && (
                  <p className="mt-1 truncate text-xs font-semibold text-rose-700 sm:text-sm">
                    {wish.relation}
                  </p>
                )}
              </div>

              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-700 transition-all duration-500 ease-out group-hover:bg-rose-700 group-hover:text-white sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                <Heart
                  size={17}
                  fill="currentColor"
                  className="relative sm:h-[18px] sm:w-[18px] lg:h-[19px] lg:w-[19px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative isolate overflow-hidden bg-white px-4 py-12 sm:px-5 sm:py-16 md:px-6 md:py-18 lg:px-8 lg:py-24">
      <div className="absolute inset-0 z-0 bg-white" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-24 bg-white sm:h-36 lg:h-44" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2.5 shadow-sm sm:px-5">
            <MessageCircleHeart size={15} className="text-rose-700" />

            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-700 sm:text-xs sm:tracking-[0.35em]">
              Blessings
            </span>
          </div>

          <h2 className="mx-auto mt-5 max-w-sm text-[2.35rem] font-black leading-tight tracking-tight text-gray-950 min-[390px]:text-[2.65rem] sm:mt-6 sm:max-w-2xl sm:text-5xl md:text-6xl">
            Wishes from
            <span className="block rose-text-gradient">our loved ones</span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-7 text-gray-600 sm:mt-5 sm:max-w-2xl sm:text-lg sm:leading-relaxed">
            Heartfelt blessings and beautiful wishes shared by family and
            friends for our blessed beginning.
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-12 lg:mt-16">
          {wishesLoading && <LoadingState message="Loading wishes..." />}

          {!wishesLoading && visibleWishes.length === 0 && (
            <div className="mx-auto max-w-3xl">
              <EmptyState
                title="Featured Wishes Coming Soon"
                message="Approved and featured wishes from loved ones will appear here soon."
              />
            </div>
          )}

          {!wishesLoading && visibleWishes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.24 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-white via-white/95 to-transparent sm:w-14 lg:w-24" />
              <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-white via-white/95 to-transparent sm:w-14 lg:w-24" />

              <div className="relative overflow-hidden py-4 sm:py-6 lg:py-8">
                <div
                  ref={trackRef}
                  className="flex w-max min-w-max items-center"
                  style={{
                    transform: "translate3d(0, 0, 0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div
                    ref={groupRef}
                    className="flex shrink-0 items-center gap-3 px-3 sm:gap-5 sm:px-5 lg:gap-6 lg:px-6"
                  >
                    {marqueeWishes.map((wish, index) =>
                      renderWishCard(wish, index, "first")
                    )}
                  </div>

                  <div
                    className="flex shrink-0 items-center gap-3 px-3 sm:gap-5 sm:px-5 lg:gap-6 lg:px-6"
                    aria-hidden="true"
                  >
                    {marqueeWishes.map((wish, index) =>
                      renderWishCard(wish, index, "second")
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center sm:mt-11 lg:mt-14">
                <Link
                  to="/wishes"
                  className="group relative inline-flex min-h-12 w-full max-w-[300px] items-center justify-center gap-3 overflow-hidden rounded-full border border-rose-100 bg-white px-5 py-3.5 pr-3 text-sm font-black text-rose-700 shadow-xl shadow-rose-100/70 backdrop-blur-2xl transition duration-300 hover:border-rose-200 hover:bg-rose-700 hover:text-white sm:w-auto sm:max-w-none sm:px-7 sm:py-4 sm:pr-4"
                >
                  <span className="absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/70 to-transparent transition duration-700 group-hover:translate-x-[130%]" />

                  <span className="relative tracking-wide">Send Your Wish</span>

                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700 transition duration-300 group-hover:bg-white/20 group-hover:text-white">
                    <ChevronRight
                      size={18}
                      className="transition duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWishesSection;