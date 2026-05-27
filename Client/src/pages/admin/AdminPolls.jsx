import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3, CheckCircle2, Edit3, PauseCircle, PlayCircle, Plus, RefreshCcw, Sparkles, Star, Trash2, Users, XCircle } from "lucide-react";

import { useAdminPolls, useCreateAdminPoll, useDeletePoll, useResetPollVotes, useUpdatePoll } from "../../hooks/usePolls";
import { ActionButton, AdminCard, EmptyAdminState, ErrorPanel, Field, LoadingPanel, PageHero, Select, StatCard, StatusBadge, TextArea } from "../../components/admin/AdminUI";

const getPercentages = (poll) => {
  const total = poll.totalVotes || 0;
  return { kevin: total ? Math.round(((poll.kevinVotes || 0) / total) * 100) : 0, jenith: total ? Math.round(((poll.jenithVotes || 0) / total) * 100) : 0 };
};

const ResultRow = ({ label, votes, percent, winner }) => (
  <div className={`rounded-2xl border p-3 ${winner ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"}`}>
    <div className="flex items-center justify-between gap-3 text-sm font-black">
      <span className="text-slate-950">{label}</span>
      <span className="text-slate-600">{percent}% · {votes || 0}</span>
    </div>
    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${label === "Kevin" ? "bg-gradient-to-r from-sky-500 to-indigo-600" : "bg-gradient-to-r from-fuchsia-500 to-rose-500"}`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

const AdminPolls = () => {
  const [filters, setFilters] = useState({ status: "all", source: "all" });
  const [createForm, setCreateForm] = useState({ question: "", isFeatured: false });
  const [editingId, setEditingId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState("");

  const { data, isLoading, isError, error } = useAdminPolls(filters);
  const createMutation = useCreateAdminPoll();
  const updateMutation = useUpdatePoll();
  const deleteMutation = useDeletePoll();
  const resetMutation = useResetPollVotes();

  const polls = data?.data || [];
  const stats = data?.stats || {};
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || resetMutation.isPending;
  const emptyText = useMemo(() => filters.status !== "all" || filters.source !== "all" ? "No poll matches selected filters." : "No poll questions created yet.", [filters]);

  const handleCreate = (event) => {
    event.preventDefault();
    if (!createForm.question.trim()) { toast.error("Please enter a poll question."); return; }
    createMutation.mutate(createForm, {
      onSuccess: () => { toast.success("Poll created."); setCreateForm({ question: "", isFeatured: false }); },
      onError: (err) => toast.error(err?.response?.data?.message || "Unable to create poll."),
    });
  };

  const updatePoll = (id, updates, success) => updateMutation.mutate({ id, updates }, { onSuccess: () => toast.success(success), onError: (err) => toast.error(err?.response?.data?.message || "Unable to update poll.") });
  const deletePoll = (id) => window.confirm("Delete this poll and all votes?") && deleteMutation.mutate(id, { onSuccess: () => toast.success("Poll deleted."), onError: () => toast.error("Unable to delete poll.") });
  const resetVotes = (id) => window.confirm("Reset all votes for this poll?") && resetMutation.mutate(id, { onSuccess: () => toast.success("Votes reset."), onError: () => toast.error("Unable to reset votes.") });

  const startEditing = (poll) => { setEditingId(poll._id); setEditingQuestion(poll.question); };
  const saveEditing = (id) => {
    if (!editingQuestion.trim()) { toast.error("Question cannot be empty."); return; }
    updatePoll(id, { question: editingQuestion }, "Question updated.");
    setEditingId(null);
    setEditingQuestion("");
  };

  if (isLoading) return <LoadingPanel message="Loading couple polls..." />;
  if (isError) return <ErrorPanel message={error?.response?.data?.message || "Unable to load polls."} />;

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Poll Control" title="Create fun Kevin vs Jenith polls" description="Approve guest-suggested questions, feature the best polls and track vote percentages clearly." icon={BarChart3} gradient="violet">
        <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <div><p className="text-xs font-bold text-white/65">Total votes</p><p className="mt-1 text-3xl font-black">{stats.totalVotes || 0}</p></div>
          <div><p className="text-xs font-bold text-white/65">Pending</p><p className="mt-1 text-3xl font-black">{stats.pending || 0}</p></div>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Polls" value={stats.total} icon={BarChart3} tone="violet" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Pending" value={stats.pending} icon={XCircle} tone="amber" />
        <StatCard label="Guest Ideas" value={stats.guestSuggested} icon={Users} tone="sky" />
        <StatCard label="Total Votes" value={stats.totalVotes} icon={Sparkles} tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <AdminCard className="xl:sticky xl:top-28 xl:self-start">
          <h2 className="text-xl font-black text-slate-950">Create admin poll</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Options are fixed as Kevin and Jenith.</p>
          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <TextArea label="Poll Question" name="question" value={createForm.question} onChange={(e) => setCreateForm((prev) => ({ ...prev, question: e.target.value }))} placeholder="Who is more likely to make everyone smile?" />
            <Select label="Feature this poll" value={String(createForm.isFeatured)} onChange={(e) => setCreateForm((prev) => ({ ...prev, isFeatured: e.target.value === "true" }))} options={[{ label: "No", value: "false" }, { label: "Yes", value: "true" }]} />
            <ActionButton variant="primary" className="w-full py-3" loading={createMutation.isPending} onClick={handleCreate}><Plus size={17} /> Create Poll</ActionButton>
          </form>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard>
            <div className="grid gap-3 md:grid-cols-[220px_220px_auto] md:items-end">
              <Select label="Status" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} options={[{ label: "All Status", value: "all" }, { label: "Pending", value: "pending" }, { label: "Approved", value: "approved" }, { label: "Rejected", value: "rejected" }]} />
              <Select label="Source" value={filters.source} onChange={(e) => setFilters((prev) => ({ ...prev, source: e.target.value }))} options={[{ label: "All Sources", value: "all" }, { label: "Admin Created", value: "admin" }, { label: "Guest Suggested", value: "guest" }]} />
              <ActionButton variant="ghost" onClick={() => setFilters({ status: "all", source: "all" })}>Reset Filters</ActionButton>
            </div>
          </AdminCard>

          {polls.length === 0 ? <EmptyAdminState title="No polls found" description={emptyText} /> : polls.map((poll) => {
            const percentages = getPercentages(poll);
            const ordered = percentages.jenith > percentages.kevin ? ["Jenith", "Kevin"] : ["Kevin", "Jenith"];
            return (
              <AdminCard key={poll._id}>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={poll.status === "approved" ? "approved" : poll.status === "rejected" ? "rejected" : "pending"}>{poll.status}</StatusBadge>
                  <StatusBadge tone={poll.isActive ? "active" : "rejected"}>{poll.isActive ? "Open" : "Closed"}</StatusBadge>
                  <StatusBadge tone="info">{poll.createdBy === "guest" ? `Guest: ${poll.guestName || "Guest"}` : "Admin Created"}</StatusBadge>
                  {poll.isFeatured && <StatusBadge tone="featured">Featured</StatusBadge>}
                </div>

                {editingId === poll._id ? (
                  <div className="mt-4 space-y-3">
                    <Field value={editingQuestion} onChange={(e) => setEditingQuestion(e.target.value)} />
                    <div className="flex flex-wrap gap-2"><ActionButton variant="success" onClick={() => saveEditing(poll._id)}>Save</ActionButton><ActionButton variant="ghost" onClick={() => setEditingId(null)}>Cancel</ActionButton></div>
                  </div>
                ) : (
                  <h3 className="mt-4 text-2xl font-black leading-snug text-slate-950">{poll.question}</h3>
                )}

                <div className="mt-5 grid gap-3">
                  {ordered.map((name) => name === "Kevin" ? <ResultRow key={name} label="Kevin" votes={poll.kevinVotes} percent={percentages.kevin} winner={percentages.kevin >= percentages.jenith && poll.totalVotes > 0} /> : <ResultRow key={name} label="Jenith" votes={poll.jenithVotes} percent={percentages.jenith} winner={percentages.jenith > percentages.kevin && poll.totalVotes > 0} />)}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <ActionButton variant="ghost" disabled={isPending} onClick={() => startEditing(poll)}><Edit3 size={16} /> Edit</ActionButton>
                  {poll.status !== "approved" && <ActionButton variant="success" disabled={isPending} onClick={() => updatePoll(poll._id, { status: "approved" }, "Poll approved.")}><CheckCircle2 size={16} /> Approve</ActionButton>}
                  {poll.status !== "rejected" && <ActionButton variant="warning" disabled={isPending} onClick={() => updatePoll(poll._id, { status: "rejected" }, "Poll rejected.")}><XCircle size={16} /> Reject</ActionButton>}
                  <ActionButton variant="ghost" disabled={isPending} onClick={() => updatePoll(poll._id, { isActive: !poll.isActive }, poll.isActive ? "Poll closed." : "Poll opened.")}>{poll.isActive ? <PauseCircle size={16} /> : <PlayCircle size={16} />} {poll.isActive ? "Close" : "Open"}</ActionButton>
                  <ActionButton variant="ghost" disabled={isPending} onClick={() => updatePoll(poll._id, { isFeatured: !poll.isFeatured }, poll.isFeatured ? "Unfeatured." : "Featured.")}><Star size={16} /> {poll.isFeatured ? "Unfeature" : "Feature"}</ActionButton>
                  <ActionButton variant="ghost" disabled={isPending} onClick={() => resetVotes(poll._id)}><RefreshCcw size={16} /> Reset</ActionButton>
                  <ActionButton variant="danger" disabled={isPending} onClick={() => deletePoll(poll._id)}><Trash2 size={16} /> Delete</ActionButton>
                </div>
              </AdminCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPolls;
