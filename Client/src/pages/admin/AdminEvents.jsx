import { useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, CheckCircle2, Clock, Edit3, MapPin, Plus, Trash2, XCircle } from "lucide-react";

import { useCreateEvent, useDeleteEvent, useEvents, useUpdateEvent } from "../../hooks/useEvents";
import useConfirmStore from "../../store/confirmStore";
import { ActionButton, AdminCard, EmptyAdminState, ErrorPanel, Field, LoadingPanel, PageHero, Select, StatCard, StatusBadge, TextArea, formatAdminDate } from "../../components/admin/AdminUI";

const blankEvent = { title: "", date: "", time: "", venueName: "", address: "", mapLink: "", description: "", order: 0, isActive: true };

const toInputDate = (value) => (value ? new Date(value).toISOString().split("T")[0] : "");

const AdminEvents = () => {
  const openConfirm = useConfirmStore((state) => state.openConfirm);
  const { data, isLoading, isError, error } = useEvents();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const [formData, setFormData] = useState(blankEvent);
  const [editingId, setEditingId] = useState(null);

  const events = data?.data || [];
  const activeEvents = events.filter((event) => event.isActive).length;

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const resetForm = () => {
    setFormData(blankEvent);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title || "",
      date: toInputDate(event.date),
      time: event.time || "",
      venueName: event.venueName || "",
      address: event.address || "",
      mapLink: event.mapLink || "",
      description: event.description || "",
      order: event.order || 0,
      isActive: Boolean(event.isActive),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.time.trim() || !formData.venueName.trim() || !formData.address.trim()) {
      toast.error("Title, date, time, venue and address are required.");
      return;
    }

    const payload = { ...formData, order: Number(formData.order || 0) };

    const config = {
      onSuccess: () => {
        toast.success(editingId ? "Event updated." : "Event created.");
        resetForm();
      },
      onError: (err) => toast.error(err?.response?.data?.message || "Unable to save event."),
    };

    if (editingId) updateMutation.mutate({ id: editingId, eventData: payload }, config);
    else createMutation.mutate(payload, config);
  };

  const handleDelete = (id) => {
    openConfirm({
      title: "Delete event?",
      message: "This event will be removed from public event section.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => deleteMutation.mutate(id, {
        onSuccess: () => { toast.success("Event deleted."); if (editingId === id) resetForm(); },
        onError: () => toast.error("Unable to delete event."),
      }),
    });
  };

  if (isLoading) return <LoadingPanel message="Loading events..." />;
  if (isError) return <ErrorPanel message={error?.response?.data?.message || "Unable to load events."} />;

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Event Studio" title="Design the ceremony timeline" description="Create, order and publish every important wedding event with a clean admin workflow." icon={CalendarDays} gradient="sky">
        <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <div><p className="text-xs font-bold text-white/65">Total events</p><p className="mt-1 text-3xl font-black">{events.length}</p></div>
          <div><p className="text-xs font-bold text-white/65">Active</p><p className="mt-1 text-3xl font-black">{activeEvents}</p></div>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Events" value={events.length} icon={CalendarDays} tone="sky" />
        <StatCard label="Active" value={activeEvents} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Hidden" value={events.length - activeEvents} icon={XCircle} tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <AdminCard className="xl:sticky xl:top-28 xl:self-start">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div><h2 className="text-xl font-black text-slate-950">{editingId ? "Edit event" : "Create event"}</h2><p className="mt-1 text-sm font-semibold text-slate-500">Keep event data short and clear.</p></div>
            {editingId && <ActionButton variant="ghost" onClick={resetForm}>Clear</ActionButton>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Marriage Ceremony" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <Field label="Date" type="date" name="date" value={formData.date} onChange={handleChange} />
              <Field label="Time" name="time" value={formData.time} onChange={handleChange} placeholder="10:30 AM" />
            </div>
            <Field label="Venue" name="venueName" value={formData.venueName} onChange={handleChange} placeholder="VRN Mahal" />
            <TextArea label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Full location address" />
            <Field label="Map Link" name="mapLink" value={formData.mapLink} onChange={handleChange} placeholder="Google Maps URL" />
            <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Short event description" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Order" type="number" name="order" value={formData.order} onChange={handleChange} />
              <Select label="Visibility" name="isActive" value={String(formData.isActive)} onChange={(event) => setFormData((prev) => ({ ...prev, isActive: event.target.value === "true" }))} options={[{ label: "Active", value: "true" }, { label: "Hidden", value: "false" }]} />
            </div>
            <ActionButton variant="primary" className="w-full py-3" loading={isPending} onClick={handleSubmit}>
              <Plus size={17} /> {editingId ? "Update Event" : "Create Event"}
            </ActionButton>
          </form>
        </AdminCard>

        <div className="space-y-4">
          {events.length === 0 ? <EmptyAdminState title="No events created" description="Create the first event to show it on your public website." /> : events.map((event, index) => (
            <AdminCard key={event._id} className="group overflow-hidden">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={event.isActive ? "active" : "rejected"}>{event.isActive ? "Active" : "Hidden"}</StatusBadge>
                    <StatusBadge tone="info">Order {event.order ?? index + 1}</StatusBadge>
                    <StatusBadge tone="slate">{formatAdminDate(event.date)}</StatusBadge>
                  </div>
                  <h3 className="mt-4 text-2xl font-black text-slate-950">{event.title}</h3>
                  <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600 md:grid-cols-2">
                    <p className="flex items-center gap-2"><Clock size={16} className="text-indigo-500" /> {event.time}</p>
                    <p className="flex items-center gap-2"><MapPin size={16} className="text-rose-500" /> {event.venueName}</p>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-500">{event.address}</p>
                  {event.description && <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-600">{event.description}</p>}
                </div>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <ActionButton variant="ghost" onClick={() => handleEdit(event)}><Edit3 size={16} /> Edit</ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDelete(event._id)} disabled={isPending}><Trash2 size={16} /> Delete</ActionButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
