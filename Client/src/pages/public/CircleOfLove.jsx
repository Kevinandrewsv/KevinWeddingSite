import { useMemo, useState } from "react";
import {
  ArrowRight,
  Crown,
  Gem,
  Heart,
  Loader2,
  MessageCircleHeart,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  useApprovedCircleStories,
  useCreateCircleStory,
} from "../../hooks/useCircleOfLove";

const initialForm = {
  name: "",
  side: "groom",
  relationship: "",
  memoryTag: "",
  phone: "",
  story: "",
};

const sideOptions = [
  {
    value: "groom",
    label: "Groom Side",
    title: "Kevin's Circle",
    helper: "Friends, family, colleagues, and loved ones from Kevin's side.",
  },
  {
    value: "bride",
    label: "Bride Side",
    title: "Jenith's Circle",
    helper: "Friends, family, colleagues, and loved ones from Jenith's side.",
  },
  {
    value: "both",
    label: "Both Sides",
    title: "Beloved by Both",
    helper: "People connected beautifully with both Kevin and Jenith.",
  },
];

const sideTheme = {
  groom: {
    label: "Groom Side",
    title: "Kevin's Circle",
    badge: "from Kevin's side",
    icon: Crown,
    border: "border-blue-100",
    pale: "bg-blue-50",
    text: "text-blue-700",
    line: "from-blue-300 via-rose-200 to-transparent",
  },
  bride: {
    label: "Bride Side",
    title: "Jenith's Circle",
    badge: "from Jenith's side",
    icon: Gem,
    border: "border-pink-100",
    pale: "bg-pink-50",
    text: "text-pink-700",
    line: "from-pink-300 via-rose-200 to-transparent",
  },
  both: {
    label: "Both Sides",
    title: "Loved by Both",
    badge: "connected to both",
    icon: UsersRound,
    border: "border-rose-100",
    pale: "bg-rose-50",
    text: "text-rose-700",
    line: "from-rose-300 via-amber-200 to-transparent",
  },
};

const sampleStories = [
  {
    _id: "sample-groom-1",
    name: "Kevin's Friend",
    side: "groom",
    relationship: "College Friend",
    memoryTag: "Four years of friendship",
    story:
      "We studied together, shared many laughs, and I have always known Kevin as a calm, loyal, and helpful friend.",
    isFeatured: true,
  },
  {
    _id: "sample-bride-1",
    name: "Jenith's Cousin",
    side: "bride",
    relationship: "Cousin",
    memoryTag: "Family memories",
    story:
      "Jenith has always brought warmth and joy to our family. Seeing her start this new life is a beautiful blessing.",
    isFeatured: true,
  },
];

const getInitials = (name = "Guest") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") || "G";

const StoryCard = ({ story, index, compact = false }) => {
  const theme = sideTheme[story.side] || sideTheme.both;
  const Icon = theme.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
      className="group relative overflow-hidden rounded-[2rem] border border-rose-100/80 bg-white p-[1px] shadow-[0_18px_45px_rgba(244,63,94,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(244,63,94,0.12)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/35 to-pink-50/55" />
      <div className="relative overflow-hidden rounded-[1.95rem] bg-white/78 p-5 backdrop-blur-2xl sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-rose-100/60 blur-3xl" />
        <div className="pointer-events-none absolute left-6 top-2 h-10 w-32 rounded-full bg-white/55 blur-xl" />

        <div className="relative flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-700 via-pink-600 to-rose-500 text-sm font-black text-white shadow-lg shadow-rose-100">
            <span>{getInitials(story.name)}</span>
            <span className="absolute inset-x-2 top-1 h-2 rounded-full bg-white/30 blur-[2px]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${theme.border} ${theme.pale} ${theme.text}`}
              >
                <Icon size={12} />
                {theme.label}
              </span>

              {story.isFeatured && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                  <Star size={12} fill="currentColor" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="mt-3 truncate text-xl font-black text-slate-950 sm:text-2xl">
              {story.name}
            </h3>

            <p className="mt-1 text-sm font-extrabold text-rose-700">
              {story.relationship}
            </p>
          </div>
        </div>

        {story.memoryTag && (
          <div className="relative mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-rose-100 bg-white/75 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
            <Sparkles size={13} className="shrink-0 text-rose-600" />
            <span className="truncate">{story.memoryTag}</span>
          </div>
        )}

        <p
          className={`relative mt-5 text-sm font-semibold leading-7 text-slate-600 ${
            compact ? "line-clamp-5" : ""
          }`}
        >
          “{story.story}”
        </p>
      </div>
    </motion.article>
  );
};

const DesktopTimeline = ({ groomStories, brideStories }) => {
  const rows = Array.from({ length: Math.max(groomStories.length, brideStories.length) }).map(
    (_, index) => ({
      groom: groomStories[index],
      bride: brideStories[index],
    })
  );

  if (rows.length === 0) return null;

  return (
    <div className="mt-10 hidden lg:block">
      <div className="grid grid-cols-[1fr_88px_1fr] items-start gap-5 xl:gap-7">
        <div className="rounded-[2rem] border border-blue-100 bg-blue-50/55 px-6 py-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
            Groom Side
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Kevin's Circle</h2>
        </div>

        <div className="flex justify-center pt-6">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-rose-100 bg-white shadow-xl shadow-rose-100">
            <Heart className="h-7 w-7 text-rose-700" fill="currentColor" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-pink-100 bg-pink-50/55 px-6 py-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-700">
            Bride Side
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Jenith's Circle</h2>
        </div>
      </div>

      <div className="relative mt-7 grid grid-cols-[1fr_88px_1fr] gap-5 xl:gap-7">
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-rose-100 via-rose-300 to-rose-100" />

        {rows.map((row, index) => (
          <div key={`row-${index}`} className="contents">
            <div className="pb-7">{row.groom && <StoryCard story={row.groom} index={index} />}</div>

            <div className="relative flex justify-center pb-7 pt-10">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white shadow-lg shadow-rose-100">
                <Heart className="h-4 w-4 text-rose-700" fill="currentColor" />
              </span>
            </div>

            <div className="pb-7">{row.bride && <StoryCard story={row.bride} index={index} />}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CircleOfLove = () => {
  const [formData, setFormData] = useState(initialForm);

  const { data, isLoading } = useApprovedCircleStories();
  const createStoryMutation = useCreateCircleStory();

  const approvedStories = data?.data || [];
  const displayStories = approvedStories.length > 0 ? approvedStories : sampleStories;

  const groupedStories = useMemo(() => {
    return {
      groom: displayStories.filter((item) => item.side === "groom"),
      bride: displayStories.filter((item) => item.side === "bride"),
      both: displayStories.filter((item) => item.side === "both"),
    };
  }, [displayStories]);

  const totalApproved = approvedStories.length;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.relationship.trim() || !formData.story.trim()) {
      toast.error("Please fill your name, relationship, and story.");
      return;
    }

    if (formData.story.trim().length < 10) {
      toast.error("Please write a little more about your connection.");
      return;
    }

    try {
      await createStoryMutation.mutateAsync(formData);
      toast.success("Your story is submitted for approval.");
      setFormData(initialForm);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit your Circle of Love story."
      );
    }
  };

  return (
    <section className="min-h-screen overflow-hidden bg-white">
      <div className="relative px-4 pb-12 pt-5 sm:px-5 sm:pb-14 sm:pt-6 md:px-6 md:pb-16 md:pt-7 lg:px-8 lg:pb-20 lg:pt-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(255,228,230,0.85),transparent_34%),radial-gradient(circle_at_top_right,rgba(219,234,254,0.65),transparent_30%),linear-gradient(180deg,#fff,rgba(255,255,255,0))]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[2.6rem] border border-rose-100 bg-white/78 p-6 shadow-[0_24px_70px_rgba(244,63,94,0.10)] backdrop-blur-2xl sm:p-8 lg:p-10"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose-100/80 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-100/55 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-5 py-2.5 shadow-sm backdrop-blur-xl">
                  <MessageCircleHeart size={16} className="text-rose-700" />
                  <span className="text-xs font-black uppercase tracking-[0.28em] text-rose-700">
                    Guest Relationship Wall
                  </span>
                </div>

                <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  Circle of
                  <span className="block bg-gradient-to-r from-rose-700 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                    Love
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                  Every love story is surrounded by beautiful people. Share how you
                  are connected with Kevin or Jenith, and become part of their wedding
                  story.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.6rem] border border-rose-100 bg-white/75 p-4 text-center shadow-sm">
                    <p className="text-3xl font-black text-slate-950">{totalApproved}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Approved Stories
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-blue-100 bg-blue-50/70 p-4 text-center shadow-sm">
                    <p className="text-3xl font-black text-blue-700">{groupedStories.groom.length}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                      Groom Side
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-pink-100 bg-pink-50/70 p-4 text-center shadow-sm">
                    <p className="text-3xl font-black text-pink-700">{groupedStories.bride.length}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-pink-600">
                      Bride Side
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-[2.6rem] border border-rose-100 bg-white p-[1px] shadow-[0_24px_70px_rgba(244,63,94,0.10)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/45 to-pink-50/70" />
              <div className="relative overflow-hidden rounded-[2.52rem] bg-white/80 p-5 backdrop-blur-2xl sm:p-6 lg:p-7">
                <div className="pointer-events-none absolute right-5 top-4 h-16 w-56 rounded-full bg-white/55 blur-xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.26em] text-rose-700">
                      Add Your Connection
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      Tell your side of love
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-700 text-white shadow-lg shadow-rose-100">
                    <Heart size={21} fill="currentColor" />
                  </div>
                </div>

                <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Your Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="mt-2 h-13 w-full rounded-2xl border border-rose-100 bg-white/85 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      You are from
                    </span>
                    <select
                      name="side"
                      value={formData.side}
                      onChange={handleChange}
                      className="mt-2 h-13 w-full rounded-2xl border border-rose-100 bg-white/85 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                    >
                      {sideOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Relationship
                    </span>
                    <input
                      type="text"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      placeholder="Friend, cousin, colleague..."
                      className="mt-2 h-13 w-full rounded-2xl border border-rose-100 bg-white/85 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Memory Tag <span className="font-bold normal-case tracking-normal text-slate-400">optional</span>
                    </span>
                    <input
                      type="text"
                      name="memoryTag"
                      value={formData.memoryTag}
                      onChange={handleChange}
                      placeholder="Example: school days, family memories, office team"
                      className="mt-2 h-13 w-full rounded-2xl border border-rose-100 bg-white/85 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Your Connection Story
                    </span>
                    <textarea
                      name="story"
                      value={formData.story}
                      onChange={handleChange}
                      rows={5}
                      maxLength={700}
                      placeholder="Tell how you know Kevin or Jenith..."
                      className="mt-2 w-full resize-none rounded-2xl border border-rose-100 bg-white/85 px-4 py-4 text-sm font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
                    />
                    <span className="mt-2 block text-right text-xs font-bold text-slate-400">
                      {formData.story.length}/700
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={createStoryMutation.isPending}
                  className="relative mt-5 inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-700 via-pink-600 to-rose-600 px-6 text-sm font-black text-white shadow-lg shadow-rose-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  <span className="absolute inset-x-5 top-1 h-3 rounded-full bg-white/20 blur-[3px]" />
                  {createStoryMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit for Approval
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs font-bold leading-5 text-slate-500">
                  Your story will appear here after admin approval.
                </p>
              </div>
            </motion.form>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">
            {sideOptions.map((option) => {
              const theme = sideTheme[option.value];
              const Icon = theme.icon;
              return (
                <div
                  key={option.value}
                  className={`rounded-[2rem] border ${theme.border} ${theme.pale}/70 p-5 shadow-sm`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white ${theme.text} shadow-sm`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-xl font-black text-slate-950">{option.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    {option.helper}
                  </p>
                </div>
              );
            })}
          </div>

          {isLoading ? (
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-3xl border border-rose-100 bg-white px-6 py-5 text-sm font-bold text-slate-600 shadow-xl shadow-rose-100">
                <Loader2 className="h-5 w-5 animate-spin text-rose-700" />
                Loading Circle of Love stories...
              </div>
            </div>
          ) : (
            <>
              <DesktopTimeline
                groomStories={groupedStories.groom}
                brideStories={groupedStories.bride}
              />

              <div className="mt-10 grid gap-6 lg:hidden">
                {[
                  { key: "groom", label: "Groom Side", stories: groupedStories.groom },
                  { key: "bride", label: "Bride Side", stories: groupedStories.bride },
                  { key: "both", label: "Both Sides", stories: groupedStories.both },
                ].map((group) => {
                  const theme = sideTheme[group.key];
                  const Icon = theme.icon;

                  if (group.stories.length === 0) return null;

                  return (
                    <div key={group.key}>
                      <div className={`mb-4 rounded-[1.8rem] border ${theme.border} ${theme.pale} px-5 py-4`}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <Icon size={20} className={theme.text} />
                          </span>
                          <div>
                            <p className={`text-xs font-black uppercase tracking-[0.22em] ${theme.text}`}>
                              {group.label}
                            </p>
                            <h2 className="text-2xl font-black text-slate-950">
                              {theme.title}
                            </h2>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {group.stories.map((story, index) => (
                          <StoryCard key={story._id} story={story} index={index} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {groupedStories.both.length > 0 && (
                <div className="mt-8 hidden lg:block">
                  <div className="rounded-[2.2rem] border border-rose-100 bg-rose-50/55 p-6 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-700">
                      Both Sides
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">Loved by Both</h2>
                  </div>

                  <div className="mt-6 grid gap-5 xl:grid-cols-3">
                    {groupedStories.both.map((story, index) => (
                      <StoryCard key={story._id} story={story} index={index} compact />
                    ))}
                  </div>
                </div>
              )}

              {approvedStories.length === 0 && (
                <div className="mt-8 rounded-[2rem] border border-amber-100 bg-amber-50/70 px-5 py-4 text-center text-sm font-bold leading-6 text-amber-800">
                  Sample cards are shown until the first approved guest stories are added.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CircleOfLove;
