import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bot, CheckCircle2, MessageSquareText, Sparkles, Trash2, XCircle } from "lucide-react";

import { useChatbotMessages, useDeleteChatbotMessage, useUpdateChatbotMessage } from "../../hooks/useChatbot";
import { ActionButton, AdminCard, EmptyAdminState, ErrorPanel, LoadingPanel, PageHero, Select, StatCard, StatusBadge, formatAdminDate } from "../../components/admin/AdminUI";

const typeLabel = { suggestion: "Suggestion", question: "Question", issue: "Issue", appreciation: "Love Note", general: "General" };

const AdminChatbotMessages = () => {
  const [filters, setFilters] = useState({ status: "all", type: "all" });
  const { data, isLoading, isError, error } = useChatbotMessages(filters);
  const updateMutation = useUpdateChatbotMessage();
  const deleteMutation = useDeleteChatbotMessage();

  const messages = data?.data || [];
  const stats = data?.stats || {};
  const isPending = updateMutation.isPending || deleteMutation.isPending;
  const emptyText = useMemo(() => filters.status !== "all" || filters.type !== "all" ? "No message matches current filters." : "No chatbot messages yet.", [filters]);

  const toggleReview = (message) => updateMutation.mutate({ id: message._id, messageData: { isReviewed: !message.isReviewed } }, {
    onSuccess: () => toast.success(message.isReviewed ? "Marked as pending." : "Marked as reviewed."),
    onError: () => toast.error("Unable to update message."),
  });

  const deleteMessage = (id) => deleteMutation.mutate(id, { onSuccess: () => toast.success("Message deleted."), onError: () => toast.error("Unable to delete message.") });

  if (isLoading) return <LoadingPanel message="Loading assistant inbox..." />;
  if (isError) return <ErrorPanel message={error?.response?.data?.message || "Unable to load messages."} />;

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Assistant Inbox" title="Review chatbot questions and website suggestions" description="Keep guest doubts, feedback and feature suggestions organized in one modern inbox." icon={Bot} gradient="sky">
        <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <p className="text-xs font-bold text-white/65">Pending messages</p>
          <p className="mt-1 text-4xl font-black">{stats.pending || 0}</p>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total" value={stats.total} icon={MessageSquareText} tone="sky" />
        <StatCard label="Pending" value={stats.pending} icon={XCircle} tone="amber" />
        <StatCard label="Reviewed" value={stats.reviewed} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Suggestions" value={stats.suggestions} icon={Sparkles} tone="violet" />
        <StatCard label="Questions" value={stats.questions} icon={Bot} tone="rose" />
      </div>

      <AdminCard>
        <div className="grid gap-3 md:grid-cols-[220px_220px_auto] md:items-end">
          <Select label="Status" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} options={[{ label: "All Status", value: "all" }, { label: "Pending", value: "pending" }, { label: "Reviewed", value: "reviewed" }]} />
          <Select label="Type" value={filters.type} onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))} options={[{ label: "All Types", value: "all" }, "suggestion", "question", "issue", "appreciation", "general"]} />
          <ActionButton variant="ghost" onClick={() => setFilters({ status: "all", type: "all" })}>Reset Filters</ActionButton>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {messages.length === 0 ? <div className="xl:col-span-2"><EmptyAdminState title="No messages found" description={emptyText} /></div> : messages.map((message) => (
          <AdminCard key={message._id}>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={message.isReviewed ? "approved" : "pending"}>{message.isReviewed ? "Reviewed" : "Pending"}</StatusBadge>
              <StatusBadge tone="info">{typeLabel[message.type] || message.type}</StatusBadge>
              <StatusBadge tone="slate">{formatAdminDate(message.createdAt)}</StatusBadge>
            </div>
            <h3 className="mt-4 text-2xl font-black text-slate-950">{message.name || "Guest"}</h3>
            {message.phone && <p className="mt-1 text-sm font-bold text-slate-500">Phone: {message.phone}</p>}
            <p className="mt-4 rounded-[1.4rem] bg-slate-50 px-4 py-4 text-sm font-semibold leading-7 text-slate-700">{message.message}</p>
            {message.adminNote && <p className="mt-3 rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700">Admin note: {message.adminNote}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              <ActionButton variant={message.isReviewed ? "warning" : "success"} disabled={isPending} onClick={() => toggleReview(message)}>{message.isReviewed ? <XCircle size={16} /> : <CheckCircle2 size={16} />} {message.isReviewed ? "Mark Pending" : "Mark Reviewed"}</ActionButton>
              <ActionButton variant="danger" disabled={isPending} onClick={() => deleteMessage(message._id)}><Trash2 size={16} /> Delete</ActionButton>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
};

export default AdminChatbotMessages;
