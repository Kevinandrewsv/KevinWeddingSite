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

const PRELOAD_TIMEOUT = 1800;

const wrap = (min, max, value) => {
  const rangeSize = max - min;
  return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const BASE_SPRING = {
  type: "spring",
  stiffness: 230,
  damping: 38,
  mass: 0.85,
};

const TAP_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.85,
};

const MOBILE_SPRING = {
  type: "spring",
  stiffness: 245,
  damping: 40,
  mass: 0.85,
};

const MEDIA_FILL_STYLE = {
  width: "100%",
  height: "100%",
  minWidth: "100%",
  minHeight: "100%",
  maxWidth: "none",
  maxHeight: "none",
  objectFit: "cover",
  objectPosition: "center center",
  transform: "translate3d(0,0,0) scale(1.01)",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const normalizeType = (type) => {
  const normalized = String(type || "").toLowerCase();
  return normalized.includes("video") ? "video" : "photo";
};

const useResponsiveRail = () => {
  const getConfig = useCallback(() => {
    if (typeof window === "undefined") {
      return {
        offsets: [-1, 0, 1],
        gap: 242,
        isMobile: false,
      };
    }

    const width = window.innerWidth;

    if (width < 640) {
      return {
        offsets: [-1, 0, 1],
        gap: 155,
        isMobile: true,
      };
    }

    if (width < 1024) {
      return {
        offsets: [-1, 0, 1],
        gap: 205,
        isMobile: false,
      };
    }

    return {
      offsets: [-1, 0, 1],
      gap: 242,
      isMobile: false,
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

const useMediaPreloader = () => {
  const loadedRef = useRef(new Set());
  const loadingRef = useRef(new Map());

  const preloadMedia = useCallback((item, mode = "safe") => {
    if (!item?.url || typeof window === "undefined") {
      return Promise.resolve(false);
    }

    const key = `${item.id}-${item.url}-${mode}`;

    if (loadedRef.current.has(key)) {
      return Promise.resolve(true);
    }

    if (loadingRef.current.has(key)) {
      return loadingRef.current.get(key);
    }

    const promise = new Promise((resolve) => {
      let settled = false;

      const finish = () => {
        if (settled) return;

        settled = true;
        loadedRef.current.add(key);
        loadingRef.current.delete(key);
        resolve(true);
      };

      const fallback = window.setTimeout(finish, PRELOAD_TIMEOUT);

      if (item.type === "video") {
        const video = document.createElement("video");

        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.preload = mode === "center" ? "auto" : "metadata";
        video.src = item.url;

        video.onloadedmetadata = () => {
          window.clearTimeout(fallback);
          finish();
        };

        video.onloadeddata = () => {
          if (mode === "center") {
            window.clearTimeout(fallback);
            finish();
          }
        };

        video.oncanplay = () => {
          if (mode === "center") {
            window.clearTimeout(fallback);
            finish();
          }
        };

        video.onerror = () => {
          window.clearTimeout(fallback);
          finish();
        };

        video.load();
        return;
      }

      const image = new Image();

      image.decoding = "async";
      image.src = item.url;

      image.onload = async () => {
        try {
          if (image.decode) {
            await image.decode();
          }
        } catch {
          // Image is still usable even if decode fails.
        }

        window.clearTimeout(fallback);
        finish();
      };

      image.onerror = () => {
        window.clearTimeout(fallback);
        finish();
      };
    });

    loadingRef.current.set(key, promise);
    return promise;
  }, []);

  return preloadMedia;
};

const RailMedia = ({ item, isCenter, playReady, shouldPreload }) => {
  const videoRef = useRef(null);
  const retryTimerRef = useRef(null);
  const playAttemptRef = useRef(0);
  const [videoReady, setVideoReady] = useState(false);

  const isVideo = item?.type === "video";
  const shouldPlayVideo = isVideo && isCenter && playReady;

  const clearRetryTimer = useCallback(() => {
    clearTimeout(retryTimerRef.current);
  }, []);

  const forceVideoAttributes = useCallback((video) => {
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }, []);

  useEffect(() => {
    setVideoReady(false);
    playAttemptRef.current = 0;
    clearRetryTimer();
  }, [item?.id, item?.url, item?.type, clearRetryTimer]);

  const playCenterVideo = useCallback(() => {
    const video = videoRef.current;

    if (!video || !shouldPlayVideo) return;

    clearRetryTimer();
    forceVideoAttributes(video);
    setVideoReady(true);

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        playAttemptRef.current += 1;

        if (playAttemptRef.current <= 16) {
          retryTimerRef.current = setTimeout(() => {
            playCenterVideo();
          }, 220);
        }
      });
    }
  }, [shouldPlayVideo, clearRetryTimer, forceVideoAttributes]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isVideo) return undefined;

    const pauseSideVideo = () => {
      clearRetryTimer();

      try {
        video.pause();
      } catch {
        // Ignore pause issue.
      }

      if (!isCenter) {
        try {
          video.currentTime = 0;
        } catch {
          // Ignore currentTime before metadata.
        }
      }
    };

    const handleReady = () => {
      setVideoReady(true);

      if (shouldPlayVideo) {
        requestAnimationFrame(playCenterVideo);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && shouldPlayVideo) {
        requestAnimationFrame(playCenterVideo);
      }
    };

    const firstPlayTimer = setTimeout(() => {
      if (shouldPlayVideo) playCenterVideo();
    }, 80);

    const secondPlayTimer = setTimeout(() => {
      if (shouldPlayVideo) playCenterVideo();
    }, 420);

    forceVideoAttributes(video);

    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("playing", handleReady);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (shouldPlayVideo) {
      requestAnimationFrame(playCenterVideo);
    } else {
      pauseSideVideo();
    }

    return () => {
      clearTimeout(firstPlayTimer);
      clearTimeout(secondPlayTimer);
      clearRetryTimer();

      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("playing", handleReady);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      try {
        video.pause();
      } catch {
        // Ignore pause issue.
      }
    };
  }, [
    isVideo,
    isCenter,
    shouldPlayVideo,
    playCenterVideo,
    clearRetryTimer,
    forceVideoAttributes,
    item?.id,
    item?.url,
  ]);

  if (!item) return null;

  if (isVideo) {
    return (
      <>
        <div className="absolute inset-0 rounded-[1.45rem] bg-white sm:rounded-[1.55rem]" />

        <video
          key={item.url}
          ref={videoRef}
          src={item.url}
          muted
          defaultMuted
          playsInline
          autoPlay={shouldPlayVideo}
          loop
          disablePictureInPicture
          controls={false}
          preload={isCenter ? "auto" : shouldPreload ? "metadata" : "none"}
          onLoadedMetadata={() => {
            setVideoReady(true);
            playCenterVideo();
          }}
          onLoadedData={() => {
            setVideoReady(true);
            playCenterVideo();
          }}
          onCanPlay={() => {
            setVideoReady(true);
            playCenterVideo();
          }}
          onPlaying={() => setVideoReady(true)}
          className={cn(
            "pointer-events-none absolute inset-0 block rounded-[1.45rem] transition-opacity duration-200 sm:rounded-[1.55rem]",
            videoReady || isCenter ? "opacity-100" : "opacity-0"
          )}
          style={MEDIA_FILL_STYLE}
        />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 rounded-[1.45rem] bg-white sm:rounded-[1.55rem]" />

      <img
        src={item.url}
        alt={item.title}
        loading={isCenter || shouldPreload ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isCenter ? "high" : "auto"}
        className="pointer-events-none absolute inset-0 block rounded-[1.45rem] sm:rounded-[1.55rem]"
        style={MEDIA_FILL_STYLE}
      />
    </>
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
  const activeRef = useRef(0);

  const preloadMedia = useMediaPreloader();
  const { offsets: visibleOffsets, gap: railGap, isMobile } = useResponsiveRail();

  const sectionInView = useInView(sectionRef, {
    amount: isMobile ? 0.18 : 0.28,
    once: false,
    margin: isMobile ? "0px 0px -30px 0px" : "-20px 0px -80px 0px",
  });

  const galleryReady = useInView(galleryCardRef, {
    amount: isMobile ? 0.18 : 0.72,
    once: false,
    margin: isMobile ? "0px 0px -20px 0px" : "-10px 0px -70px 0px",
  });

  const playReady = sectionInView || galleryReady;

  const memories = useMemo(() => {
    return featuredGallery.slice(0, 8).map((item, index) => {
      const type = normalizeType(item.type);

      return {
        id: item._id || item.id || index,
        title: item.title || "Beautiful Memory",
        description:
          item.description ||
          (type === "video"
            ? "A living memory from our celebration."
            : "A beautiful captured moment."),
        url: item.url,
        type,
        category: item.category || (type === "video" ? "Video" : "Photo"),
        href: "/gallery",
      };
    });
  }, [featuredGallery]);

  const [active, setActive] = useState(0);

  const count = memories.length;
  const activeIndex = count > 0 ? wrap(0, count, active) : 0;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const preloadAroundActive = useCallback(
    (targetActive) => {
      if (count <= 0) return;

      const centerItem = memories[wrap(0, count, targetActive)];
      preloadMedia(centerItem, "center");

      [-1, 1].forEach((offset) => {
        const item = memories[wrap(0, count, targetActive + offset)];
        preloadMedia(item, "safe");
      });
    },
    [count, memories, preloadMedia]
  );

  const goToSlide = useCallback(
    (nextActive) => {
      if (count <= 1) return;

      preloadAroundActive(nextActive);
      activeRef.current = nextActive;
      setActive(nextActive);
    },
    [count, preloadAroundActive]
  );

  const handlePrev = useCallback(() => {
    goToSlide(activeRef.current - 1);
  }, [goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(activeRef.current + 1);
  }, [goToSlide]);

  useEffect(() => {
    if (!playReady) {
      hasResetForCurrentView.current = false;
      lastWheelTime.current = 0;
      return;
    }

    if (count > 0 && !hasResetForCurrentView.current) {
      activeRef.current = 0;
      setActive(0);
      hasResetForCurrentView.current = true;
      lastWheelTime.current = 0;

      preloadAroundActive(0);
    }
  }, [playReady, count, preloadAroundActive]);

  useEffect(() => {
    if (!playReady || count <= 0) return;

    preloadAroundActive(activeIndex);
  }, [playReady, count, activeIndex, preloadAroundActive]);

  const handleWheel = useCallback(
    (event) => {
      if (count <= 1 || !playReady || isMobile) return;

      const isIntentionalRailScroll =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;

      if (!isIntentionalRailScroll) return;

      event.preventDefault();

      const now = Date.now();

      if (now - lastWheelTime.current < 650) return;

      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (Math.abs(delta) > 52) {
        if (delta > 0) handleNext();
        else handlePrev();

        lastWheelTime.current = now;
      }
    },
    [count, playReady, isMobile, handleNext, handlePrev]
  );

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") handlePrev();
    if (event.key === "ArrowRight") handleNext();
  };

  const swipeConfidenceThreshold = isMobile ? 5600 : 9000;

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
      className="relative overflow-hidden bg-white px-4 py-10 sm:px-5 sm:py-14 md:px-6 md:py-16 lg:px-8 lg:py-16 xl:py-18"
    >
      <div className="absolute inset-0 bg-white" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[0.88fr_1.12fr] xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={
              sectionInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0.98, y: 0 }
            }
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
                initial={{ opacity: 0, y: 26, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-[680px] lg:max-w-none"
              >
                <div
                  className="group relative flex h-[420px] w-full select-none flex-col overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white text-gray-950 shadow-[0_10px_26px_rgba(15,23,42,0.045)] outline-none sm:h-[545px] sm:rounded-[2.4rem] sm:shadow-[0_12px_34px_rgba(15,23,42,0.055)] md:h-[570px] md:rounded-[2.6rem] lg:h-[560px] lg:rounded-[2.8rem] xl:h-[575px]"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  onWheel={handleWheel}
                  style={{
                    contain: "layout paint style",
                    transform: "translate3d(0,0,0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-white" />

                    <div className="absolute left-8 right-8 top-[5.05rem] h-px bg-gradient-to-r from-transparent via-rose-100/80 to-transparent sm:hidden" />
                    <div className="absolute bottom-[5.2rem] left-10 right-10 h-px bg-gradient-to-r from-transparent via-rose-100/70 to-transparent sm:hidden" />

                    <div className="absolute left-6 top-[6.15rem] h-16 w-16 rounded-full border border-rose-100/50 sm:hidden" />
                    <div className="absolute right-7 bottom-[6.05rem] h-14 w-14 rounded-full border border-pink-100/60 sm:hidden" />

                    <div className="absolute right-9 top-[5.9rem] h-1.5 w-1.5 rounded-full bg-rose-300/70 sm:hidden" />
                    <div className="absolute left-12 bottom-[6.35rem] h-1.5 w-1.5 rounded-full bg-pink-300/60 sm:hidden" />
                  </div>

                  <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white/90 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-rose-700 shadow-sm backdrop-blur-xl sm:left-6 sm:top-6 sm:px-4 sm:text-[10px] sm:tracking-[0.26em]">
                    <Sparkles size={12} className="sm:h-[13px] sm:w-[13px]" />
                    Focus Gallery
                  </div>

                  <div className="relative z-10 flex h-full flex-col px-3 pb-4 pt-14 sm:px-5 sm:pb-5 sm:pt-19 md:px-7 md:pb-6 md:pt-20 lg:px-8">
                    <motion.div
                      className="relative mx-auto flex h-[275px] w-full max-w-6xl shrink-0 cursor-grab items-center justify-center overflow-visible active:cursor-grabbing sm:h-[365px] md:h-[385px] lg:h-[370px] xl:h-[382px]"
                      style={{
                        perspective: isMobile ? 700 : 1100,
                        transform: "translate3d(0,0,0)",
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={isMobile ? 0.08 : 0.14}
                      onDragEnd={handleDragEnd}
                    >
                      {visibleOffsets.map((offset) => {
                        const absoluteIndex = active + offset;
                        const index = wrap(0, count, absoluteIndex);
                        const item = memories[index];

                        const isCenter = offset === 0;
                        const distance = Math.abs(offset);

                        const xOffset = offset * railGap;
                        const zOffset = isMobile
                          ? 0
                          : isCenter
                            ? 0
                            : -distance * 90;

                        const scale = isCenter ? 1 : 0.86;
                        const rotateY = isMobile ? 0 : isCenter ? 0 : offset * -7;
                        const opacity = isCenter
                          ? 1
                          : Math.max(0.42, 1 - distance * 0.38);

                        return (
                          <motion.div
                            key={`${item.id}-${absoluteIndex}`}
                            className={cn(
                              "absolute aspect-[3/4] w-[172px] rounded-[1.45rem] border border-white/70 bg-white shadow-xl min-[390px]:w-[184px] sm:w-[228px] sm:rounded-[1.6rem] sm:shadow-2xl md:w-[244px] lg:w-[250px] xl:w-[258px]",
                              isCenter
                                ? "z-20 shadow-[0_12px_30px_rgba(15,23,42,0.12)] sm:shadow-[0_14px_36px_rgba(15,23,42,0.13)]"
                                : "z-10 cursor-pointer shadow-[0_7px_16px_rgba(15,23,42,0.06)] sm:shadow-[0_8px_20px_rgba(15,23,42,0.07)]"
                            )}
                            initial={false}
                            animate={{
                              x: xOffset,
                              z: zOffset,
                              scale,
                              rotateY,
                              opacity,
                            }}
                            transition={(valueName) => {
                              if (isMobile) return MOBILE_SPRING;
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
                                goToSlide(activeRef.current + offset);
                              }
                            }}
                          >
                            <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-white sm:rounded-[1.55rem]">
                              <RailMedia
                                item={item}
                                isCenter={isCenter}
                                playReady={playReady}
                                shouldPreload={Math.abs(offset) <= 1}
                              />

                              {!isCenter && (
                                <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-white/42 sm:rounded-[1.55rem]" />
                              )}

                              <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-gradient-to-b from-white/5 via-transparent to-gray-950/30 sm:rounded-[1.55rem]" />

                              {item.type === "video" && (
                                <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/25 text-white shadow-sm backdrop-blur-xl sm:left-4 sm:top-4 sm:h-11 sm:w-11">
                                  <Play size={16} fill="white" />
                                </div>
                              )}

                              {isCenter && (
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={`${item.id}-${activeIndex}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-3 left-3 right-3 rounded-[1rem] border border-white/20 bg-black/62 p-3 text-white shadow-[0_7px_16px_rgba(0,0,0,0.14)] backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4 sm:rounded-[1.25rem] sm:p-4 sm:shadow-[0_8px_20px_rgba(0,0,0,0.16)] sm:backdrop-blur-xl"
                                  >
                                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white antialiased drop-shadow-none sm:text-[10px] sm:tracking-[0.26em]">
                                      {item.category}
                                    </p>

                                    <h3 className="mt-1 line-clamp-1 text-[1rem] font-black leading-tight text-white antialiased drop-shadow-none sm:text-xl">
                                      {item.title}
                                    </h3>
                                  </motion.div>
                                </AnimatePresence>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    <div className="mx-auto flex w-full max-w-4xl flex-1 items-end justify-center gap-3 pt-3 sm:pt-4 md:justify-end lg:pt-3">
                      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1 rounded-full border border-gray-100 bg-white/95 p-1 shadow-sm backdrop-blur-md sm:backdrop-blur-xl">
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