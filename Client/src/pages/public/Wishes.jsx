/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircleHeart,
  PenLine,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useCreateWish, useWishes } from "../../hooks/useWishes";
import { EmptyState, ErrorState, LoadingState } from "../../components/common";

const Wishes = () => {
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeWishIndex, setActiveWishIndex] = useState(0);

  const { data, isLoading, isError } = useWishes();
  const createWishMutation = useCreateWish();

  const wishes = useMemo(() => data?.data || [], [data]);
  const activeWish = wishes[activeWishIndex];

  const progressPercentage =
    wishes.length > 0 ? ((activeWishIndex + 1) / wishes.length) * 100 : 0;

  useEffect(() => {
    if (wishes.length === 0) return;

    setActiveWishIndex((prev) => {
      if (prev >= wishes.length) return 0;
      return prev;
    });
  }, [wishes.length]);

  const handlePrevWish = () => {
    if (wishes.length === 0) return;
    setActiveWishIndex((prev) => (prev - 1 + wishes.length) % wishes.length);
  };

  const handleNextWish = () => {
    if (wishes.length === 0) return;
    setActiveWishIndex((prev) => (prev + 1) % wishes.length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      const message = "Please enter your name and wish message.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    createWishMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Your wish has been submitted successfully.");
        setSuccessMessage("Your wish has been submitted successfully.");
        setErrorMessage("");

        setFormData({
          name: "",
          relation: "",
          message: "",
        });
      },

      onError: (error) => {
        const message =
          error?.response?.data?.message || "Failed to submit wish.";
        setErrorMessage(message);
        setSuccessMessage("");
        toast.error(message);
      },
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-10 pt-5 sm:px-5 sm:pb-14 sm:pt-6 md:px-6 md:pb-16 lg:px-8 lg:pb-20 lg:pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-rose-50/50 via-white to-white" />
      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-rose-50 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-24 h-80 w-80 rounded-full bg-pink-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-rose-700 shadow-sm backdrop-blur-xl sm:px-5 sm:text-xs sm:tracking-[0.35em]">
            <span className="h-2 w-2 rounded-full bg-rose-600" />
            Blessings Wall
          </div>

          <h1 className="mx-auto mt-4 max-w-sm text-[2.45rem] font-black leading-[1.05] tracking-tight text-gray-950 min-[390px]:text-[2.7rem] sm:max-w-none sm:text-5xl lg:text-6xl">
            Send Your Wishes
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-gray-600 sm:max-w-2xl sm:text-lg sm:leading-8">
            Share your love, blessings, and prayers for Kevin and Jenith.
          </p>

          <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-rose-100 bg-white/85 px-4 py-2 text-xs font-black text-rose-700 shadow-sm backdrop-blur-xl sm:hidden">
            <Heart size={14} fill="currentColor" />
            {wishes.length} approved wishes
          </div>
        </motion.div>

        <div className="mt-7 grid gap-8 md:mx-auto md:max-w-3xl lg:max-w-none lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <motion.form
            initial={{ opacity: 0, x: -26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="relative flex flex-col rounded-[1.8rem] border border-rose-100/70 bg-white/88 px-4 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:rounded-[2rem] sm:px-6 sm:py-6 lg:min-h-[520px] lg:border-transparent lg:bg-white lg:px-6 lg:py-2 lg:shadow-none"
          >
            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-rose-700 text-white shadow-lg shadow-rose-100 sm:h-14 sm:w-14 sm:rounded-[1.4rem]">
                    <MessageCircleHeart size={24} />
                  </div>

                  <h2 className="mt-5 text-2xl font-black tracking-tight text-gray-950 sm:mt-6 sm:text-4xl">
                    Write a Blessing
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-6 text-gray-500 sm:hidden">
                    Your message will appear after approval.
                  </p>
                </div>

                <div className="hidden shrink-0 text-center sm:block">
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[conic-gradient(from_180deg,#be123c_0deg,#ffe4ec_95deg,#ffffff_180deg,#ffe4ec_260deg,#be123c_360deg)] p-[2px] shadow-[0_16px_35px_rgba(15,23,42,0.08)]">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                      <p className="text-3xl font-black leading-none text-rose-700">
                        {wishes.length}
                      </p>
                      <Heart
                        size={14}
                        className="mt-1 text-rose-600"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] font-black uppercase tracking-[0.26em] text-gray-500">
                    Wishes
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2">
                <label className="group block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
                    <UserRound size={16} className="text-rose-600" />
                    Your Name
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="h-13 w-full border-0 border-b-2 border-rose-100 bg-transparent px-1 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-600 sm:h-14"
                  />
                </label>

                <label className="group block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
                    <Heart size={16} className="text-rose-600" />
                    Relation
                  </span>

                  <input
                    type="text"
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    placeholder="Friend, Uncle, Cousin..."
                    className="h-13 w-full border-0 border-b-2 border-rose-100 bg-transparent px-1 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-600 sm:h-14"
                  />
                </label>
              </div>

              <label className="mt-6 block sm:mt-7">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
                  <PenLine size={16} className="text-rose-600" />
                  Your Wish
                </span>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your heartfelt wishes here..."
                  rows="5"
                  maxLength="500"
                  className="h-36 w-full resize-none rounded-[1.4rem] border border-rose-100 bg-white px-4 py-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100 sm:h-40 sm:rounded-[1.7rem] sm:px-5"
                />
              </label>

              <div className="mt-3 flex flex-col gap-2 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <ShieldCheck size={15} className="text-rose-600" />
                  Appears after approval
                </div>

                <div className="text-xs font-black text-gray-500 sm:text-sm">
                  {formData.message.length}/500
                </div>
              </div>

              {successMessage && (
                <p className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  {successMessage}
                </p>
              )}

              {errorMessage && (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="relative mt-6 lg:mt-auto lg:pt-6">
              <button
                type="submit"
                disabled={createWishMutation.isPending}
                className="group inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-gray-200 transition hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-rose-100 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {createWishMutation.isPending ? "Sending..." : "Send Wish"}
                <Send
                  size={18}
                  className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[1.8rem] border border-rose-100/80 p-4 backdrop-blur-2xl sm:rounded-[2.2rem] sm:p-6 lg:p-8"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,246,249,0.94) 38%, rgba(255,241,246,0.92) 100%)",
              boxShadow:
                "0 18px 45px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-[linear-gradient(120deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.18)_35%,rgba(255,255,255,0.07)_100%)]" />
            <div className="pointer-events-none absolute left-6 top-5 h-16 w-[38%] rounded-full bg-white/80 blur-2xl" />

            <div className="relative flex h-full flex-col lg:min-h-[520px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/90 text-rose-700 backdrop-blur-xl sm:h-14 sm:w-14 sm:rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,248,250,0.78) 100%)",
                      boxShadow:
                        "0 10px 22px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
                    }}
                  >
                    <Sparkles size={22} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                      Lovely Wishes
                    </h2>
                    <p className="mt-1 text-sm font-medium text-gray-600 sm:text-base">
                      Blessings from our dear ones.
                    </p>
                  </div>
                </div>

                <div
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/90 px-4 py-2 text-xs font-black text-rose-700 backdrop-blur-xl sm:text-sm"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,247,249,0.82) 100%)",
                    boxShadow:
                      "0 10px 24px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
                  }}
                >
                  <Heart size={15} fill="currentColor" />
                  {wishes.length} Approved
                </div>
              </div>

              {isLoading && (
                <div className="mt-8">
                  <LoadingState message="Loading wishes..." />
                </div>
              )}

              {isError && (
                <div className="mt-8">
                  <ErrorState message="Failed to load wishes." />
                </div>
              )}

              {!isLoading && !isError && wishes.length === 0 && (
                <div className="mt-8">
                  <EmptyState
                    title="No Wishes Yet"
                    message="Be the first one to send your blessings."
                  />
                </div>
              )}

              {!isLoading && !isError && wishes.length > 0 && activeWish && (
                <div className="flex flex-1 flex-col justify-center pt-5 sm:pt-6">
                  <div
                    className="relative flex min-h-[390px] overflow-hidden rounded-[1.7rem] border border-white/90 p-4 backdrop-blur-2xl sm:min-h-[420px] sm:rounded-[2rem] sm:p-6 lg:h-[400px] lg:min-h-0 lg:p-9"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.78) 0%, rgba(255,249,251,0.62) 40%, rgba(255,241,246,0.58) 100%)",
                      boxShadow:
                        "0 18px 45px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.96), inset 0 -1px 0 rgba(255,255,255,0.35)",
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.3)_42%,rgba(255,236,242,0.22)_100%)]" />
                    <div className="pointer-events-none absolute left-8 top-6 h-14 w-[46%] rounded-full bg-white/85 blur-2xl" />

                    <div className="relative flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/90 text-rose-700 backdrop-blur-xl sm:h-12 sm:w-12 sm:rounded-3xl"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,247,249,0.82) 100%)",
                            boxShadow:
                              "0 8px 20px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
                          }}
                        >
                          <Quote size={22} />
                        </div>

                        <div
                          className="shrink-0 rounded-full border border-white/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-rose-700 backdrop-blur-xl sm:px-4 sm:text-xs sm:tracking-[0.2em]"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,247,249,0.82) 100%)",
                            boxShadow:
                              "0 8px 18px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
                          }}
                        >
                          Wish {activeWishIndex + 1}/{wishes.length}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeWish._id || activeWishIndex}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -18 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="mt-5 flex min-h-0 flex-1 flex-col sm:mt-7"
                        >
                          <div className="max-h-[175px] overflow-y-auto pr-1 sm:max-h-[195px] lg:max-h-[155px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <p className="whitespace-pre-line break-words text-[1.35rem] font-semibold leading-[1.6] text-gray-800 sm:text-2xl sm:leading-[1.6] lg:text-3xl lg:leading-[1.55]">
                              {`“${activeWish.message}”`
                                .split(" ")
                                .map((word, index) => (
                                  <motion.span
                                    key={`${word}-${index}`}
                                    initial={{
                                      filter: "blur(8px)",
                                      opacity: 0,
                                      y: 8,
                                    }}
                                    animate={{
                                      filter: "blur(0px)",
                                      opacity: 1,
                                      y: 0,
                                    }}
                                    transition={{
                                      duration: 0.2,
                                      ease: "easeInOut",
                                      delay: 0.018 * index,
                                    }}
                                    className="inline-block max-w-full break-words"
                                  >
                                    {word}&nbsp;
                                  </motion.span>
                                ))}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center gap-3 border-t border-white/80 pt-4 sm:gap-4 sm:pt-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-700 text-base font-black uppercase text-white shadow-lg shadow-rose-100 sm:h-12 sm:w-12 sm:text-lg">
                              {activeWish.name?.charAt(0) || "G"}
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-black text-gray-950 sm:text-xl">
                                {activeWish.name}
                              </h3>

                              {activeWish.relation && (
                                <p className="mt-1 truncate text-sm font-semibold text-gray-500">
                                  {activeWish.relation}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 sm:text-xs sm:tracking-[0.22em]">
                          Showing{" "}
                          <span className="text-rose-700">
                            {activeWishIndex + 1}
                          </span>{" "}
                          of {wishes.length}
                        </p>

                        <p className="hidden text-xs font-bold text-gray-400 sm:block">
                          Click arrows to view
                        </p>
                      </div>

                      <div
                        className="mt-3 h-2 overflow-hidden rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,241,246,0.6) 100%)",
                          boxShadow: "inset 0 1px 3px rgba(15,23,42,0.08)",
                        }}
                      >
                        <motion.div
                          key={activeWishIndex}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="h-full rounded-full bg-rose-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:flex sm:shrink-0 sm:items-center">
                      <button
                        type="button"
                        onClick={handlePrevWish}
                        disabled={wishes.length <= 1}
                        aria-label="Previous wish"
                        className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/90 px-4 text-sm font-black text-gray-950 backdrop-blur-xl transition hover:bg-rose-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11 sm:rounded-full sm:px-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,247,249,0.82) 100%)",
                          boxShadow:
                            "0 8px 18px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
                        }}
                      >
                        <ChevronLeft size={21} />
                        <span className="sm:hidden">Previous</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextWish}
                        disabled={wishes.length <= 1}
                        aria-label="Next wish"
                        className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gray-950 px-4 text-sm font-black text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11 sm:rounded-full sm:px-0"
                      >
                        <span className="sm:hidden">Next</span>
                        <ChevronRight size={21} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Wishes;