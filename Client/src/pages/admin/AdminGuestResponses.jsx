import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Mail, Phone, Search, Trash2, UserCheck, UserX, Users } from "lucide-react";

import { useDeleteGuestResponse, useGuestResponses, useUpdateGuestResponse } from "../../hooks/useGuestResponses";
import useConfirmStore from "../../store/confirmStore";
import { ActionButton, AdminCard, EmptyAdminState, ErrorPanel, LoadingPanel, PageHero, SearchInput, Select, StatCard, StatusBadge, formatAdminDate } from "../../components/admin/AdminUI";

const AdminGuestResponses = () => {
  const openConfirm = useConfirmStore((state) => state.openConfirm);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  const { data, isLoading, isError, error } = useGuestResponses();
  const updateMutation = useUpdateGuestResponse();
  const deleteMutation = useDeleteGuestResponse();

  const responses = useMemo(() => data?.data || [], [data?.data]);
  const attending = responses.filter((response) => response.attending);
  const notAttending = responses.filter((response) => !response.attending);
  const totalGuests = attending.reduce((total, response) => total + Number(response.guestCount || 0), 0);

  const filtered = useMemo(() => responses.filter((response) => {
    const text = `${response.name || ""} ${response.email || ""} ${response.phone || ""} ${response.event || ""} ${response.message || ""}`.toLowerCase();
    const searchOk = text.includes(searchTerm.toLowerCase());
    const attendanceOk = attendanceFilter === "all" || (attendanceFilter === "attending" ? response.attending : !response.attending);
    const eventOk = eventFilter === "all" || response.event === eventFilter;
    return searchOk && attendanceOk && eventOk;
  }), [responses, searchTerm, attendanceFilter, eventFilter]);

  const filteredGuests = filtered.filter((item) => item.attending).reduce((total, item) => total + Number(item.guestCount || 0), 0);
  const isPending = updateMutation.isPending || deleteMutation.isPending;

  const handleToggleAttendance = (response) => {
    updateMutation.mutate({ id: response._id, guestResponseData: { attending: !response.attending } }, {
      onSuccess: () => toast.success(response.attending ? "Marked as not attending." : "Marked as attending."),
      onError: () => toast.error("Unable to update attendance."),
    });
  };

  const handleDelete = (id) => {
    openConfirm({
      title: "Delete guest response?",
      message: "This RSVP record will be removed permanently.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Guest response deleted."),
        onError: () => toast.error("Unable to delete response."),
      }),
    });
  };

  if (isLoading) return <LoadingPanel message="Loading guest responses..." />;
  if (isError) return <ErrorPanel message={error?.response?.data?.message || "Unable to load guest responses."} />;

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Attendance Desk" title="Manage every RSVP clearly" description="Filter guests, count expected attendees and keep the event list accurate for planning." icon={Users} gradient="emerald">
        <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <p className="text-xs font-bold text-white/65">Filtered guests</p>
          <p className="mt-1 text-4xl font-black">{filteredGuests}</p>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Responses" value={responses.length} icon={Users} tone="sky" />
        <StatCard label="Attending" value={attending.length} icon={UserCheck} tone="emerald" />
        <StatCard label="Not Attending" value={notAttending.length} icon={UserX} tone="rose" />
        <StatCard label="Total Guests" value={totalGuests} icon={CheckCircle2} tone="violet" />
      </div>

      <AdminCard>
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto] lg:items-end">
          <SearchInput value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, phone, email or message..." />
          <Select value={attendanceFilter} onChange={(event) => setAttendanceFilter(event.target.value)} options={[{ label: "All Attendance", value: "all" }, { label: "Attending", value: "attending" }, { label: "Not Attending", value: "notAttending" }]} />
          <Select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)} options={[{ label: "All Events", value: "all" }, "Engagement", "Marriage", "Both"]} />
          <ActionButton variant="ghost" onClick={() => { setSearchTerm(""); setAttendanceFilter("all"); setEventFilter("all"); }}><Search size={16} /> Clear</ActionButton>
        </div>
      </AdminCard>

      <div className="space-y-4">
        {filtered.length === 0 ? <EmptyAdminState title="No RSVP records found" description="No guest response matches the current filters." /> : filtered.map((response) => (
          <AdminCard key={response._id}>
            <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={response.attending ? "active" : "rejected"}>{response.attending ? "Attending" : "Not Attending"}</StatusBadge>
                  <StatusBadge tone="info">{response.event}</StatusBadge>
                  <StatusBadge tone="slate">{formatAdminDate(response.createdAt)}</StatusBadge>
                </div>
                <h3 className="mt-4 text-2xl font-black text-slate-950">{response.name}</h3>
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                  {response.phone && <span className="inline-flex items-center gap-2"><Phone size={15} className="text-emerald-600" />{response.phone}</span>}
                  {response.email && <span className="inline-flex items-center gap-2"><Mail size={15} className="text-sky-600" />{response.email}</span>}
                  <span className="inline-flex items-center gap-2"><Users size={15} className="text-indigo-600" />{response.guestCount || 1} guest(s)</span>
                </div>
                {response.message && <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-600">“{response.message}”</p>}
              </div>
              <div className="flex flex-wrap gap-2 xl:flex-col">
                <ActionButton variant={response.attending ? "warning" : "success"} onClick={() => handleToggleAttendance(response)} disabled={isPending}>
                  {response.attending ? <UserX size={16} /> : <UserCheck size={16} />} {response.attending ? "Mark No" : "Mark Yes"}
                </ActionButton>
                <ActionButton variant="danger" onClick={() => handleDelete(response._id)} disabled={isPending}><Trash2 size={16} /> Delete</ActionButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
};

export default AdminGuestResponses;
