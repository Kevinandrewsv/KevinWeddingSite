import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  PartyPopper,
  Sparkles,
} from "lucide-react";

import { useEvents } from "../../hooks/useEvents";
import { EmptyState, ErrorState, LoadingState } from "../../components/common";

const formatEventDate = (date) => {
  if (!date) return "Date will be updated";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date will be updated";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getDateParts = (date) => {
  if (!date) {
    return {
      day: "--",
      month: "Soon",
    };
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      day: "--",
      month: "Soon",
    };
  }

  return {
    day: parsedDate.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: parsedDate.toLocaleDateString("en-IN", { month: "short" }),
  };
};

const getEventIcon = (title = "") => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("marriage") || lowerTitle.includes("wedding")) {
    return <Heart size={22} fill="white" />;
  }

  if (lowerTitle.includes("reception")) {
    return <PartyPopper size={22} />;
  }

  return <Sparkles size={22} />;
};

const outerGlassCardClass =
  "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50/65 to-white p-3.5 shadow-[0_14px_34px_rgba(244,63,94,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-rose-200 sm:rounded-[2.1rem] sm:p-5 lg:rounded-[2.35rem] lg:p-5";

const smallGlassBoxClass =
  "relative overflow-hidden rounded-[1.25rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50/45 to-white shadow-[0_6px_18px_rgba(244,63,94,0.05)] backdrop-blur-xl sm:rounded-[1.45rem]";

const detailLabelClass =
  "relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-rose-700 sm:text-xs";

const Events = () => {
  const { data, isLoading, isError, error } = useEvents();

  const events = data?.data || [];

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-12 pt-5 sm:px-5 sm:pb-14 sm:pt-6 md:px-6 md:pb-16 md:pt-7 lg:px-8 lg:pb-20 lg:pt-8">
      <div className="pointer-events-none absolute inset-0 bg-white" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-50/80 blur-3xl sm:h-96 sm:w-96 lg:h-[34rem] lg:w-[34rem]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 shadow-[0_10px_24px_rgba(244,63,94,0.08)] backdrop-blur-xl min-[390px]:tracking-[0.24em] sm:gap-3 sm:px-5 sm:text-xs sm:tracking-[0.38em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-rose-600" />
            <span className="truncate">Save The Dates</span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 min-[390px]:text-4xl sm:mt-6 sm:text-5xl lg:text-6xl">
            Wedding Events
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-500 sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
            Three beautiful moments, one blessed beginning. Join us as we
            celebrate love, joy, and togetherness.
          </p>
        </div>

        {isLoading && (
          <div className="mt-8">
            <LoadingState message="Loading events..." />
          </div>
        )}

        {isError && (
          <div className="mt-8">
            <ErrorState
              message={error?.response?.data?.message || "Failed to load events."}
            />
          </div>
        )}

        {!isLoading && !isError && events.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="Events Coming Soon"
              message="Event details will be updated soon."
            />
          </div>
        )}

        {!isLoading && !isError && events.length > 0 && (
          <div className="mt-7 sm:mt-9 lg:mt-10">
            <div className="grid items-stretch gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              {events.map((event, index) => {
                const dateParts = getDateParts(event.date);

                return (
                  <motion.article
                    key={event._id || `${event.title}-${index}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.22 }}
                    transition={{ duration: 0.48, delay: index * 0.06 }}
                    className="group h-full"
                  >
                    <div className={outerGlassCardClass}>
                      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/90 blur-3xl" />

                      <div className="relative flex h-full flex-col">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.05rem] bg-gradient-to-br from-rose-700 via-rose-600 to-pink-500 text-white shadow-[0_10px_22px_rgba(244,63,94,0.16)] sm:h-14 sm:w-14 sm:rounded-2xl">
                            <div className="pointer-events-none absolute inset-x-2 top-1 h-5 rounded-full bg-white/25 blur-sm" />
                            {getEventIcon(event.title)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-600 sm:text-[11px] sm:tracking-[0.24em]">
                                  Event {String(index + 1).padStart(2, "0")}
                                </p>

                                <h3 className="mt-1 line-clamp-2 text-[1.35rem] font-black leading-tight tracking-tight text-slate-950 min-[390px]:text-2xl sm:text-3xl md:min-h-[72px] xl:min-h-[72px]">
                                  {event.title}
                                </h3>
                              </div>

                              <span
                                className={`hidden shrink-0 rounded-full border px-3 py-1.5 text-xs font-black backdrop-blur-md sm:inline-flex ${
                                  event.isActive
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 bg-slate-100 text-slate-500"
                                }`}
                              >
                                {event.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-[6.3rem_1fr] sm:gap-4">
                          <div className={`${smallGlassBoxClass} flex min-h-[6.3rem] items-center justify-center px-4 py-4 text-center sm:flex-col sm:py-5`}>
                            <div className="pointer-events-none absolute inset-x-3 top-1 h-5 rounded-full bg-white/55 blur-sm" />

                            <div className="relative flex items-end justify-center gap-2 sm:block">
                              <span className="text-4xl font-black leading-none text-rose-700 sm:text-4xl">
                                {dateParts.day}
                              </span>

                              <span className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-rose-500 sm:mb-0 sm:mt-1">
                                {dateParts.month}
                              </span>
                            </div>
                          </div>

                          <div className="grid min-w-0 gap-3">
                            <div className={`${smallGlassBoxClass} px-4 py-3.5 sm:p-4`}>
                              <div className="pointer-events-none absolute inset-x-3 top-1 h-5 rounded-full bg-white/50 blur-sm" />

                              <div className={detailLabelClass}>
                                <CalendarDays size={16} />
                                Date
                              </div>

                              <p className="relative mt-1.5 text-sm font-black leading-6 text-slate-950 sm:mt-2">
                                {formatEventDate(event.date)}
                              </p>
                            </div>

                            <div className={`${smallGlassBoxClass} px-4 py-3.5 sm:p-4`}>
                              <div className="pointer-events-none absolute inset-x-3 top-1 h-5 rounded-full bg-white/50 blur-sm" />

                              <div className={detailLabelClass}>
                                <Clock size={16} />
                                Time
                              </div>

                              <p className="relative mt-1.5 text-sm font-black leading-6 text-slate-950 sm:mt-2">
                                {event.time || "Time will be updated"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className={`${smallGlassBoxClass} mt-3 min-h-[132px] p-4 sm:mt-4 sm:min-h-[150px] sm:p-5`}>
                          <div className="pointer-events-none absolute inset-x-4 top-1 h-6 rounded-full bg-white/50 blur-sm" />

                          <div className="relative flex h-full items-start gap-3 sm:gap-4">
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-gradient-to-br from-rose-700 via-rose-600 to-pink-500 text-white shadow-[0_10px_22px_rgba(244,63,94,0.15)] sm:h-12 sm:w-12 sm:rounded-2xl">
                              <div className="pointer-events-none absolute inset-x-2 top-1 h-4 rounded-full bg-white/25 blur-sm" />
                              <MapPin size={20} />
                            </div>

                            <div className="min-w-0 flex-1 pt-0.5">
                              <p className="line-clamp-2 text-base font-black leading-6 text-slate-950 sm:min-h-[48px]">
                                {event.venueName || "Venue will be updated"}
                              </p>

                              <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-slate-500 sm:min-h-[72px]">
                                {event.address || "Address will be updated soon."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {event.description && (
                          <p className="mt-4 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                            {event.description}
                          </p>
                        )}

                        <div className="mt-auto pt-5">
                          <div className="flex flex-col gap-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
                            <p className="flex min-w-0 items-center gap-2 text-xs font-bold text-slate-500 sm:text-sm">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-600" />
                              <span className="truncate">Join us with your blessings</span>
                            </p>

                            {event.mapLink && (
                              <a
                                href={event.mapLink}
                                target="_blank"
                                rel="noreferrer"
                                className="group/link relative inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_10px_22px_rgba(15,23,42,0.16)] transition hover:bg-rose-700 min-[390px]:w-auto"
                              >
                                <span className="pointer-events-none absolute inset-x-4 top-1 h-4 rounded-full bg-white/15 blur-sm" />
                                <span className="relative">Location</span>
                                <ChevronRight
                                  size={16}
                                  className="relative transition group-hover/link:translate-x-1"
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;