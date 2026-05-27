import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Eye, EyeOff, Film, ImagePlus, Search, Star, Trash2, Upload } from "lucide-react";

import { useAdminGallery, useCreateGalleryItem, useDeleteGalleryItem, useUpdateGalleryItem } from "../../hooks/useGallery";
import { useUploadMedia } from "../../hooks/useUpload";
import useConfirmStore from "../../store/confirmStore";
import { ActionButton, AdminCard, EmptyAdminState, ErrorPanel, Field, LoadingPanel, PageHero, SearchInput, Select, StatCard, StatusBadge, TextArea } from "../../components/admin/AdminUI";

const categories = ["Engagement", "Marriage", "Couple", "Family", "Friends", "Other"];
const blankForm = { title: "", type: "photo", category: "Couple", url: "", description: "", isFeatured: false, isVisible: true, order: 0 };

const AdminGallery = () => {
  const openConfirm = useConfirmStore((state) => state.openConfirm);
  const [formData, setFormData] = useState(blankForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data, isLoading, isError, error } = useAdminGallery({ limit: 250 });
  const uploadMutation = useUploadMedia();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const items = useMemo(() => data?.data || [], [data?.data]);
  const photos = items.filter((item) => item.type === "photo").length;
  const videos = items.filter((item) => item.type === "video").length;
  const visible = items.filter((item) => item.isVisible).length;
  const featured = items.filter((item) => item.isFeatured).length;

  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.title || ""} ${item.category || ""} ${item.description || ""}`.toLowerCase();
    const searchOk = text.includes(searchTerm.toLowerCase());
    const typeOk = typeFilter === "all" || item.type === typeFilter;
    const categoryOk = categoryFilter === "all" || item.category === categoryFilter;
    return searchOk && typeOk && categoryOk;
  }), [items, searchTerm, typeFilter, categoryFilter]);

  const resetForm = () => { setFormData(blankForm); setSelectedFile(null); setEditingId(null); };
  const isPending = uploadMutation.isPending || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setSelectedFile(null);
    setFormData({
      title: item.title || "",
      type: item.type || "photo",
      category: item.category || "Other",
      url: item.url || "",
      description: item.description || "",
      isFeatured: Boolean(item.isFeatured),
      isVisible: Boolean(item.isVisible),
      order: item.order || 0,
    });
  };

  const getUrl = async () => {
    if (!selectedFile) return formData.url;
    const response = await uploadMutation.mutateAsync(selectedFile);
    return response?.data?.url || response?.url || formData.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim()) { toast.error("Title is required."); return; }
    if (!selectedFile && !formData.url.trim()) { toast.error("Upload a file or paste media URL."); return; }

    try {
      const mediaUrl = await getUrl();
      const payload = { ...formData, url: mediaUrl, order: Number(formData.order || 0) };
      if (editingId) await updateMutation.mutateAsync({ id: editingId, galleryData: payload });
      else await createMutation.mutateAsync(payload);
      toast.success(editingId ? "Media updated." : "Media added.");
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unable to save media.");
    }
  };

  const quickUpdate = (item, updates, message) => {
    updateMutation.mutate({ id: item._id, galleryData: { ...item, ...updates } }, {
      onSuccess: () => toast.success(message),
      onError: () => toast.error("Unable to update media."),
    });
  };

  const handleDelete = (id) => {
    openConfirm({
      title: "Delete media?",
      message: "This photo/video will be removed from gallery.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => deleteMutation.mutate(id, { onSuccess: () => toast.success("Media deleted."), onError: () => toast.error("Unable to delete media.") }),
    });
  };

  if (isLoading) return <LoadingPanel message="Loading gallery..." />;
  if (isError) return <ErrorPanel message={error?.response?.data?.message || "Unable to load gallery."} />;

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Media Control" title="Curate the wedding gallery" description="Upload, feature and organize photos or videos with a premium media dashboard." icon={Camera} gradient="violet">
        <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <div><p className="text-xs font-bold text-white/65">Visible</p><p className="mt-1 text-3xl font-black">{visible}</p></div>
          <div><p className="text-xs font-bold text-white/65">Featured</p><p className="mt-1 text-3xl font-black">{featured}</p></div>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Media" value={items.length} icon={Camera} tone="violet" />
        <StatCard label="Photos" value={photos} icon={ImagePlus} tone="sky" />
        <StatCard label="Videos" value={videos} icon={Film} tone="amber" />
        <StatCard label="Featured" value={featured} icon={Star} tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <AdminCard className="xl:sticky xl:top-28 xl:self-start">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div><h2 className="text-xl font-black text-slate-950">{editingId ? "Edit media" : "Add media"}</h2><p className="mt-1 text-sm font-semibold text-slate-500">Upload or paste a direct media URL.</p></div>
            {editingId && <ActionButton variant="ghost" onClick={resetForm}>Clear</ActionButton>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Beautiful moment" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Type" name="type" value={formData.type} onChange={handleChange} options={["photo", "video"]} />
              <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={categories} />
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50">
              <Upload className="h-8 w-8 text-indigo-600" />
              <span className="mt-3 text-sm font-black text-slate-800">{selectedFile ? selectedFile.name : "Choose photo or video"}</span>
              <span className="mt-1 text-xs font-semibold text-slate-500">Optional if URL is already available</span>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
            </label>
            <Field label="Media URL" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." />
            <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Order" type="number" name="order" value={formData.order} onChange={handleChange} />
              <Select label="Visible" name="isVisible" value={String(formData.isVisible)} onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.value === "true" }))} options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} />
              <Select label="Featured" name="isFeatured" value={String(formData.isFeatured)} onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.value === "true" }))} options={[{ label: "No", value: "false" }, { label: "Yes", value: "true" }]} />
            </div>
            <ActionButton variant="primary" className="w-full py-3" loading={isPending} onClick={handleSubmit}><Upload size={17} /> {editingId ? "Update Media" : "Add Media"}</ActionButton>
          </form>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard>
            <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto] lg:items-end">
              <SearchInput value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search media..." />
              <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} options={[{ label: "All Types", value: "all" }, "photo", "video"]} />
              <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} options={[{ label: "All Categories", value: "all" }, ...categories]} />
              <ActionButton variant="ghost" onClick={() => { setSearchTerm(""); setTypeFilter("all"); setCategoryFilter("all"); }}><Search size={16} /> Clear</ActionButton>
            </div>
          </AdminCard>

          {filtered.length === 0 ? <EmptyAdminState title="No media found" description="No gallery item matches current filters." /> : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((item) => (
                <AdminCard key={item._id} className="overflow-hidden p-0">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {item.type === "video" ? <video src={item.url} className="h-full w-full object-cover" muted playsInline /> : <img src={item.url} alt={item.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={item.isVisible ? "active" : "rejected"}>{item.isVisible ? "Visible" : "Hidden"}</StatusBadge>
                      {item.isFeatured && <StatusBadge tone="featured">Featured</StatusBadge>}
                      <StatusBadge tone="info">{item.category}</StatusBadge>
                    </div>
                    <h3 className="mt-3 line-clamp-1 text-lg font-black text-slate-950">{item.title}</h3>
                    {item.description && <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-500">{item.description}</p>}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <ActionButton variant="ghost" onClick={() => handleEdit(item)}>Edit</ActionButton>
                      <ActionButton variant="ghost" onClick={() => quickUpdate(item, { isVisible: !item.isVisible }, item.isVisible ? "Media hidden." : "Media visible.")}>{item.isVisible ? <EyeOff size={15} /> : <Eye size={15} />} {item.isVisible ? "Hide" : "Show"}</ActionButton>
                      <ActionButton variant="ghost" onClick={() => quickUpdate(item, { isFeatured: !item.isFeatured }, item.isFeatured ? "Unfeatured." : "Featured.")}><Star size={15} /> {item.isFeatured ? "Unfeature" : "Feature"}</ActionButton>
                      <ActionButton variant="danger" onClick={() => handleDelete(item._id)}><Trash2 size={15} /> Delete</ActionButton>
                    </div>
                  </div>
                </AdminCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
