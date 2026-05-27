import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CheckCircle2, Heart, MessageCircleHeart, Star, Trash2, XCircle } from "lucide-react";

import api from "../../api/axiosInstance";
import { ActionButton, AdminCard, EmptyAdminState, ErrorPanel, LoadingPanel, PageHero, StatCard, StatusBadge, formatAdminDate } from "../../components/admin/AdminUI";

const AdminWishes = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["admin-wishes"], queryFn: async () => (await api.get("/wishes/admin/all")).data });
  const wishes = data?.data || [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-wishes"] });
    queryClient.invalidateQueries({ queryKey: ["featured-wishes"] });
    queryClient.invalidateQueries({ queryKey: ["wishes"] });
  };

  const approveMutation = useMutation({ mutationFn: async (id) => (await api.patch(`/wishes/admin/${id}/approve`)).data, onSuccess: invalidate });
  const rejectMutation = useMutation({ mutationFn: async (id) => (await api.patch(`/wishes/admin/${id}/reject`)).data, onSuccess: invalidate });
  const featureMutation = useMutation({ mutationFn: async (id) => (await api.patch(`/wishes/admin/${id}/featured`)).data, onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: async (id) => (await api.delete(`/wishes/admin/${id}`)).data, onSuccess: invalidate });

  const runAction = (mutation, id, success) => {
    mutation.mutate(id, { onSuccess: () => toast.success(success), onError: (err) => toast.error(err?.response?.data?.message || "Action failed.") });
  };

  const approved = wishes.filter((wish) => wish.isApproved).length;
  const featured = wishes.filter((wish) => wish.isFeatured).length;
  const pending = wishes.length - approved;
  const isPending = approveMutation.isPending || rejectMutation.isPending || featureMutation.isPending || deleteMutation.isPending;

  if (isLoading) return <LoadingPanel message="Loading wishes..." />;
  if (isError) return <ErrorPanel message={error?.response?.data?.message || "Unable to load wishes."} />;

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Blessing Review" title="Approve and feature guest wishes" description="Moderate public blessings, highlight beautiful messages, and keep the wishes wall meaningful." icon={MessageCircleHeart} gradient="amber">
        <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <p className="text-xs font-bold text-white/65">Waiting approval</p>
          <p className="mt-1 text-4xl font-black">{pending}</p>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Wishes" value={wishes.length} icon={Heart} tone="amber" />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Pending" value={pending} icon={XCircle} tone="rose" />
        <StatCard label="Featured" value={featured} icon={Star} tone="violet" />
      </div>

      <div className="grid gap-4">
        {wishes.length === 0 ? <EmptyAdminState title="No wishes yet" description="Guest blessings will appear here for review." /> : wishes.map((wish) => (
          <AdminCard key={wish._id}>
            <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={wish.isApproved ? "approved" : "pending"}>{wish.isApproved ? "Approved" : "Pending"}</StatusBadge>
                  {wish.isFeatured && <StatusBadge tone="featured">Featured</StatusBadge>}
                  <StatusBadge tone="slate">{formatAdminDate(wish.createdAt)}</StatusBadge>
                </div>
                <h3 className="mt-4 text-2xl font-black text-slate-950">{wish.name}</h3>
                {wish.relation && <p className="mt-1 text-sm font-black text-indigo-600">{wish.relation}</p>}
                <p className="mt-4 rounded-[1.25rem] bg-gradient-to-br from-amber-50 to-white px-4 py-4 text-base font-semibold leading-7 text-slate-700">“{wish.message}”</p>
              </div>
              <div className="flex flex-wrap gap-2 xl:flex-col">
                {wish.isApproved ? (
                  <ActionButton variant="warning" disabled={isPending} onClick={() => runAction(rejectMutation, wish._id, "Wish moved to pending.")}><XCircle size={16} /> Unapprove</ActionButton>
                ) : (
                  <ActionButton variant="success" disabled={isPending} onClick={() => runAction(approveMutation, wish._id, "Wish approved.")}><CheckCircle2 size={16} /> Approve</ActionButton>
                )}
                <ActionButton variant="ghost" disabled={isPending} onClick={() => runAction(featureMutation, wish._id, wish.isFeatured ? "Removed from featured." : "Wish featured.")}><Star size={16} /> {wish.isFeatured ? "Unfeature" : "Feature"}</ActionButton>
                <ActionButton variant="danger" disabled={isPending} onClick={() => runAction(deleteMutation, wish._id, "Wish deleted.")}><Trash2 size={16} /> Delete</ActionButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
};

export default AdminWishes;
