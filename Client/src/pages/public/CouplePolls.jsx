import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Crown,
  Gem,
  Heart,
  Loader2,
  MessageCircleHeart,
  Send,
  Sparkles,
  Trophy,
  UsersRound,
  Vote,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { usePublicPolls, useSuggestPoll, useVotePoll } from "../../hooks/usePolls";

const initialSuggestionForm = {
  guestName: "",
  question: "",
};

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

const samplePolls = [
  {
    _id: "sample-1",
    question: "Who is more likely to make everyone smile first?",
    kevinVotes: 34,
    jenithVotes: 42,
    totalVotes: 76,
    userVote: null,
    isFeatured: true,
  },
  {
    _id: "sample-2",
    question: "Who will remember special dates better?",
    kevinVotes: 49,
    jenithVotes: 61,
    totalVotes: 110,
    userVote: null,
    isFeatured: false,
  },
  {
    _id: "sample-3",
    question: "Who is more calm during busy wedding moments?",
    kevinVotes: 53,
    jenithVotes: 38,
    totalVotes: 91,
    userVote: null,
    isFeatured: false,
  },
];

const safeQuestionIdeas = [
  "Who is more lovable?",
  "Who smiles more?",
  "Who is more caring?",
  "Who will take more selfies?",
  "Who is more likely to plan surprises?",
  "Who will win a friendly argument?",
];

const getPollOptions = (poll) => {
  const total = poll.totalVotes || poll.kevinVotes + poll.jenithVotes || 0;
  const kevinPercentage = total ? Math.round((poll.kevinVotes / total) * 100) : 0;
  const jenithPercentage = total ? Math.round((poll.jenithVotes / total) * 100) : 0;

  return [
    {
      name: "Kevin",
      votes: poll.kevinVotes || 0,
      percentage: kevinPercentage,
      icon: Crown,
      buttonClass:
        "border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200 hover:bg-blue-100",
      barClass: "from-blue-500 via-sky-400 to-cyan-300",
      softClass: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      name: "Jenith",
      votes: poll.jenithVotes || 0,
      percentage: jenithPercentage,
      icon: Gem,
      buttonClass:
        "border-pink-100 bg-pink-50 text-pink-700 hover:border-pink-200 hover:bg-pink-100",
      barClass: "from-pink-500 via-rose-400 to-fuchsia-300",
      softClass: "bg-pink-50 text-pink-700 border-pink-100",
    },
  ].sort((a, b) => b.percentage - a.percentage || b.votes - a.votes);
};

const StatPill = ({ icon: Icon, label, value, className }) => (
  <div className={`rounded-[1.4rem] border px-4 py-3 shadow-sm backdrop-blur-xl ${className}`}>
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/75 shadow-sm">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xl font-black text-slate-950">{value || 0}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
      </div>
    </div>
  </div>
);

const PollResultBar = ({ option, isUserChoice }) => {
  const Icon = option.icon;

  return (
    <div
      className={`rounded-[1.35rem] border bg-white/85 p-3 shadow-sm ${
        isUserChoice ? "border-rose-200 ring-2 ring-rose-100" : "border-slate-100"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${option.softClass}`}>
            <Icon size={16} />
          </span>
          <div>
            <p className="text-sm font-black text-slate-950">{option.name}</p>
            <p className="text-[11px] font-bold text-slate-400">{option.votes} votes</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-950">{option.percentage}%</p>
          {isUserChoice && (
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-600">
              Your vote
            </p>
          )}
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${option.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${option.barClass}`}
        />
      </div>
    </div>
  );
};

const PollCard = ({ poll, visitorId, onVote, isVoting }) => {
  const options = getPollOptions(poll);
  const hasVoted = Boolean(poll.userVote);
  const winner = options[0];
  const total = poll.totalVotes || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className="group relative overflow-hidden rounded-[2rem] border border-rose-100/80 bg-white/88 p-4 shadow-[0_16px_45px_rgba(190,18,60,0.08)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-rose-50/40 to-pink-50/55" />
      <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-rose-100/60 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-6 top-2 h-10 rounded-full bg-white/45 blur-xl" />
      <div
        className="pointer-events-none absolute inset-0 rounded-[2rem]"
        style={{
          boxShadow:
            "inset 2px 2px 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(244,63,94,0.07)",
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {poll.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">
                  <Sparkles size={12} /> Featured
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-white/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-rose-700">
                <Heart size={12} fill="currentColor" /> Kevin vs Jenith
              </span>
            </div>

            <h2 className="text-xl font-black leading-snug text-slate-950 sm:text-2xl">
              {poll.question}
            </h2>
          </div>

          <div className="hidden shrink-0 rounded-2xl border border-rose-100 bg-white/80 p-3 text-center shadow-sm sm:block">
            <p className="text-2xl font-black text-slate-950">{total}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Votes
            </p>
          </div>
        </div>

        {!hasVoted ? (
          <div className="grid grid-cols-2 gap-3">
            {["Kevin", "Jenith"].map((name) => {
              const Icon = name === "Kevin" ? Crown : Gem;
              const colorClass =
                name === "Kevin"
                  ? "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "border-pink-100 bg-pink-50 text-pink-700 hover:bg-pink-100";

              return (
                <button
                  key={name}
                  type="button"
                  disabled={isVoting || !visitorId}
                  onClick={() => onVote(poll._id, name)}
                  className={`rounded-[1.35rem] border px-4 py-4 text-sm font-black shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${colorClass}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isVoting ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />}
                    Vote {name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.35rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
            <CheckCircle2 size={18} className="mr-2 inline" /> You voted for {poll.userVote}. Results are unlocked.
          </div>
        )}

        <div className="mt-4 space-y-3">
          {options.map((option) => (
            <PollResultBar
              key={option.name}
              option={option}
              isUserChoice={poll.userVote === option.name}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-white/80 bg-white/65 px-4 py-3">
          <p className="text-xs font-bold text-slate-500">
            Higher result always stays on top for quick reading.
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
            <Trophy size={12} /> Leading: {winner.name}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const CouplePolls = () => {
  const [visitorId] = useState(() => createVisitorId());
  const [suggestionForm, setSuggestionForm] = useState(initialSuggestionForm);

  const { data, isLoading, isError, error } = usePublicPolls(visitorId);
  const voteMutation = useVotePoll();
  const suggestMutation = useSuggestPoll();

  const polls = useMemo(() => (data?.data?.length ? data.data : samplePolls), [data?.data]);
  const stats = useMemo(() => data?.stats || {}, [data?.stats]);
  const isUsingSamples = !data?.data?.length;

  const topInsight = useMemo(() => {
    const totalVotes = stats.totalVotes || 0;
    if (!totalVotes) return "Waiting for your first vote";
    if ((stats.kevinVotes || 0) === (stats.jenithVotes || 0)) return "Kevin and Jenith are tied right now";
    return (stats.kevinVotes || 0) > (stats.jenithVotes || 0)
      ? "Kevin is leading overall"
      : "Jenith is leading overall";
  }, [stats]);

  const handleVote = (pollId, selectedOption) => {
    if (!visitorId) {
      toast.error("Please refresh once and try again.");
      return;
    }

    voteMutation.mutate(
      { pollId, visitorId, selectedOption },
      {
        onSuccess: (response) => toast.success(response?.message || "Vote saved"),
        onError: (err) => toast.error(err?.response?.data?.message || "Unable to save vote"),
      }
    );
  };

  const handleSuggestionChange = (event) => {
    const { name, value } = event.target;
    setSuggestionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuggestionSubmit = (event) => {
    event.preventDefault();

    if (!suggestionForm.question.trim()) {
      toast.error("Please enter a poll question.");
      return;
    }

    suggestMutation.mutate(suggestionForm, {
      onSuccess: (response) => {
        toast.success(response?.message || "Question submitted for approval");
        setSuggestionForm(initialSuggestionForm);
      },
      onError: (err) => toast.error(err?.response?.data?.message || "Unable to submit question"),
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative px-4 pb-10 pt-5 sm:px-5 sm:pb-12 sm:pt-6 md:px-6 md:pt-7 lg:px-8 lg:pb-14 lg:pt-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.10),transparent_32%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-[2.4rem] border border-rose-100 bg-white/88 p-5 shadow-[0_24px_70px_rgba(190,18,60,0.10)] backdrop-blur-2xl sm:p-7 lg:p-9"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-rose-50/60 to-pink-50/75" />
            <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-rose-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-4 h-72 w-72 rounded-full bg-pink-100/70 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 rounded-[2.4rem]"
              style={{
                boxShadow:
                  "inset 2px 2px 1px rgba(255,255,255,0.92), inset -1px -1px 1px rgba(244,63,94,0.08)",
              }}
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-rose-700 shadow-sm">
                  <Vote size={16} /> Guest Interaction
                </div>

                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Couple Polls
                </h1>

                <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                  Vote for Kevin or Jenith in fun wedding questions and watch the percentage change beautifully. No login needed — one vote per question from each visitor.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">
                    <Heart size={15} fill="currentColor" /> Kevin or Jenith only
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                    <CheckCircle2 size={15} /> One vote per poll
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <StatPill
                  icon={BarChart3}
                  label="Active Polls"
                  value={data?.count || polls.length}
                  className="border-rose-100 bg-white/70 text-rose-700"
                />
                <StatPill
                  icon={UsersRound}
                  label="Total Votes"
                  value={stats.totalVotes || polls.reduce((sum, item) => sum + (item.totalVotes || 0), 0)}
                  className="border-blue-100 bg-blue-50/75 text-blue-700"
                />
                <div className="sm:col-span-2 rounded-[1.6rem] border border-pink-100 bg-white/75 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-700">
                      <Trophy size={19} />
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-950">{topInsight}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Results are updated after each successful vote.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-5 md:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            {isLoading && (
              <div className="rounded-[2rem] border border-rose-100 bg-rose-50/50 p-8 text-center text-sm font-black text-rose-700">
                <Loader2 className="mx-auto mb-3 animate-spin" /> Loading couple polls...
              </div>
            )}

            {isError && (
              <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-5 text-sm font-bold text-amber-800">
                {error?.response?.data?.message || "Unable to load live polls. Sample cards are shown for preview."}
              </div>
            )}

            {isUsingSamples && !isLoading && (
              <div className="rounded-[2rem] border border-rose-100 bg-rose-50/65 p-5 text-sm font-bold leading-7 text-rose-800">
                No approved polls are live yet. These sample cards show how the page will look after admin approves poll questions.
              </div>
            )}

            {polls.map((poll) => (
              <PollCard
                key={poll._id}
                poll={poll}
                visitorId={visitorId}
                isVoting={voteMutation.isPending}
                onVote={isUsingSamples ? () => toast("Approve real polls from admin to enable voting.") : handleVote}
              />
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/88 p-5 shadow-[0_18px_55px_rgba(190,18,60,0.08)] backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-rose-50/45 to-pink-50/65" />
              <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-pink-100 blur-3xl" />
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem]"
                style={{
                  boxShadow:
                    "inset 2px 2px 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(244,63,94,0.07)",
                }}
              />

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-100">
                    <MessageCircleHeart size={22} />
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-slate-950">Suggest a Poll</h2>
                    <p className="text-xs font-bold text-slate-500">Admin approval needed before public display.</p>
                  </div>
                </div>

                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={suggestionForm.guestName}
                      onChange={handleSuggestionChange}
                      placeholder="Optional"
                      className="w-full rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                      Poll Question
                    </label>
                    <textarea
                      name="question"
                      value={suggestionForm.question}
                      onChange={handleSuggestionChange}
                      rows={4}
                      maxLength={180}
                      placeholder="Example: Who is more likely to make everyone laugh?"
                      className="w-full resize-none rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-sm font-bold leading-7 text-slate-800 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                    />
                    <p className="mt-2 text-right text-[11px] font-bold text-slate-400">
                      {suggestionForm.question.length}/180
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={suggestMutation.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {suggestMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Submit for Approval
                  </button>
                </form>

                <div className="mt-5 rounded-[1.5rem] border border-amber-100 bg-amber-50/80 p-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                    Safe question ideas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {safeQuestionIdeas.map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => setSuggestionForm((prev) => ({ ...prev, question: idea }))}
                        className="rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:text-rose-700"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-[1.5rem] border border-blue-100 bg-blue-50/70 p-4">
                  <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-blue-700" />
                  <p className="text-xs font-semibold leading-6 text-blue-800">
                    All public poll questions will always have only two options: Kevin and Jenith. Guests cannot create extra options.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CouplePolls;
