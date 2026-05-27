import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Church, Heart, Sparkles } from "lucide-react";
import { FaBookBible, FaCross } from "react-icons/fa6";

import { useEvents } from "../../hooks/useEvents";
import { useGallery } from "../../hooks/useGallery";
import { useFeaturedWishes } from "../../hooks/useFeaturedWishes";

import {
  BibleVerseSection,
  DeveloperTesterSection,
  FeaturedMemoriesSection,
  FeaturedWishesSection,
  FinalActionSection,
  WeddingEventsSection,
  WeddingTimelineBox,
  WeddingAssistant,
  HomeInteractiveSpotlightSection,
  useWeddingTimeline,
} from "../../components/common";

const getTimeValue = (timeLeft, key) => {
  const value = timeLeft?.[key];

  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "00";
  }

  return String(value).padStart(2, "0");
};

const CleanCircularBadge = ({ compact = false }) => {
  const text = "KEVIN•WEDS•JENITH•";
  const letters = Array.from(text);
  const radius = compact ? 34 : 42;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${
        compact
          ? "h-[80px] w-[80px]"
          : "h-[98px] w-[98px] sm:h-[112px] sm:w-[112px]"
      }`}
    >
      <motion.div
        className="absolute inset-0 origin-center"
        animate={{ rotate: 360 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformOrigin: "50% 50%",
        }}
      >
        {letters.map((letter, index) => {
          const angle = (360 / letters.length) * index - 90;

          return (
            <span
              key={`${letter}-${index}`}
              className={`absolute left-1/2 top-1/2 flex items-center justify-center font-black uppercase leading-none text-white ${
                compact
                  ? "h-3.5 w-3.5 text-[8px]"
                  : "h-4 w-4 text-[10px] sm:h-[18px] sm:w-[18px] sm:text-[11px]"
              }`}
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                transformOrigin: "center center",
              }}
            >
              {letter === "•" ? (
                <span
                  className={
                    compact
                      ? "text-[10px] leading-none"
                      : "text-[13px] leading-none sm:text-[14px]"
                  }
                >
                  •
                </span>
              ) : (
                letter
              )}
            </span>
          );
        })}
      </motion.div>

      <div
        className={`absolute flex items-center justify-center rounded-full border border-white/55 bg-white/10 ${
          compact ? "h-8 w-8" : "h-[38px] w-[38px] sm:h-[42px] sm:w-[42px]"
        }`}
      >
        <Heart
          size={compact ? 13 : 16}
          className="text-white sm:h-[18px] sm:w-[18px]"
          fill="white"
        />
      </div>
    </div>
  );
};

const MobileCountdownBox = ({ weddingStatus, timeLeft }) => {
  if (weddingStatus === "after-week") {
    return (
      <div className="mx-auto mt-6 w-full max-w-[430px] overflow-hidden rounded-[1.65rem] border border-rose-100 bg-white px-5 py-5 text-center shadow-[0_18px_38px_rgba(244,63,94,0.10)] sm:mt-7 sm:rounded-[1.9rem] sm:px-6 sm:py-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-700 text-white shadow-lg shadow-rose-100">
          <Heart size={20} fill="currentColor" />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-[0.28em] text-rose-700">
          Thank You
        </p>

        <p className="mx-auto mt-2 max-w-xs text-sm font-semibold leading-relaxed text-gray-600 sm:text-[15px]">
          Our celebration was made beautiful with your prayers and blessings.
        </p>
      </div>
    );
  }

  const countdownItems = [
    { label: "Days", value: getTimeValue(timeLeft, "days") },
    { label: "Hours", value: getTimeValue(timeLeft, "hours") },
    { label: "Minutes", value: getTimeValue(timeLeft, "minutes") },
    { label: "Seconds", value: getTimeValue(timeLeft, "seconds") },
  ];

  return (
    <div className="mx-auto mt-6 w-full max-w-[430px] overflow-hidden rounded-[1.65rem] border border-rose-100 bg-white p-2.5 shadow-[0_18px_38px_rgba(244,63,94,0.10)] sm:mt-7 sm:rounded-[1.9rem] sm:p-3">
      <div className="grid grid-cols-4 gap-1.5 min-[375px]:gap-2 sm:gap-3">
        {countdownItems.map((item) => (
          <div
            key={item.label}
            className="min-w-0 rounded-[1.1rem] border border-rose-100/80 bg-gradient-to-br from-white via-white to-rose-50/60 px-1 py-3 text-center shadow-sm shadow-rose-100/60 min-[375px]:rounded-[1.25rem] min-[375px]:px-1.5 sm:py-4"
          >
            <p className="text-[1.35rem] font-black leading-none text-rose-600 min-[360px]:text-[1.55rem] min-[390px]:text-[1.7rem] sm:text-4xl">
              {item.value}
            </p>

            <p className="mt-2 truncate text-[7px] font-black uppercase tracking-[0.1em] text-gray-500 min-[375px]:text-[8px] min-[390px]:tracking-[0.14em] sm:text-[10px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SaveDateCard = ({ mobile = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.15 }}
      className={`relative mx-auto w-full ${
        mobile
          ? "max-w-[360px] sm:max-w-[430px] md:max-w-[470px]"
          : "max-w-[420px] xl:max-w-[500px]"
      }`}
    >
      <div
        className={`relative border border-rose-100 bg-white shadow-none backdrop-blur-2xl ${
          mobile
            ? "rounded-[1.8rem] p-2.5 sm:rounded-[2.2rem] sm:p-4 md:p-5"
            : "rounded-[2rem] p-3 sm:rounded-[2.4rem] sm:p-4 md:rounded-[2.7rem] md:p-5 xl:p-6"
        }`}
      >
        <div
          className={`relative overflow-hidden border border-red-200/60 bg-gradient-to-br from-rose-800 via-red-700 to-rose-900 shadow-none ${
            mobile
              ? "rounded-[1.45rem] p-1.5 sm:rounded-[1.85rem]"
              : "rounded-[1.7rem] p-1.5 sm:rounded-[2rem] md:rounded-[2.25rem]"
          }`}
        >
          <div
            className={`relative overflow-hidden border border-white/10 bg-gradient-to-br from-red-700/80 via-rose-700/75 to-red-950/80 backdrop-blur-xl ${
              mobile
                ? "min-h-[315px] rounded-[1.25rem] p-4 min-[390px]:min-h-[340px] sm:min-h-[385px] sm:rounded-[1.6rem] sm:p-6 md:min-h-[420px] md:rounded-[1.9rem]"
                : "min-h-[430px] rounded-[1.45rem] p-6 md:rounded-[2rem] xl:min-h-[500px] xl:p-9"
            }`}
          >
            <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-950/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/4 to-transparent" />

            <div
              className={`relative z-10 flex items-center justify-center ${
                mobile
                  ? "min-h-[285px] min-[390px]:min-h-[310px] sm:min-h-[335px] md:min-h-[365px]"
                  : "min-h-[370px] xl:min-h-[430px]"
              }`}
            >
              <div
                className={`relative w-full overflow-hidden border border-white/30 bg-gradient-to-br from-rose-700 via-red-700 to-rose-950 shadow-[inset_4px_4px_10px_rgba(255,255,255,0.28),inset_-8px_-10px_18px_rgba(80,7,36,0.45),0_18px_35px_rgba(80,7,36,0.24)] backdrop-blur-xl ${
                  mobile
                    ? "max-w-[275px] rounded-[1.45rem] p-5 min-[390px]:max-w-[300px] sm:max-w-[340px] sm:rounded-[1.85rem] sm:p-6 md:max-w-[380px] md:rounded-[2.1rem] md:p-7"
                    : "max-w-[330px] rounded-[1.7rem] p-6 xl:max-w-[380px] xl:rounded-[2.2rem] xl:p-8"
                }`}
              >
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/55" />
                <div className="pointer-events-none absolute left-5 right-5 top-4 h-20 rounded-full bg-white/12 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-14 h-44 w-44 rounded-full bg-black/18 blur-3xl" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/12 blur-3xl" />

                <div
                  className={`absolute left-4 top-4 flex items-center justify-center rounded-2xl border border-white/30 bg-gradient-to-br from-white/28 via-white/14 to-white/6 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.36),inset_-3px_-4px_8px_rgba(80,7,36,0.22),0_8px_18px_rgba(80,7,36,0.2)] backdrop-blur-xl ${
                    mobile
                      ? "h-9 w-9 sm:left-6 sm:top-6 sm:h-12 sm:w-12"
                      : "h-11 w-11 xl:h-12 xl:w-12"
                  }`}
                >
                  <Sparkles size={mobile ? 14 : 15} className="text-white" />
                </div>

                <div
                  className={`absolute right-4 top-4 flex items-center justify-center rounded-2xl border border-white/30 bg-gradient-to-br from-white/28 via-white/14 to-white/6 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.36),inset_-3px_-4px_8px_rgba(80,7,36,0.22),0_8px_18px_rgba(80,7,36,0.2)] backdrop-blur-xl ${
                    mobile
                      ? "h-9 w-9 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
                      : "h-11 w-11 xl:h-12 xl:w-12"
                  }`}
                >
                  <Church size={mobile ? 15 : 16} className="text-white" />
                </div>

                <div
                  className={`relative z-10 flex flex-col items-center justify-center text-center ${
                    mobile
                      ? "min-h-[270px] min-[390px]:min-h-[290px] sm:min-h-[330px] md:min-h-[350px]"
                      : "min-h-[320px] xl:min-h-[365px]"
                  }`}
                >
                  <div
                    className={`mx-auto flex w-full items-center justify-center gap-3 ${
                      mobile
                        ? "max-w-[135px] sm:max-w-[165px]"
                        : "max-w-[155px] xl:max-w-[185px]"
                    }`}
                  >
                    <span className="h-px flex-1 bg-white/32" />
                    <FaCross
                      size={mobile ? 12 : 14}
                      className="shrink-0 text-white"
                    />
                    <span className="h-px flex-1 bg-white/32" />
                  </div>

                  <p
                    className={`font-black uppercase text-white ${
                      mobile
                        ? "mt-5 text-[11px] tracking-[0.28em] sm:mt-6 sm:text-sm sm:tracking-[0.42em]"
                        : "mt-6 text-xs tracking-[0.32em] xl:mt-6 xl:text-sm xl:tracking-[0.45em]"
                    }`}
                  >
                    Save The Date
                  </p>

                  <div
                    className={`flex w-full items-end justify-center ${
                      mobile
                        ? "mt-5 gap-3 min-[390px]:gap-4 sm:mt-7 sm:gap-5"
                        : "mt-6 gap-4 xl:mt-8 xl:gap-5"
                    }`}
                  >
                    <h2
                      className={`font-black leading-none tracking-tight text-white drop-shadow-sm ${
                        mobile
                          ? "text-[4.3rem] min-[390px]:text-7xl sm:text-8xl md:text-9xl"
                          : "text-[5.8rem] xl:text-9xl"
                      }`}
                    >
                      25
                    </h2>

                    <div className="pb-2 text-left sm:pb-3">
                      <p
                        className={`font-black leading-none text-white ${
                          mobile
                            ? "text-3xl min-[390px]:text-[2.1rem] sm:text-4xl md:text-5xl"
                            : "text-4xl xl:text-5xl"
                        }`}
                      >
                        June
                      </p>
                      <p
                        className={`mt-2 font-black text-white sm:mt-3 ${
                          mobile ? "text-xl sm:text-2xl" : "text-xl xl:text-2xl"
                        }`}
                      >
                        2026
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex w-full items-center justify-center gap-3 ${
                      mobile
                        ? "mt-6 max-w-[235px] sm:mt-7 sm:max-w-[310px] sm:gap-4"
                        : "mt-6 max-w-[250px] xl:mt-8 xl:max-w-[310px] xl:gap-4"
                    }`}
                  >
                    <div
                      className={`flex shrink-0 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/28 via-white/14 to-white/6 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.36),inset_-3px_-4px_8px_rgba(80,7,36,0.22),0_8px_18px_rgba(80,7,36,0.18)] backdrop-blur-xl ${
                        mobile
                          ? "h-10 w-10 sm:h-12 sm:w-12"
                          : "h-11 w-11 xl:h-12 xl:w-12"
                      }`}
                    >
                      <FaBookBible
                        size={mobile ? 17 : 19}
                        className="text-white"
                      />
                    </div>

                    <div className="h-px flex-1 bg-white/24" />
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/75 sm:h-3 sm:w-3" />
                    <div className="h-px flex-1 bg-white/24" />
                    <CleanCircularBadge compact={mobile} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MobileTabletHero = ({ weddingStatus, timeLeft }) => {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-8 pt-7 sm:px-5 sm:pb-10 sm:pt-8 md:px-6 md:pb-12 md:pt-10 lg:hidden">
      <div className="absolute inset-0 z-0 bg-white" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-50/80 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="w-full"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2.5 shadow-lg shadow-rose-100/50 backdrop-blur-xl sm:px-5">
            <FaCross size={13} className="shrink-0 text-rose-600" />
            <span className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 min-[390px]:tracking-[0.24em] sm:text-xs sm:tracking-[0.35em]">
              By God&apos;s Grace
            </span>
          </div>

          <h1 className="mx-auto mt-5 flex max-w-[620px] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[2.45rem] font-black leading-[0.9] tracking-tight text-gray-950 min-[360px]:text-[2.8rem] min-[390px]:text-[3.1rem] sm:mt-6 sm:gap-x-3 sm:text-6xl md:text-7xl">
            <span>Kevin</span>

            <motion.span
              animate={{
                scale: [1, 1.14, 1],
                color: ["#be123c", "#ec4899", "#ef4444", "#be123c"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white shadow-xl shadow-rose-100 min-[390px]:h-11 min-[390px]:w-11 sm:h-14 sm:w-14 md:h-[68px] md:w-[68px]"
            >
              <Heart
                size={23}
                className="min-[390px]:h-7 min-[390px]:w-7 sm:h-9 sm:w-9 md:h-11 md:w-11"
                fill="currentColor"
              />

              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-700 text-white shadow-lg shadow-rose-100 sm:h-6 sm:w-6">
                <FaCross size={9} />
              </span>
            </motion.span>

            <span className="rose-text-gradient">Jenith</span>
          </h1>

          <p className="mx-auto mt-4 max-w-[34rem] text-[15px] font-medium leading-7 text-gray-600 min-[390px]:text-base sm:mt-5 sm:text-lg md:text-xl md:leading-8">
            With God&apos;s blessings and our families&apos; prayers, we invite you to
            celebrate this sacred beginning.
          </p>

          <div className="mx-auto mt-5 grid w-full max-w-[430px] gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
            <Link
              to="/events"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-rose-700 px-6 py-3.5 font-black text-white shadow-xl shadow-rose-100 transition hover:bg-rose-800 sm:min-h-14"
            >
              View Events
              <ChevronRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            {weddingStatus === "after-week" ? (
              <Link
                to="/wishes"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-6 py-3.5 font-black text-rose-700 shadow-lg shadow-rose-100/70 transition hover:bg-rose-50 sm:min-h-14"
              >
                <Heart size={18} />
                Send Wishes
              </Link>
            ) : (
              <Link
                to="/guest-response"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-6 py-3.5 font-black text-rose-700 shadow-lg shadow-rose-100/70 transition hover:bg-rose-50 sm:min-h-14"
              >
                <Heart size={18} />
                Confirm Attendance
              </Link>
            )}
          </div>

          <MobileCountdownBox
            weddingStatus={weddingStatus}
            timeLeft={timeLeft}
          />
        </motion.div>

        <div className="mt-7 w-full sm:mt-8 md:mt-10">
          <SaveDateCard mobile />
        </div>
      </div>
    </section>
  );
};

const DesktopHero = ({ weddingStatus, timeLeft }) => {
  return (
    <section className="relative hidden min-h-[calc(100svh-76px)] items-center overflow-hidden bg-white px-6 py-6 lg:flex xl:py-8">
      <div className="absolute inset-0 z-0 bg-white" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.86fr] xl:grid-cols-[1fr_0.92fr] xl:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-0 max-w-3xl text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-5 py-2.5 shadow-lg shadow-rose-100/60 backdrop-blur-xl">
            <FaCross size={14} className="text-rose-600" />
            <span className="text-sm font-black uppercase tracking-[0.35em] text-rose-600">
              By God&apos;s Grace
            </span>
          </div>

          <h1 className="mt-7 max-w-full whitespace-nowrap text-[4.8rem] font-black leading-[0.95] tracking-tight text-gray-950 xl:text-[5.7rem]">
            <span className="inline-flex items-center gap-5">
              <span>Kevin</span>

              <motion.span
                animate={{
                  scale: [1, 1.16, 1],
                  color: ["#be123c", "#ec4899", "#ef4444", "#be123c"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white shadow-2xl shadow-rose-200 xl:h-20 xl:w-20"
              >
                <Heart
                  size={40}
                  className="xl:h-12 xl:w-12"
                  fill="currentColor"
                />

                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-700 text-white shadow-lg shadow-rose-200">
                  <FaCross size={10} />
                </span>
              </motion.span>

              <span className="rose-text-gradient">Jenith</span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 xl:text-xl">
            With God&apos;s blessings and our families&apos; prayers, we invite you to
            celebrate this sacred beginning.
          </p>

          <div className="mt-7 flex flex-row justify-start gap-4">
            <Link
              to="/events"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-rose-700 px-8 py-4 font-black text-white shadow-2xl shadow-rose-200 transition hover:bg-rose-800"
            >
              View Events
              <ChevronRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            {weddingStatus === "after-week" ? (
              <Link
                to="/wishes"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-8 py-4 font-black text-rose-700 shadow-xl shadow-rose-100 transition hover:bg-rose-50"
              >
                <Heart size={18} />
                Send Wishes
              </Link>
            ) : (
              <Link
                to="/guest-response"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-8 py-4 font-black text-rose-700 shadow-xl shadow-rose-100 transition hover:bg-rose-50"
              >
                <Heart size={18} />
                Confirm Attendance
              </Link>
            )}
          </div>

          <WeddingTimelineBox weddingStatus={weddingStatus} timeLeft={timeLeft} />
        </motion.div>

        <div className="justify-self-end">
          <SaveDateCard />
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { data: eventsData, isLoading: eventsLoading } = useEvents();

  const { data: galleryData, isLoading: galleryLoading } = useGallery({
    featured: true,
  });

  const { data: featuredWishesData, isLoading: featuredWishesLoading } =
    useFeaturedWishes();

  const { weddingStatus, timeLeft } = useWeddingTimeline();

  const events = eventsData?.data || [];
  const featuredGallery = galleryData?.data || [];
  const featuredWishes = featuredWishesData?.data || [];

  return (
    <div className="safe-page-x overflow-hidden bg-white">
      <MobileTabletHero weddingStatus={weddingStatus} timeLeft={timeLeft} />
      <DesktopHero weddingStatus={weddingStatus} timeLeft={timeLeft} />

      <section className="relative bg-white">
        <div className="relative z-10">
          <DeveloperTesterSection />
        </div>

        <div className="relative z-20">
          <BibleVerseSection />
        </div>
      </section>

      <WeddingEventsSection events={events} eventsLoading={eventsLoading} />

      <FeaturedMemoriesSection
        featuredGallery={featuredGallery}
        galleryLoading={galleryLoading}
      />

      <FeaturedWishesSection
        wishes={featuredWishes}
        wishesLoading={featuredWishesLoading}
      />

      <HomeInteractiveSpotlightSection />

      <FinalActionSection />
      <WeddingAssistant />
    </div>
  );
};

export default Home;