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
  Loader2,
  MessageCircleHeart,
  Sparkles,
  Trophy,
  Vote,
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
    label: "From Kevin’s Circle",
    fullLabel: "Kevin’s Circle",
    badgeClass: "border-blue-100 bg-blue-50 text-blue-700",
    glowClass: "bg-blue-100/60",
    softClass: "from-white via-sky-50/75 to-blue-50/70",
    avatarClass: "bg-blue-50 text-blue-700",
  },
  bride: {
    label: "From Jenith’s Circle",
    fullLabel: "Jenith’s Circle",
    badgeClass: "border-pink-100 bg-pink-50 text-pink-700",
    glowClass: "bg-pink-100/60",
    softClass: "from-white via-rose-50/75 to-pink-50/70",
    avatarClass: "bg-pink-50 text-pink-700",
  },
  both: {
    label: "Loved by Both",
    fullLabel: "Shared Circle",
    badgeClass: "border-rose-100 bg-rose-50 text-rose-700",
    glowClass: "bg-rose-100/60",
    softClass: "from-white via-rose-50/70 to-amber-50/60",
    avatarClass: "bg-rose-50 text-rose-700",
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
        setSize({ width: 282, height: 354 });
        return;
      }

      if (viewport < 640) {
        setSize({ width: 320, height: 346 });
        return;
      }

      if (viewport < 1024) {
        setSize({ width: 390, height: 330 });
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
  const cardBottomOffset = cardWidth < 340 ? 50 : cardWidth < 400 ? 42 : 36;
  const stackHeight = Math.max(
    cardHeight + cardBottomOffset + 54,
    cardWidth < 340 ? 440 : 420
  );

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
    }, Math.max(1200, intervalMs));

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
        className="relative w-full bg-transparent outline-none"
        style={{ height: stackHeight }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className="absolute inset-0 flex items-end justify-center px-1"
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
                    "absolute overflow-hidden rounded-[2rem] border border-white/80 bg-white will-change-transform select-none",
                    isActive
                      ? "cursor-grab active:cursor-grabbing shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:shadow-[0_26px_74px_rgba(15,23,42,0.16)]"
                      : "cursor-pointer shadow-[0_8px_18px_rgba(15,23,42,0.025)] sm:shadow-[0_16px_38px_rgba(15,23,42,0.08)]"
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    bottom: cardBottomOffset,
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
                    opacity: isActive ? 1 : 0.96,
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

      {length > 1 && (
        <div className="-mt-4 flex items-center justify-center gap-3 sm:-mt-5 sm:gap-4">
          <button
            type="button"
            onClick={previous}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-x-0.5 hover:border-rose-200 hover:text-rose-700 sm:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            aria-label="Previous featured story"
          >
            <ArrowLeft
              size={17}
              className="transition duration-300 group-hover:-translate-x-0.5"
            />
          </button>

          <div className="flex min-w-[78px] items-center justify-center rounded-full border border-slate-100 bg-white px-4 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.02)] sm:min-w-[86px] sm:shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <span className="text-xs font-black tracking-[0.14em] text-slate-500">
              {active + 1}/{length}
            </span>
          </div>

          <button
            type="button"
            onClick={next}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition duration-300 hover:translate-x-0.5 hover:border-rose-200 hover:text-rose-700 sm:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            aria-label="Next featured story"
          >
            <ArrowRight
              size={17}
              className="transition duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      )}
    </div>
  );
};

const FeaturedFanCard = ({ item, active }) => {
  const story = item.story;
  const theme = sideTheme[story.side] || sideTheme.both;

  const previewLimit = active ? 260 : 120;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden",
        active
          ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(240,249,255,0.96),rgba(255,241,242,0.96),rgba(255,251,235,0.88))]"
          : `bg-gradient-to-br ${theme.softClass}`
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2.5 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#60a5fa_0%,#22d3ee_16%,#34d399_32%,#facc15_50%,#fb7185_68%,#c084fc_84%,#38bdf8_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/95" />
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.03))]" />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 hidden h-44 w-44 rounded-full blur-3xl sm:block",
          active ? "bg-rose-100/70" : theme.glowClass
        )}
      />
      <div className="pointer-events-none absolute -left-12 bottom-0 hidden h-36 w-36 rounded-full bg-sky-50/80 blur-3xl sm:block" />
      <div className="pointer-events-none absolute right-8 top-12 hidden h-20 w-20 rounded-full bg-amber-100/30 blur-3xl sm:block" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.02))] sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.04))]" />

      <div className="relative flex h-full min-h-0 flex-col p-4 pt-6 text-left sm:p-6 sm:pt-7">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex max-w-[210px] items-center rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.11em] sm:max-w-none sm:px-4 sm:text-[10px] sm:tracking-[0.13em]",
              theme.badgeClass
            )}
          >
            {theme.label}
          </span>

          <span className="h-2 w-10 shrink-0 rounded-full bg-[linear-gradient(90deg,#60a5fa_0%,#22d3ee_16%,#34d399_32%,#facc15_50%,#fb7185_68%,#c084fc_84%,#38bdf8_100%)] shadow-[0_2px_10px_rgba(236,72,153,0.22)] sm:w-12" />
        </div>

        <div
          className={cn(
            "mt-5 min-h-0 flex-1 overflow-hidden sm:mt-6",
            active ? "max-h-[12.6rem]" : "max-h-[6.4rem]"
          )}
        >
          <p
            className={cn(
              "font-bold transition-all duration-300",
              active
                ? "line-clamp-6 text-[14px] leading-7 text-slate-800 sm:line-clamp-5 sm:text-[16px] sm:leading-8"
                : "line-clamp-4 text-[13px] leading-6 text-slate-700 sm:text-[14px]"
            )}
          >
            “{getPreviewText(story.story, previewLimit)}”
          </p>
        </div>

        <div className="mt-4 flex shrink-0 items-center gap-3 pt-2 sm:mt-5 sm:pt-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black shadow-[0_6px_16px_rgba(15,23,42,0.04)] sm:h-12 sm:w-12 sm:shadow-[0_10px_22px_rgba(15,23,42,0.08)]",
              theme.avatarClass
            )}
          >
            {getInitials(story.name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black text-slate-950 sm:text-lg">
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
  <div className="relative flex min-h-[390px] items-end justify-center rounded-[2rem] bg-transparent p-4">
    <div className="relative h-[320px] w-full max-w-[430px] animate-pulse rounded-[2rem] border border-slate-200 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.03)] sm:shadow-[0_20px_55px_rgba(15,23,42,0.08)]" />
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
      className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white px-3 py-5 shadow-none sm:rounded-[2.7rem] sm:bg-gradient-to-br sm:from-white sm:via-rose-50/35 sm:to-slate-50/70 sm:p-6 sm:shadow-[0_20px_55px_rgba(15,23,42,0.05),0_8px_20px_rgba(255,255,255,0.8)_inset] lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-white/96 sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.18)_36%,rgba(255,255,255,0.42)_100%)]" />
      <div className="pointer-events-none absolute inset-x-12 top-0 hidden h-px bg-white/90 sm:block" />
      <div className="pointer-events-none absolute -left-16 top-10 hidden h-44 w-44 rounded-full bg-rose-100/45 blur-3xl sm:block" />
      <div className="pointer-events-none absolute -right-16 bottom-8 hidden h-44 w-44 rounded-full bg-sky-100/35 blur-3xl sm:block" />

      <div className="relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/85 px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] text-rose-700 shadow-sm shadow-rose-100/60 backdrop-blur-xl sm:text-[10px] sm:tracking-[0.18em]">
              <MessageCircleHeart size={14} />
              Featured Circle of Love
            </span>

            <Link
              to="/circle-of-love"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-white/80 px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500 shadow-sm shadow-slate-100 transition duration-300 hover:border-rose-100 hover:text-rose-700 sm:text-[10px] sm:tracking-[0.16em]"
            >
              View wall
              <ArrowRight size={12} />
            </Link>
          </div>

          <h2 className="mx-auto mt-4 max-w-[18rem] text-center font-['Playfair_Display',serif] text-[2.15rem] font-black leading-[1.08] tracking-tight text-slate-950 sm:mt-5 sm:max-w-3xl sm:text-5xl sm:leading-tight lg:text-[3.2rem]">
            <span className="block sm:inline">Little notes.</span>{" "}
            <span className="block sm:inline">Big smiles.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-[20rem] text-center text-[13.5px] font-semibold leading-6 text-slate-600 sm:max-w-3xl sm:text-base sm:leading-8 lg:max-w-none lg:whitespace-nowrap">
            A playful peek at the sweetest guest messages picked from the
            celebration wall.
          </p>
        </div>

        <div className="mt-2 sm:mt-3">
          {isLoading && <StoryStackSkeleton />}

          {!isLoading && stackItems.length > 0 && (
            <div className="relative">
              <CardStack
                items={stackItems}
                maxVisible={Math.min(7, Math.max(3, stackItems.length))}
                autoAdvance={stackItems.length > 1}
                intervalMs={3400}
                renderCard={(item, state) => (
                  <FeaturedFanCard item={item} active={state.active} />
                )}
              />
            </div>
          )}

          {!isLoading && stackItems.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-rose-200 bg-white/80 p-7 text-center shadow-[0_8px_18px_rgba(15,23,42,0.03)] sm:shadow-[0_14px_36px_rgba(15,23,42,0.04)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-700 shadow-lg shadow-rose-100">
                <Heart size={25} fill="currentColor" />
              </div>

              <h3 className="mt-4 text-xl font-black text-slate-950">
                Guest notes will appear here
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-7 text-slate-600">
                Once messages are approved and selected from the admin panel,
                the sweetest notes will automatically show on Home.
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
      className={cn(
        "relative overflow-hidden rounded-[2rem] border bg-white/95 p-4 backdrop-blur-2xl transition duration-300",
        isWinner
          ? "border-rose-100 shadow-[0_10px_22px_rgba(15,23,42,0.035)]"
          : "border-slate-100 shadow-[0_8px_18px_rgba(15,23,42,0.03)]"
      )}
    >
      <div className="relative flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${
                isKevin ? "#0ea5e9" : "#f43f5e"
              } ${percentage * 3.6}deg, #e5e7eb 0deg)`,
            }}
          />
          <div className="absolute inset-[8px] rounded-full bg-white" />
          <div
            className={`relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm ${
              isKevin
                ? "bg-gradient-to-br from-sky-500 to-blue-500"
                : "bg-gradient-to-br from-pink-500 to-rose-500"
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
                Sweet lead
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

    const totalVotes = Number(
      apiStats.totalVotes ?? fallbackStats.totalVotes ?? 0
    );
    const kevinVotes = Number(
      apiStats.kevinVotes ?? fallbackStats.kevinVotes ?? 0
    );
    const jenithVotes = Number(
      apiStats.jenithVotes ?? fallbackStats.jenithVotes ?? 0
    );

    return {
      totalVotes,
      kevinVotes,
      jenithVotes,
      kevinPercentage: totalVotes
        ? Math.round((kevinVotes / totalVotes) * 100)
        : 0,
      jenithPercentage: totalVotes
        ? Math.round((jenithVotes / totalVotes) * 100)
        : 0,
    };
  }, [data?.stats, polls]);

  const champion = useMemo(() => {
    if (!stats.totalVotes) {
      return {
        text: "Waiting for the first sweet vote.",
        icon: Vote,
      };
    }

    if (stats.kevinVotes === stats.jenithVotes) {
      return {
        text: "Both hearts are perfectly in sync.",
        icon: Heart,
      };
    }

    return stats.kevinVotes > stats.jenithVotes
      ? {
          text: "Kevin is collecting a few extra cheers.",
          icon: Crown,
        }
      : {
          text: "Jenith is collecting a few extra cheers.",
          icon: Gem,
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
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-rose-700 shadow-sm shadow-rose-100/40 backdrop-blur-xl">
              <BarChart3 size={14} />
              Couple Polls
            </span>

            <Link
              to="/couple-polls"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm shadow-slate-100 transition duration-300 hover:border-rose-100 hover:text-rose-700"
            >
              Play polls
              <ArrowRight size={12} />
            </Link>
          </div>

          <h2 className="mx-auto mt-5 max-w-2xl font-['Playfair_Display',serif] text-[2rem] font-black leading-tight tracking-tight text-slate-950 sm:text-[2.5rem] lg:text-[2.9rem]">
            Smiles on the scorecard.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base sm:leading-8">
            A sweet little peek at how our favorite people are cheering for
            Kevin and Jenith.
          </p>
        </div>

        <div className="relative mx-auto mt-8 flex max-w-5xl flex-col items-center sm:mt-9">
          <div className="relative flex h-[18rem] w-[18rem] items-center justify-center rounded-full bg-white sm:h-[21rem] sm:w-[21rem]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 180deg, rgba(14,165,233,0.16), rgba(244,63,94,0.18), rgba(251,191,36,0.1), rgba(14,165,233,0.16))",
              }}
            />

            <div className="absolute inset-[10px] rounded-full bg-white" />

            <div className="absolute left-5 top-8 h-3 w-3 rounded-full bg-sky-200/70" />
            <div className="absolute right-7 top-12 h-2.5 w-2.5 rounded-full bg-rose-200/80" />
            <div className="absolute bottom-8 right-10 h-3 w-3 rounded-full bg-amber-200/80" />
            <div className="absolute bottom-10 left-8 h-2.5 w-2.5 rounded-full bg-blue-100/80" />

            <div className="relative z-10 flex h-[14.5rem] w-[14.5rem] flex-col items-center justify-center rounded-full border border-slate-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(252,252,253,0.97),rgba(249,250,251,0.95))] px-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] sm:h-[17rem] sm:w-[17rem]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-2 shadow-[0_8px_16px_rgba(15,23,42,0.04)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-500 text-white">
                  <Crown size={15} />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500">
                  <Heart size={15} fill="currentColor" />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                  <Gem size={15} />
                </span>
              </div>

              <div className="relative mt-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-slate-950 text-white shadow-[0_16px_28px_rgba(15,23,42,0.12)]">
                <div className="absolute inset-[1px] rounded-[1.3rem] border border-white/10" />
                {isLoading ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : (
                  <ChampionIcon size={28} />
                )}
              </div>

              <h3 className="mt-5 max-w-[11rem] text-[1.4rem] font-black leading-[1.22] text-slate-950 sm:max-w-[12.5rem] sm:text-[1.7rem]">
                {champion.text}
              </h3>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-[linear-gradient(135deg,rgba(255,245,247,1),rgba(255,255,255,1))] px-4 py-2.5 text-xs font-black text-rose-700 shadow-[0_10px_22px_rgba(244,63,94,0.06)]">
                <Sparkles size={14} />
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
            isWinner={
              stats.totalVotes > 0 && stats.kevinVotes >= stats.jenithVotes
            }
          />

          <ChampionOrbit
            name="Jenith"
            votes={stats.jenithVotes || 0}
            percentage={stats.jenithPercentage || 0}
            icon={Gem}
            side="jenith"
            isWinner={
              stats.totalVotes > 0 && stats.jenithVotes > stats.kevinVotes
            }
          />
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
    <section className="relative isolate overflow-hidden bg-white px-4 py-6 sm:px-5 sm:py-8 md:px-6 lg:px-4 lg:py-10">
      <div className="pointer-events-none absolute inset-0 bg-white" />
      <div className="pointer-events-none absolute bottom-20 right-0 h-80 w-80 rounded-full bg-slate-100/80 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-5 max-w-3xl text-center sm:mb-6"
        >
          <div className="mx-auto flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-rose-300 sm:w-16" />
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_18px_rgba(225,29,72,0.45)]" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-rose-300 sm:w-16" />
          </div>

          <h2 className="mt-4 font-['Playfair_Display',serif] text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Togetherness Spotlight
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs font-bold uppercase tracking-[0.22em] text-rose-600 sm:text-sm">
            Circle of Love · Couple Polls
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