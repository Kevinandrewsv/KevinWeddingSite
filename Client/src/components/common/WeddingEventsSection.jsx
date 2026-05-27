import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Church,
  Clock3,
  Gem,
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";

import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

const WeddingEventsSection = ({ events = [], eventsLoading = false }) => {
  const cardRefs = useRef([]);
  const [revealedCards, setRevealedCards] = useState({});

  const eventDecor = [
    {
      number: "01",
      label: "Engagement",
      icon: Gem,
      glow: "from-rose-100 via-pink-50 to-white",
    },
    {
      number: "02",
      label: "Church Ceremony",
      icon: Church,
      glow: "from-pink-100 via-rose-50 to-white",
    },
    {
      number: "03",
      label: "Marriage Hall",
      icon: Building2,
      glow: "from-red-100 via-rose-50 to-white",
    },
  ];

  const visibleEvents = events.slice(0, 3);

  useEffect(() => {
    if (!visibleEvents.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = Number(entry.target.dataset.cardIndex);

          if (entry.isIntersecting) {
            setRevealedCards((previous) => ({
              ...previous,
              [cardIndex]: true,
            }));
          }
        });
      },
      {
        threshold: 0.24,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [visibleEvents.length]);

  const getCardAnimation = (index) => {
    if (revealedCards[index]) {
      return {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      };
    }

    return {
      opacity: 0,
      y: 42,
      scale: 0.97,
      filter: "blur(10px)",
    };
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-5 sm:py-16 md:px-6 md:py-18 lg:px-8 lg:py-24">
      <div className="absolute inset-0 bg-white" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-rose-50/80 blur-3xl sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]" />
      <div className="pointer-events-none absolute right-[8%] top-[12%] h-44 w-44 rounded-full bg-pink-50 blur-3xl sm:h-52 sm:w-52" />
      <div className="pointer-events-none absolute bottom-[5%] left-[8%] h-44 w-44 rounded-full bg-red-50 blur-3xl sm:h-52 sm:w-52" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[0.78fr_1.22fr] xl:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.26 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2.5 shadow-lg shadow-rose-100/60 sm:px-5">
              <Sparkles size={15} className="text-rose-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-700 sm:text-xs sm:tracking-[0.35em]">
                Wedding Timeline
              </span>
            </div>

            <h2 className="mx-auto mt-5 max-w-md text-[2.35rem] font-black leading-[1.02] tracking-tight text-gray-950 min-[390px]:text-[2.65rem] sm:mt-6 sm:max-w-2xl sm:text-5xl md:text-6xl lg:mx-0">
              Three blessed
              <span className="block rose-text-gradient">celebrations</span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-7 text-gray-600 sm:mt-5 sm:max-w-xl sm:text-lg sm:leading-relaxed lg:mx-0">
              Every event is planned as a beautiful moment of prayer, family,
              joy, and celebration.
            </p>

            <div className="mx-auto mt-6 hidden max-w-md rounded-[1.7rem] border border-rose-100 bg-white/80 p-5 shadow-2xl shadow-rose-100/60 backdrop-blur-2xl lg:mx-0 lg:mt-8 lg:block lg:rounded-[2rem] lg:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-700 text-white shadow-xl shadow-rose-100">
                  <CalendarDays size={25} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-rose-700">
                    Save the dates
                  </p>
                  <p className="mt-1 text-gray-600">
                    View complete venue and time details.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            {eventsLoading && <LoadingState message="Loading events..." />}

            {!eventsLoading && visibleEvents.length === 0 && (
              <div className="mt-8 lg:mt-10">
                <EmptyState
                  title="Events Coming Soon"
                  message="Event details will be updated soon."
                />
              </div>
            )}

            {!eventsLoading && visibleEvents.length > 0 && (
              <div className="relative">
                <div className="absolute bottom-10 left-6 top-10 hidden w-px bg-gradient-to-b from-transparent via-rose-200 to-transparent md:block" />

                <div className="grid gap-4 sm:gap-5">
                  {visibleEvents.map((event, index) => {
                    const decor = eventDecor[index] || eventDecor[0];
                    const EventIcon = decor.icon;

                    return (
                      <motion.div
                        key={event._id}
                        ref={(element) => {
                          cardRefs.current[index] = element;
                        }}
                        data-card-index={index}
                        initial={false}
                        animate={getCardAnimation(index)}
                        transition={{
                          duration: 0.68,
                          delay: revealedCards[index] ? index * 0.06 : 0,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group relative will-change-transform md:pl-16"
                      >
                        <div className="absolute left-0 top-8 z-10 hidden h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-700 shadow-xl shadow-rose-100 md:flex">
                          <EventIcon size={22} />
                        </div>

                        <div
                          className={`relative overflow-hidden rounded-[1.65rem] border border-rose-100 bg-gradient-to-br ${decor.glow} p-[1px] shadow-xl shadow-rose-100/45 transition duration-500 group-hover:-translate-y-0.5 group-hover:shadow-2xl group-hover:shadow-rose-100/70 sm:rounded-[1.9rem] md:rounded-[2.2rem]`}
                        >
                          <div className="relative overflow-hidden rounded-[1.6rem] bg-white/88 p-4 backdrop-blur-2xl sm:rounded-[1.85rem] sm:p-5 md:rounded-[2.15rem] md:p-6">
                            <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-rose-100/70 blur-3xl transition group-hover:bg-rose-200/70 sm:h-52 sm:w-52" />
                            <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-pink-100/65 blur-3xl sm:h-52 sm:w-52" />
                            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                            <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center md:gap-6">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] bg-rose-700 text-xs font-black text-white shadow-lg shadow-rose-100 sm:h-10 sm:w-10 sm:rounded-2xl sm:text-sm">
                                    {decor.number}
                                  </span>

                                  <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-rose-700 sm:px-4 sm:text-[10px] sm:tracking-[0.26em]">
                                    <EventIcon size={14} className="shrink-0" />
                                    <span className="truncate">
                                      {decor.label}
                                    </span>
                                  </span>
                                </div>

                                <h3 className="mt-4 break-words text-[1.35rem] font-black leading-tight text-gray-950 sm:mt-5 sm:text-2xl md:text-3xl">
                                  {event.title}
                                </h3>

                                {event.description && (
                                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-gray-600 sm:mt-3 sm:text-base sm:leading-relaxed">
                                    {event.description}
                                  </p>
                                )}

                                <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
                                  <div className="rounded-[1.15rem] border border-rose-100 bg-white/80 p-3 sm:rounded-2xl sm:p-4">
                                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-500 sm:text-xs sm:tracking-[0.22em]">
                                      <CalendarDays
                                        size={15}
                                        className="shrink-0 text-rose-700"
                                      />
                                      Date
                                    </p>

                                    <p className="mt-2 break-words text-sm font-black text-gray-950 sm:text-base">
                                      {new Date(event.date).toLocaleDateString(
                                        "en-IN",
                                        {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                        }
                                      )}
                                    </p>
                                  </div>

                                  <div className="rounded-[1.15rem] border border-rose-100 bg-white/80 p-3 sm:rounded-2xl sm:p-4">
                                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-500 sm:text-xs sm:tracking-[0.22em]">
                                      <Clock3
                                        size={15}
                                        className="shrink-0 text-rose-700"
                                      />
                                      Time
                                    </p>

                                    <p className="mt-2 break-words text-sm font-black text-gray-950 sm:text-base">
                                      {event.time}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 rounded-[1.15rem] border border-rose-100 bg-white/85 p-3 sm:rounded-2xl sm:p-4">
                                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-500 sm:text-xs sm:tracking-[0.22em]">
                                    <MapPin
                                      size={15}
                                      className="shrink-0 text-rose-700"
                                    />
                                    Venue
                                  </p>

                                  <p className="mt-2 break-words text-sm font-black text-gray-950 sm:text-base">
                                    {event.venueName}
                                  </p>

                                  {event.address && (
                                    <p className="mt-1 break-words text-sm font-medium leading-6 text-gray-600 sm:text-base">
                                      {event.address}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2 md:flex md:flex-col md:items-end">
                                {event.mapLink && (
                                  <a
                                    href={event.mapLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group/link inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-gray-200 transition hover:bg-rose-800 md:w-auto"
                                  >
                                    <Navigation size={16} />
                                    Location
                                  </a>
                                )}

                                <Link
                                  to="/events"
                                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-5 py-3 text-sm font-black text-rose-700 shadow-lg shadow-rose-50 transition hover:bg-rose-50 md:w-auto"
                                >
                                  Details
                                  <ChevronRight size={16} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-7 flex justify-center md:pl-16 lg:mt-8 lg:justify-end">
                  <Link
                    to="/events"
                    className="group relative inline-flex min-h-12 w-full max-w-[310px] items-center justify-center gap-3 overflow-hidden rounded-full border border-rose-100 bg-white/85 px-5 py-3.5 pr-3 text-sm font-black text-rose-700 shadow-2xl shadow-rose-100/80 backdrop-blur-2xl transition duration-300 hover:border-rose-200 hover:bg-rose-700 hover:text-white hover:shadow-rose-200 sm:w-auto sm:max-w-none sm:px-6"
                  >
                    <span className="absolute inset-0 translate-x-[-120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/70 to-transparent transition duration-700 group-hover:translate-x-[130%]" />

                    <span className="relative tracking-wide">
                      Explore All Events
                    </span>

                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700 transition group-hover:bg-white/20 group-hover:text-white">
                      <ChevronRight size={18} />
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingEventsSection;