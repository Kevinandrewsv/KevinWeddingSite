import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Play,
  Sparkles,
} from "lucide-react";

import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const VIDEO_PREVIEW_DURATION = 6200;
const IMAGE_PREVIEW_DURATION = 4300;

const wrap = (min, max, value) => {
  const rangeSize = max - min;
  return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const BASE_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 34,
  mass: 0.9,
};

const TAP_SPRING = {
  type: "spring",
  stiffness: 330,
  damping: 26,
  mass: 0.9,
};

const useResponsiveRail = () => {
  const getConfig = useCallback(() => {
    if (typeof window === "undefined") {
      return {
        offsets: [-2, -1, 0, 1, 2],
        gap: 252,
      };
    }

    const width = window.innerWidth;

    if (width < 640) {
      return {
        offsets: [-1, 0, 1],
        gap: 160,
      };
    }

    if (width < 1024) {
      return {
        offsets: [-1, 0, 1],
        gap: 220,
      };
    }

    return {
      offsets: [-2, -1, 0, 1, 2],
      gap: 252,
    };
  }, []);

  const [config, setConfig] = useState(getConfig);

  useEffect(() => {
    let frameId;

    const handleResize = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        setConfig(getConfig());
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [getConfig]);

  return config;
};

const RailMedia = ({ item, isCenter, activeKey, galleryReady }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || item?.type !== "video") return undefined;

    let previewTimer;
    let retryTimer;
    let cancelled = false;

    const shouldPlay = isCenter && galleryReady;

    const stopVideo = () => {
      clearTimeout(previewTimer);
      clearTimeout(retryTimer);

      video.pause();

      if (!isCenter) {
        try {
          video.currentTime = 0;
        } catch {
          // Ignore browser metadata timing issue.
        }
      }
    };

    const playVideo = async () => {
      if (cancelled || !shouldPlay) return;

      clearTimeout(previewTimer);
      clearTimeout(retryTimer);

      try {
        video.muted = true;
        video.playsInline = true;

        try {
          video.currentTime = 0;
        } catch {
          // Ignore browser metadata timing issue.
        }

        await video.play();

        previewTimer = setTimeout(() => {
          if (!cancelled) {
            video.pause();
          }
        }, VIDEO_PREVIEW_DURATION);
      } catch {
        retryTimer = setTimeout(() => {
          if (!cancelled && shouldPlay) {
            video.play().catch(() => {});
          }
        }, 500);
      }
    };

    if (shouldPlay) {
      playVideo();
    } else {
      stopVideo();
    }

    return () => {
      cancelled = true;
      stopVideo();
    };
  }, [item?.id, item?.type, isCenter, activeKey, galleryReady]);

  if (!item) return null;

  if (item.type === "video") {
    return (
      <video
        ref={videoRef}
        src={item.url}
        muted
        playsInline
        preload={isCenter ? "metadata" : "none"}
        className="pointer-events-none absolute inset-0 h-full min-h-full w-full min-w-full max-w-none rounded-[1.45rem] object-cover sm:rounded-[1.55rem]"
      />
    );
  }

  return (
    <img
      src={item.url}
      alt={item.title}
      loading={isCenter ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={isCenter ? "high" : "auto"}
      className="pointer-events-none absolute inset-0 h-full min-h-full w-full min-w-full max-w-none rounded-[1.45rem] object-cover sm:rounded-[1.55rem]"
    />
  );
};

const FeaturedMemoriesSection = ({
  featuredGallery = [],
  galleryLoading = false,
}) => {
  const sectionRef = useRef(null);
  const galleryCardRef = useRef(null);
  const hasResetForCurrentView = useRef(false);
  const lastWheelTime = useRef(0);
  const autoSlideTimer = useRef(null);

  const { offsets: visibleOffsets, gap: railGap } = useResponsiveRail();

  const sectionInView = useInView(sectionRef, {
    amount: 0.2,
    once: false,
    margin: "-40px 0px -80px 0px",
  });

  const galleryReady = useInView(galleryCardRef, {
    amount: 0.62,
    once: false,
    margin: "-30px 0px -30px 0px",
  });

  const memories = useMemo(() => {
    return featuredGallery.slice(0, 8).map((item, index) => ({
      id: item._id || item.id || index,
      title: item.title || "Beautiful Memory",
      description:
        item.description ||
        (item.type === "video"
          ? "A living memory from our celebration."
          : "A beautiful captured moment."),
      url: item.url,
      type: item.type || "photo",
      category: item.category || (item.type === "video" ? "Video" : "Photo"),
      href: "/gallery",
    }));
  }, [featuredGallery]);

  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const count = memories.length;
  const activeIndex = count > 0 ? wrap(0, count, active) : 0;
  const activeItem = memories[activeIndex];

  const handlePrev = useCallback(() => {
    if (count <= 1) return;
    setActive((previous) => previous - 1);
  }, [count]);

  const handleNext = useCallback(() => {
    if (count <= 1) return;
    setActive((previous) => previous + 1);
  }, [count]);

  useEffect(() => {
    if (!galleryReady) {
      hasResetForCurrentView.current = false;
      clearTimeout(autoSlideTimer.current);
      return;
    }

    if (count > 0 && !hasResetForCurrentView.current) {
      clearTimeout(autoSlideTimer.current);
      setActive(0);
      hasResetForCurrentView.current = true;
      lastWheelTime.current = 0;
    }
  }, [galleryReady, count]);

  useEffect(() => {
    clearTimeout(autoSlideTimer.current);

    if (
      count <= 1 ||
      isHovering ||
      !galleryReady ||
      !hasResetForCurrentView.current ||
      !activeItem
    ) {
      return undefined;
    }

    const delay =
      activeItem.type === "video"
        ? VIDEO_PREVIEW_DURATION + 800
        : IMAGE_PREVIEW_DURATION + 500;

    autoSlideTimer.current = setTimeout(() => {
      handleNext();
    }, delay);

    return () => {
      clearTimeout(autoSlideTimer.current);
    };
  }, [
    count,
    isHovering,
    galleryReady,
    activeItem?.id,
    activeItem?.type,
    handleNext,
  ]);

  const handleWheel = useCallback(
    (event) => {
      if (count <= 1) return;

      const now = Date.now();

      if (now - lastWheelTime.current < 580) return;

      const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = isHorizontal ? event.deltaX : event.deltaY;

      if (Math.abs(delta) > 40) {
        if (delta > 0) handleNext();
        else handlePrev();

        lastWheelTime.current = now;
      }
    },
    [count, handleNext, handlePrev]
  );

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") handlePrev();
    if (event.key === "ArrowRight") handleNext();
  };

  const swipeConfidenceThreshold = 9000;

  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (_, { offset, velocity }) => {
    if (count <= 1) return;

    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-4 py-10 sm:px-5 sm:py-16 md:px-6 md:py-18 lg:px-8 lg:py-24"
    >
      <div className="absolute inset-0 bg-white" />
      <div className="pointer-events-none absolute left-[8%] top-10 h-56 w-56 rounded-full bg-rose-50 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute right-[8%] bottom-8 h-60 w-60 rounded-full bg-pink-50 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-7 md:gap-10 lg:grid-cols-[0.88fr_1.12fr] xl:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={
              sectionInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0.98, y: 0 }
            }
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 shadow-sm sm:px-5 sm:py-2.5 sm:shadow-lg sm:shadow-rose-100/60">
              <Camera
                size={14}
                className="text-rose-700 sm:h-[15px] sm:w-[15px]"
              />

              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-rose-700 sm:text-xs sm:tracking-[0.35em]">
                Memories
              </span>
            </div>

            <h2 className="mx-auto mt-4 max-w-[330px] text-[2.15rem] font-black leading-[1.02] tracking-tight text-gray-950 min-[390px]:max-w-[365px] min-[390px]:text-[2.35rem] sm:mt-6 sm:max-w-2xl sm:text-5xl md:text-6xl lg:mx-0">
              Moments we will
              <span className="block rose-text-gradient">
                remember forever
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-[330px] text-sm font-medium leading-7 text-gray-600 sm:mt-5 sm:max-w-xl sm:text-lg sm:leading-relaxed lg:mx-0">
              A premium gallery space for our photos, videos, celebrations, and
              beautiful memories.
            </p>

            <div className="mx-auto mt-6 hidden max-w-md grid-cols-2 gap-3 sm:grid sm:mt-8 sm:gap-4 lg:mx-0">
              <div className="rounded-[1.35rem] border border-rose-100 bg-white/85 p-4 shadow-xl shadow-rose-100/50 backdrop-blur-xl sm:rounded-[1.6rem] sm:p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-rose-700 text-white shadow-lg shadow-rose-100 sm:h-11 sm:w-11 sm:rounded-2xl">
                  <ImageIcon size={19} className="sm:h-5 sm:w-5" />
                </div>

                <p className="mt-3 text-xl font-black text-gray-950 sm:mt-4 sm:text-2xl">
                  Photos
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                  Beautiful captures
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-rose-100 bg-white/85 p-4 shadow-xl shadow-rose-100/50 backdrop-blur-xl sm:rounded-[1.6rem] sm:p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gray-950 text-white shadow-lg shadow-gray-200 sm:h-11 sm:w-11 sm:rounded-2xl">
                  <Film size={19} className="sm:h-5 sm:w-5" />
                </div>

                <p className="mt-3 text-xl font-black text-gray-950 sm:mt-4 sm:text-2xl">
                  Videos
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                  Live memories
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center sm:mt-7 lg:mt-8 lg:justify-start">
              <Link
                to="/gallery"
                className="group relative inline-flex min-h-12 w-full max-w-[250px] items-center justify-center gap-3 overflow-hidden rounded-full border border-rose-100 bg-white/90 px-5 py-3 pr-3 text-sm font-black text-rose-700 shadow-sm backdrop-blur-2xl transition duration-300 hover:border-rose-200 hover:bg-rose-700 hover:text-white sm:max-w-[290px] sm:py-3.5 sm:shadow-2xl sm:shadow-rose-100/80 lg:w-auto lg:max-w-none lg:px-6"
              >
                <span className="absolute inset-0 translate-x-[-120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/70 to-transparent transition duration-700 group-hover:translate-x-[130%]" />

                <span className="relative tracking-wide">Explore Gallery</span>

                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700 transition group-hover:bg-white/20 group-hover:text-white sm:h-9 sm:w-9">
                  <ChevronRight size={17} />
                </span>
              </Link>
            </div>
          </motion.div>

          <div>
            {galleryLoading && <LoadingState message="Loading memories..." />}

            {!galleryLoading && memories.length === 0 && (
              <EmptyState
                title="Memories Coming Soon"
                message="Wedding photos and videos will be uploaded here soon."
              />
            )}

            {!galleryLoading && memories.length > 0 && (
              <motion.div
                ref={galleryCardRef}
                initial={{ opacity: 0, y: 30, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-[680px] lg:max-w-none"
              >
                <div className="absolute -inset-2 rounded-[2.1rem] bg-white/60 blur-xl sm:-inset-5 sm:rounded-[3.2rem] sm:blur-2xl" />

                <div
                  className="group relative flex h-[430px] w-full select-none flex-col overflow-hidden rounded-[1.75rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50/35 to-pink-50/45 text-gray-950 shadow-[0_18px_55px_rgba(190,18,60,0.08)] outline-none sm:h-[590px] sm:rounded-[2.4rem] md:h-[610px] md:rounded-[2.6rem] lg:h-[620px] lg:rounded-[2.8rem]"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  onWheel={handleWheel}
                  style={{
                    contain: "layout paint style",
                    transform: "translateZ(0)",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`soft-bg-${activeItem?.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        {activeItem?.url && (
                          <img
                            src={activeItem.url}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full scale-110 object-cover opacity-[0.08] blur-3xl"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/72 to-white/92" />
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white to-transparent" />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/78 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-rose-700 shadow-sm backdrop-blur-xl sm:left-6 sm:top-6 sm:px-4 sm:text-[10px] sm:tracking-[0.26em] sm:shadow-lg sm:shadow-rose-100">
                    <Sparkles size={12} className="sm:h-[13px] sm:w-[13px]" />
                    Focus Gallery
                  </div>

                  <div className="relative z-10 flex h-full flex-col px-3 pb-5 pt-14 sm:px-5 sm:pb-6 sm:pt-20 md:px-7 md:pb-7 lg:px-8">
                    <motion.div
                      className="relative mx-auto flex h-[260px] w-full max-w-6xl shrink-0 cursor-grab items-center justify-center overflow-visible active:cursor-grabbing sm:h-[350px] md:h-[365px] lg:h-[370px]"
                      style={{
                        perspective: 1200,
                        transform: "translateZ(0)",
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.16}
                      onDragEnd={handleDragEnd}
                    >
                      {visibleOffsets.map((offset) => {
                        const absoluteIndex = active + offset;
                        const index = wrap(0, count, absoluteIndex);
                        const item = memories[index];

                        const isCenter = offset === 0;
                        const distance = Math.abs(offset);

                        const xOffset = offset * railGap;
                        const zOffset = isCenter ? 0 : -distance * 110;
                        const scale = isCenter ? 1 : 0.84;
                        const rotateY = isCenter ? 0 : offset * -8;
                        const opacity = isCenter
                          ? 1
                          : Math.max(0.2, 1 - distance * 0.44);

                        const sideFilter = isCenter
                          ? "blur(0px)"
                          : `blur(${distance * 4.5}px)`;

                        return (
                          <motion.div
                            key={`${item.id}-${absoluteIndex}`}
                            className={cn(
                              "absolute aspect-[3/4] w-[170px] rounded-[1.45rem] border border-white/70 bg-white shadow-xl min-[390px]:w-[184px] sm:w-[226px] sm:rounded-[1.6rem] sm:shadow-2xl md:w-[240px] lg:w-[248px] xl:w-[260px]",
                              isCenter
                                ? "z-20 shadow-[0_16px_42px_rgba(15,23,42,0.14)]"
                                : "z-10 cursor-pointer shadow-[0_12px_35px_rgba(15,23,42,0.08)]"
                            )}
                            initial={false}
                            animate={{
                              x: xOffset,
                              z: zOffset,
                              scale,
                              rotateY,
                              opacity,
                              filter: sideFilter,
                            }}
                            transition={(valueName) => {
                              if (valueName === "scale") return TAP_SPRING;
                              return BASE_SPRING;
                            }}
                            style={{
                              transformStyle: "flat",
                              willChange: isCenter ? "transform" : "auto",
                              WebkitFontSmoothing: "antialiased",
                              MozOsxFontSmoothing: "grayscale",
                            }}
                            onClick={() => {
                              if (!isCenter) {
                                setActive((previous) => previous + offset);
                              }
                            }}
                          >
                            <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-rose-50 sm:rounded-[1.55rem]">
                              <RailMedia
                                item={item}
                                isCenter={isCenter}
                                activeKey={active}
                                galleryReady={galleryReady}
                              />

                              {!isCenter && (
                                <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-white/44 sm:rounded-[1.55rem]" />
                              )}

                              <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-gradient-to-b from-white/5 via-transparent to-gray-950/30 sm:rounded-[1.55rem]" />

                              {item.type === "video" && (
                                <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/25 text-white shadow-sm backdrop-blur-xl sm:left-4 sm:top-4 sm:h-11 sm:w-11">
                                  <Play size={16} fill="white" />
                                </div>
                              )}

                              {isCenter && (
                                <div className="absolute bottom-3 left-3 right-3 rounded-[1rem] border border-white/20 bg-black/62 p-3 text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:bottom-4 sm:left-4 sm:right-4 sm:rounded-[1.25rem] sm:p-4">
                                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white antialiased drop-shadow-none sm:text-[10px] sm:tracking-[0.26em]">
                                    {item.category}
                                  </p>

                                  <h3 className="mt-1 line-clamp-1 text-[1rem] font-black leading-tight text-white antialiased drop-shadow-none sm:text-xl">
                                    {item.title}
                                  </h3>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    <div className="mx-auto mt-4 flex w-full max-w-4xl flex-1 flex-col items-center justify-end gap-3 sm:mt-5 sm:justify-between sm:gap-4 md:flex-row lg:mt-5">
                      <div className="hidden min-w-0 flex-1 flex-col items-center justify-center text-center sm:flex md:items-start md:text-left">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeItem?.id}
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -8,
                            }}
                            transition={{ duration: 0.24, ease: "easeOut" }}
                            className="w-full space-y-1.5"
                          >
                            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-700 shadow-sm backdrop-blur-xl sm:px-4 sm:tracking-[0.24em]">
                              {activeItem?.type === "video" ? (
                                <Film size={12} />
                              ) : (
                                <Camera size={12} />
                              )}
                              <span className="truncate">
                                {activeItem?.category}
                              </span>
                            </span>

                            <h2 className="max-w-[390px] truncate text-[1.55rem] font-black leading-[1.05] tracking-tight text-gray-950 sm:max-w-[410px] sm:text-[1.75rem] md:text-[1.95rem] lg:text-[2.05rem]">
                              {activeItem?.title}
                            </h2>

                            {activeItem?.description && (
                              <p className="line-clamp-1 max-w-[390px] text-sm leading-5 text-gray-600 sm:max-w-[410px] sm:text-[15px]">
                                {activeItem.description}
                              </p>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1 rounded-full border border-rose-100 bg-white/88 p-1 shadow-sm backdrop-blur-xl sm:shadow-xl sm:shadow-rose-100/60">
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="rounded-full p-3 text-rose-700 transition hover:bg-rose-50 active:scale-95"
                            aria-label="Previous memory"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          <span className="min-w-[44px] text-center text-xs font-black text-gray-500 sm:min-w-[48px]">
                            {activeIndex + 1} / {count}
                          </span>

                          <button
                            type="button"
                            onClick={handleNext}
                            className="rounded-full p-3 text-rose-700 transition hover:bg-rose-50 active:scale-95"
                            aria-label="Next memory"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>

                        <Link
                          to="/gallery"
                          className="group hidden items-center gap-2 rounded-full bg-rose-700 px-5 py-3 text-sm font-black text-white shadow-xl shadow-rose-200 transition hover:bg-rose-800 active:scale-95 sm:flex"
                        >
                          View
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMemoriesSection;