import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, HeartHandshake, Sparkles, Star, Trash2, Users, XCircle } from "lucide-react";

import { useAdminCircleStories, useApproveCircleStory, useDeleteCircleStory, useRejectCircleStory, useToggleFeaturedCircleStory } from "../../hooks/useCircleOfLove";
import { ActionButton, AdminCard, EmptyAdminState, ErrorPanel, LoadingPanel, PageHero, Select, StatCard, StatusBadge, formatAdminDate } from "../../components/admin/AdminUI";

const sideLabel = { groom: "Groom Side", bride: "Bride Side", both: "Both Sides" };

const AdminCircleOfLove = () => {
  const [filters, setFilters] = useState({ status: "all", side: "all" });
  const { data, isLoading, isError, error } = useAdminCircleStories(filters);
  const approveMutation = useApproveCircleStory();
  const rejectMutation = useRejectCircleStory();
  const featureMutation = useToggleFeaturedCircleStory();
  const deleteMutation = useDeleteCircleStory();

  const stories = data?.data || [];
  const stats = data?.stats || {};
  const isPending = approveMutation.isPending || rejectMutation.isPending || featureMutation.isPending || deleteMutation.isPending;

  const emptyText = useMemo(() => filters.status !== "all" || filters.side !== "all" ? "No story matches current filter." : "No Circle of Love stories submitted yet.", [filters]);

  const runAction = (mutation, id, success) => mutation.mutate(id, { onSuccess: () => toast.success(success), onError: (err) => toast.error(err?.response?.data?.message || "Action failed.") });

  if (isLoading) return <LoadingPanel message="Loading Circle of Love stories..." />;
  if (isError) return <ErrorPanel message={error?.response?.data?.message || "Unable to load stories."} />;

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Story Moderation" title="Shape the Circle of Love wall" description="Approve relationship stories from groom side, bride side and shared circle before publishing them." icon={HeartHandshake} gradient="rose">
        <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <div><p className="text-xs font-bold text-white/65">Pending</p><p className="mt-1 text-3xl font-black">{stats.pending || 0}</p></div>
          <div><p className="text-xs font-bold text-white/65">Featured</p><p className="mt-1 text-3xl font-black">{stats.featured || 0}</p></div>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total" value={stats.total} icon={Users} tone="sky" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Pending" value={stats.pending} icon={XCircle} tone="amber" />
        <StatCard label="Groom Side" value={stats.groom} icon={HeartHandshake} tone="violet" />
        <StatCard label="Bride Side" value={stats.bride} icon={Sparkles} tone="rose" />
      </div>

      <AdminCard>
        <div className="grid gap-3 md:grid-cols-[220px_220px_auto] md:items-end">
          <Select label="Status" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} options={[{ label: "All Status", value: "all" }, { label: "Pending", value: "pending" }, { label: "Approved", value: "approved" }]} />
          <Select label="Side" value={filters.side} onChange={(e) => setFilters((prev) => ({ ...prev, side: e.target.value }))} options={[{ label: "All Sides", value: "all" }, { label: "Groom Side", value: "groom" }, { label: "Bride Side", value: "bride" }, { label: "Both Sides", value: "both" }]} />
          <ActionButton variant="ghost" onClick={() => setFilters({ status: "all", side: "all" })}>Reset Filters</ActionButton>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {stories.length === 0 ? <div className="xl:col-span-2"><EmptyAdminState title="No stories found" description={emptyText} /></div> : stories.map((story) => (
          <AdminCard key={story._id}>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={story.isApproved ? "approved" : "pending"}>{story.isApproved ? "Approved" : "Pending"}</StatusBadge>
              <StatusBadge tone="info">{sideLabel[story.side] || story.side}</StatusBadge>
              {story.isFeatured && <StatusBadge tone="featured">Featured</StatusBadge>}
              <StatusBadge tone="slate">{formatAdminDate(story.createdAt)}</StatusBadge>
            </div>
            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-lg font-black text-white shadow-lg shadow-rose-100">
                {String(story.name || "G").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-black text-slate-950">{story.name}</h3>
                <p className="mt-1 text-sm font-black text-indigo-600">{story.relationship}</p>
                {story.memoryTag && <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{story.memoryTag}</p>}
              </div>
            </div>
            <p className="mt-5 rounded-[1.4rem] bg-slate-50 px-4 py-4 text-sm font-semibold leading-7 text-slate-700">“{story.story}”</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {story.isApproved ? <ActionButton variant="warning" disabled={isPending} onClick={() => runAction(rejectMutation, story._id, "Story moved to pending.")}><XCircle size={16} /> Unapprove</ActionButton> : <ActionButton variant="success" disabled={isPending} onClick={() => runAction(approveMutation, story._id, "Story approved.")}><CheckCircle2 size={16} /> Approve</ActionButton>}
              <ActionButton variant="ghost" disabled={isPending} onClick={() => runAction(featureMutation, story._id, story.isFeatured ? "Unfeatured." : "Featured.")}><Star size={16} /> {story.isFeatured ? "Unfeature" : "Feature"}</ActionButton>
              <ActionButton variant="danger" disabled={isPending} onClick={() => runAction(deleteMutation, story._id, "Story deleted.")}><Trash2 size={16} /> Delete</ActionButton>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
};

export default AdminCircleOfLove;
