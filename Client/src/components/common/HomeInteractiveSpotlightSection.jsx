import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Crown,
  Gem,
  Heart,
  HeartHandshake,
  Loader2,
  MessageCircleHeart,
  Quote,
  Sparkles,
  Star,
  Trophy,
  Vote,
  WandSparkles,
} from "lucide-react";

import { useApprovedCircleStories } from "../../hooks/useCircleOfLove";
import { usePublicPolls } from "../../hooks/usePolls";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const createVisitorId = () => {
  if (typeof window === "undefined") return "";

  const key = "wedding_poll_guest_id";
  const existingId = window.localStorage.getItem(key);

  if (existingId) return existingId;

  const randomPart =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const newId = `guest-${randomPart}`;
  window.localStorage.setItem(key, newId);

  return newId;
};

const sideTheme = {
  groom: {
    label: "Kevin Side",
    fullLabel: "Kevin's Circle",
    icon: Crown,
    badgeClass: "border-blue-100 bg-blue-50 text-blue-700",
    iconClass: "from-blue-500 via-sky-500 to-cyan-400",
    glowClass: "bg-blue-100/60",
    softClass: "from-white via-white to-blue-50/55",
  },
  bride: {
    label: "Jenith Side",
    fullLabel: "Jenith's Circle",
    icon: Gem,
    badgeClass: "border-pink-100 bg-pink-50 text-pink-700",
    iconClass: "from-pink-500 via-rose-500 to-fuchsia-400",
    glowClass: "bg-pink-100/55",
    softClass: "from-white via-white to-rose-50/55",
  },
  both: {
    label: "Both Sides",
    fullLabel: "Loved by Both",
    icon: HeartHandshake,
    badgeClass: "border-rose-100 bg-rose-50 text-rose-700",
    iconClass: "from-rose-500 via-red-500 to-pink-500",
    glowClass: "bg-rose-100/55",
    softClass: "from-white via-white to-slate-50",
  },
};

const getInitials = (name = "Guest") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") || "G";

const getPreviewText = (text = "", limit = 150) => {
  const cleanedText = text.trim();

  if (cleanedText.length <= limit) return cleanedText;

  return `${cleanedText.slice(0, limit).trim()}...`;
};

const wrapIndex = (value, length) => {
  if (length <= 0) return 0;
  return ((value % length) + length) % length;
};

const signedOffset = (index, active, length, loop) => {
  const raw = index - active;

  if (!loop || length <= 1) return raw;

  const alternate = raw > 0 ? raw - length : raw + length;

  return Math.abs(alternate) < Math.abs(raw) ? alternate : raw;
};

const useResponsiveCardSize = () => {
  const [size, setSize] = useState({
    width: 430,
    height: 318,
  });

  useEffect(() => {
    const updateSize = () => {
      if (typeof window === "undefined") return;

      const viewport = window.innerWidth;

      if (viewport < 420) {
        setSize({ width: 282, height: 340 });
        return;
      }

      if (viewport < 640) {
        setSize({ width: 320, height: 334 });
        return;
      }

      if (viewport < 1024) {
        setSize({ width: 390, height: 325 });
        return;
      }

      setSize({ width: 430, height: 318 });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};

const CardStack = ({
  items,
  renderCard,
  initialIndex = 0,
  maxVisible = 7,
  overlap = 0.55,
  spreadDeg = 34,
  perspectivePx = 1100,
  depthPx = 80,
  tiltXDeg = 7,
  activeLiftPx = 18,
  activeScale = 1.02,
  inactiveScale = 0.93,
  springStiffness = 280,
  springDamping = 29,
  loop = true,
  autoAdvance = true,
  intervalMs = 2900,
  pauseOnHover = true,
  showDots = true,
}) => {
  const reduceMotion = useReducedMotion();
  const { width: cardWidth, height: cardHeight } = useResponsiveCardSize();
  const length = items.length;

  const [active, setActive] = useState(() => wrapIndex(initialIndex, length));
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setActive((current) => wrapIndex(current, length));
  }, [length]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(16, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < length - 1;

  const previous = () => {
    if (!length || !canGoPrev) return;
    setActive((current) => wrapIndex(current - 1, length));
  };

  const next = () => {
    if (!length || !canGoNext) return;
    setActive((current) => wrapIndex(current + 1, length));
  };

  useEffect(() => {
    if (!autoAdvance || reduceMotion || !length) return undefined;
    if (pauseOnHover && hovering) return undefined;

    const interval = window.setInterval(() => {
      if (loop || active < length - 1) {
        next();
      }
    }, Math.max(900, intervalMs));

    return () => window.clearInterval(interval);
  }, [
    active,
    autoAdvance,
    hovering,
    intervalMs,
    length,
    loop,
    pauseOnHover,
    reduceMotion,
  ]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") previous();
    if (event.key === "ArrowRight") next();
  };

  if (!length) return null;

  return (
    <div
      className="w-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="relative w-full bg-white outline-none"
        style={{ height: Math.max(388, cardHeight + 76) }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          onClick={previous}
          className="absolute left-1 top-1/2 z-[150] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-rose-100 bg-white/95 text-rose-700 shadow-lg shadow-rose-100 transition hover:-translate-x-0.5 hover:bg-rose-50 sm:flex"
          aria-label="Previous featured story"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={next}
          className="absolute right-1 top-1/2 z-[150] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-rose-100 bg-white/95 text-rose-700 shadow-lg shadow-rose-100 transition hover:translate-x-0.5 hover:bg-rose-50 sm:flex"
          aria-label="Next featured story"
        >
          <ArrowRight size={18} />
        </button>

        <div
          className="absolute inset-0 flex items-end justify-center bg-white px-1 pb-1"
          style={{ perspective: `${perspectivePx}px`, overflow: "visible" }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const offset = signedOffset(index, active, length, loop);
              const absoluteOffset = Math.abs(offset);
              const visible = absoluteOffset <= maxOffset;

              if (!visible) return null;

              const isActive = offset === 0;
              const rotateZ = offset * stepDeg;
              const x = offset * cardSpacing;
              const y = absoluteOffset * 11;
              const z = -absoluteOffset * depthPx;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - absoluteOffset;

              const dragProps = isActive
                ? {
                    drag: "x",
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (_event, info) => {
                      if (reduceMotion) return;

                      const travel = info.offset.x;
                      const velocity = info.velocity.x;
                      const threshold = Math.min(130, cardWidth * 0.24);

                      if (travel > threshold || velocity > 620) {
                        previous();
                      } else if (travel < -threshold || velocity < -620) {
                        next();
                      }
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 overflow-hidden rounded-[2rem] border border-rose-100 bg-white will-change-transform select-none",
                    isActive
                      ? "cursor-grab active:cursor-grabbing shadow-[0_28px_80px_rgba(190,18,60,0.16)]"
                      : "cursor-pointer shadow-[0_18px_44px_rgba(15,23,42,0.08)]"
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: isActive ? 1 : 0.92,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.88,
                    y: y + 40,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(index)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard(item, { active: isActive })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {showDots && (
        <div className="mt-3 flex items-center justify-center gap-2 bg-white">
          {items.map((item, index) => {
            const isActive = index === active;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  isActive
                    ? "w-8 bg-rose-600"
                    : "w-2.5 bg-rose-200 hover:bg-rose-300"
                )}
                aria-label={`Go to featured story ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const FeaturedFanCard = ({ item, active }) => {
  const story = item.story;
  const theme = sideTheme[story.side] || sideTheme.both;
  const Icon = theme.icon;

  const previewLimit = active ? 210 : 95;

  return (
    <div
      className={cn(
        `relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br ${theme.softClass}`,
        !active && "brightness-[0.985]"
      )}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full ${theme.glowClass} blur-3xl`}
      />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-white/90 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.60),rgba(255,255,255,0.92))]" />

      {!active && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-white/30 backdrop-blur-[2.7px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.38),rgba(255,255,255,0.10),rgba(255,255,255,0.32))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/78 via-white/36 to-transparent" />
        </>
      )}

      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col p-5 sm:p-6",
          !active && "select-none"
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div
            className={cn(
              `flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.iconClass} text-white shadow-lg shadow-rose-100`,
              !active && "scale-[0.96] opacity-95"
            )}
          >
            <Icon size={23} />
          </div>

          <Quote
            size={34}
            className={cn(
              "shrink-0 text-rose-200 transition duration-300",
              active ? "scale-110 text-rose-300" : "opacity-70"
            )}
            fill="currentColor"
          />
        </div>

        <div className="mt-5 flex shrink-0 flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${theme.badgeClass}`}
          >
            <Icon size={12} />
            {theme.label}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">
            <Star size={12} fill="currentColor" />
            Featured
          </span>
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-hidden">
          <p
            className={cn(
              "font-bold text-slate-800 transition-all duration-300",
              active
                ? "line-clamp-5 text-[15px] leading-7"
                : "line-clamp-3 text-[14px] leading-6 opacity-85"
            )}
          >
            “{getPreviewText(story.story, previewLimit)}”
          </p>
        </div>

        <div className="mt-5 flex shrink-0 items-center gap-3 border-t border-rose-100 pt-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-rose-700 shadow-md shadow-rose-100">
            {getInitials(story.name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black text-slate-950">
              {story.name || "Guest"}
            </p>
            <p className="truncate text-xs font-bold text-slate-500">
              {story.relationship || story.memoryTag || theme.fullLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StoryStackSkeleton = () => (
  <div className="relative flex min-h-[390px] items-end justify-center rounded-[2rem] border border-white bg-white p-4">
    <div className="relative h-[320px] w-full max-w-[430px] animate-pulse rounded-[2rem] border border-rose-100 bg-white shadow-[0_28px_80px_rgba(190,18,60,0.10)]" />
  </div>
);

const FeaturedCircleOfLove = () => {
  const { data, isLoading, isError } = useApprovedCircleStories();

  const approvedStories = useMemo(() => data?.data || [], [data?.data]);

  const featuredStories = useMemo(() => {
    const featured = approvedStories.filter((story) => story.isFeatured);

    if (featured.length > 0) return featured;

    return approvedStories.slice(0, 5);
  }, [approvedStories]);

  const stackItems = useMemo(
    () =>
      featuredStories.map((story, index) => ({
        id: story._id || `${story.name}-${index}`,
        title: story.name || "Guest",
        description: story.story,
        story,
      })),
    [featuredStories]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-4 sm:rounded-[2.7rem] sm:p-6 lg:p-8"
    >
      <div className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-rose-700 shadow-sm shadow-rose-100/60 backdrop-blur-xl">
            <MessageCircleHeart size={14} />
            Featured Circle of Love
          </span>

          <h2 className="mx-auto mt-5 max-w-3xl font-['Playfair_Display',serif] text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-[3.35rem]">
            Blessings selected from the togetherness wall.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base sm:leading-8">
            Featured messages chosen from the admin panel are presented as a premium
            interactive card stack, keeping the Home page clean while still showing every
            highlighted blessing.
          </p>
        </div>

        <div className="mt-3">
          {isLoading && <StoryStackSkeleton />}

          {!isLoading && stackItems.length > 0 && (
            <div className="relative rounded-[2rem] border border-white bg-white p-2 sm:p-3">
              <div className="relative bg-white">
                <CardStack
                  items={stackItems}
                  maxVisible={Math.min(7, Math.max(3, stackItems.length))}
                  autoAdvance={stackItems.length > 1}
                  intervalMs={3200}
                  showDots={stackItems.length > 1}
                  renderCard={(item, state) => (
                    <FeaturedFanCard item={item} active={state.active} />
                  )}
                />

                <div className="mt-4 flex justify-center bg-white">
                  <Link
                    to="/circle-of-love"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
                  >
                    Explore all
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!isLoading && stackItems.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-rose-200 bg-white p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-700 shadow-lg shadow-rose-100">
                <Heart size={25} fill="currentColor" />
              </div>

              <h3 className="mt-4 text-xl font-black text-slate-950">
                Featured stories will appear here
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-7 text-slate-600">
                Once Circle of Love messages are approved and featured from the admin panel,
                the selected blessings will automatically show on Home.
              </p>
            </div>
          )}

          {isError && (
            <div className="mt-5 rounded-[1.5rem] border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold leading-6 text-amber-800">
              Live Circle of Love highlights could not be loaded right now.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ChampionOrbit = ({
  name,
  votes,
  percentage,
  icon: Icon,
  isWinner,
  side,
}) => {
  const isKevin = side === "kevin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={`relative overflow-hidden rounded-[2rem] border bg-white/90 p-4 backdrop-blur-2xl transition duration-300 ${
        isWinner
          ? "border-rose-200 shadow-[0_24px_65px_rgba(190,18,60,0.14)]"
          : "border-slate-100 shadow-[0_16px_42px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${
          isKevin ? "bg-blue-100" : "bg-pink-100"
        }`}
      />

      <div className="relative flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${
                isKevin ? "#0ea5e9" : "#f43f5e"
              } ${percentage * 3.6}deg, #f1f5f9 0deg)`,
            }}
          />
          <div className="absolute inset-[7px] rounded-full bg-white" />
          <div
            className={`relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ${
              isKevin
                ? "bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-100"
                : "bg-gradient-to-br from-pink-500 to-rose-500 shadow-pink-100"
            }`}
          >
            <Icon size={21} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-black text-slate-950">{name}</p>

            {isWinner && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-amber-700">
                <Trophy size={11} />
                Leading
              </span>
            )}
          </div>

          <p className="mt-1 text-xs font-bold text-slate-500">
            {votes} total votes
          </p>

          <div className="mt-3 flex items-end gap-2">
            <p className="text-4xl font-black leading-none text-slate-950">
              {percentage}%
            </p>
            <p className="pb-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              overall
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OverallPollChampion = () => {
  const [visitorId] = useState(() => createVisitorId());

  const { data, isLoading, isError } = usePublicPolls(visitorId);

  const polls = useMemo(() => data?.data || [], [data?.data]);

  const stats = useMemo(() => {
    const apiStats = data?.stats || {};

    const fallbackStats = polls.reduce(
      (total, poll) => ({
        totalVotes: total.totalVotes + Number(poll.totalVotes || 0),
        kevinVotes: total.kevinVotes + Number(poll.kevinVotes || 0),
        jenithVotes: total.jenithVotes + Number(poll.jenithVotes || 0),
      }),
      {
        totalVotes: 0,
        kevinVotes: 0,
        jenithVotes: 0,
      }
    );

    const totalVotes = Number(apiStats.totalVotes ?? fallbackStats.totalVotes ?? 0);
    const kevinVotes = Number(apiStats.kevinVotes ?? fallbackStats.kevinVotes ?? 0);
    const jenithVotes = Number(apiStats.jenithVotes ?? fallbackStats.jenithVotes ?? 0);

    return {
      totalVotes,
      kevinVotes,
      jenithVotes,
      kevinPercentage: totalVotes ? Math.round((kevinVotes / totalVotes) * 100) : 0,
      jenithPercentage: totalVotes ? Math.round((jenithVotes / totalVotes) * 100) : 0,
    };
  }, [data?.stats, polls]);

  const champion = useMemo(() => {
    if (!stats.totalVotes) {
      return {
        name: "Waiting for votes",
        helper: "Once guests vote, the overall poll champion will appear here.",
        icon: Vote,
        winner: "none",
      };
    }

    if (stats.kevinVotes === stats.jenithVotes) {
      return {
        name: "Kevin & Jenith are tied",
        helper: "Both sides are sharing the spotlight equally right now.",
        icon: Heart,
        winner: "tie",
      };
    }

    return stats.kevinVotes > stats.jenithVotes
      ? {
          name: "Kevin is leading overall",
          helper: "Kevin currently has the higher total across all Couple Polls.",
          icon: Crown,
          winner: "kevin",
        }
      : {
          name: "Jenith is leading overall",
          helper: "Jenith currently has the higher total across all Couple Polls.",
          icon: Gem,
          winner: "jenith",
        };
  }, [stats]);

  const ChampionIcon = champion.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-white px-0 py-8 sm:py-10 lg:py-12"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-100/45 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-6 h-72 w-72 rounded-full bg-pink-100/45 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-rose-700 shadow-sm shadow-rose-100/60 backdrop-blur-xl">
            <BarChart3 size={14} />
            Overall Poll Champion
          </span>

          <h2 className="mx-auto mt-5 max-w-3xl font-['Playfair_Display',serif] text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-[3.35rem]">
            Who is winning the celebration polls?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base sm:leading-8">
            A live overall result from every approved Couple Poll question, shown as
            one clean celebration champion instead of a boxy dashboard.
          </p>
        </div>

        <div className="relative mx-auto mt-9 flex max-w-5xl flex-col items-center">
          <div className="pointer-events-none absolute top-16 h-72 w-72 rounded-full bg-white blur-3xl" />

          <div className="relative flex h-[19rem] w-[19rem] items-center justify-center rounded-full bg-white shadow-[0_30px_90px_rgba(190,18,60,0.12)] sm:h-[22rem] sm:w-[22rem]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 180deg, rgba(14,165,233,0.22), rgba(244,63,94,0.28), rgba(251,191,36,0.18), rgba(14,165,233,0.22))",
              }}
            />

            <div className="absolute inset-[10px] rounded-full bg-white" />

            <div className="absolute -left-3 top-12 hidden min-w-[104px] items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(14,165,233,0.14)] sm:flex">
              <Crown size={18} className="text-blue-600" />
              <span className="text-sm font-black text-slate-700">
                {stats.kevinPercentage || 0}%
              </span>
            </div>

            <div className="absolute -right-3 bottom-14 hidden min-w-[104px] items-center justify-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(244,63,94,0.14)] sm:flex">
              <Gem size={18} className="text-rose-600" />
              <span className="text-sm font-black text-slate-700">
                {stats.jenithPercentage || 0}%
              </span>
            </div>

            <div className="relative z-10 flex h-[15.5rem] w-[15.5rem] flex-col items-center justify-center rounded-full border border-rose-100 bg-white px-5 text-center shadow-inner shadow-rose-50 sm:h-[18rem] sm:w-[18rem]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl shadow-slate-200">
                {isLoading ? (
                  <Loader2 size={27} className="animate-spin" />
                ) : (
                  <ChampionIcon size={29} />
                )}
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-rose-600">
                Current result
              </p>

              <h3 className="mt-2 max-w-[13rem] text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                {champion.name}
              </h3>

              <p className="mt-3 max-w-[13rem] text-xs font-bold leading-5 text-slate-500 sm:text-sm sm:leading-6">
                {champion.helper}
              </p>

              <div className="mt-5 rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-700">
                {stats.totalVotes || 0} total votes
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
          <ChampionOrbit
            name="Kevin"
            votes={stats.kevinVotes || 0}
            percentage={stats.kevinPercentage || 0}
            icon={Crown}
            side="kevin"
            isWinner={stats.totalVotes > 0 && stats.kevinVotes >= stats.jenithVotes}
          />

          <ChampionOrbit
            name="Jenith"
            votes={stats.jenithVotes || 0}
            percentage={stats.jenithPercentage || 0}
            icon={Gem}
            side="jenith"
            isWinner={stats.totalVotes > 0 && stats.jenithVotes > stats.kevinVotes}
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/couple-polls"
            className="group inline-flex items-center gap-3 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
          >
            Vote in Couple Polls
            <ArrowRight
              size={17}
              className="transition duration-300 group-hover:translate-x-1"
            />
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-5 py-3 text-xs font-black text-slate-500 shadow-sm shadow-rose-100/50">
            <Sparkles size={15} className="text-rose-500" />
            {data?.count || polls.length || 0} live polls
          </div>
        </div>

        {isError && (
          <div className="mx-auto mt-6 max-w-2xl rounded-[1.35rem] border border-amber-100 bg-amber-50 px-4 py-3 text-center text-sm font-bold leading-6 text-amber-800">
            Live poll result could not be loaded right now.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const HomeInteractiveSpotlightSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white px-4 py-12 sm:px-5 sm:py-14 md:px-6 lg:px-4 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-white" />
      <div className="pointer-events-none absolute bottom-20 right-0 h-80 w-80 rounded-full bg-slate-100/80 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-9 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">
            <WandSparkles size={14} />
            Togetherness highlights
          </span>

          <h2 className="mt-4 font-['Playfair_Display',serif] text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Live moments from the celebration
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
            Featured memories from Circle of Love and the overall winner from Couple Polls,
            shown directly from the admin-controlled wedding experience.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:gap-10">
          <FeaturedCircleOfLove />
          <OverallPollChampion />
        </div>
      </div>
    </section>
  );
};

export default HomeInteractiveSpotlightSection;