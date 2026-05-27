/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion";
import { Loader2, Search, Sparkles } from "lucide-react";

export const adminGradients = {
  sky: "from-sky-500 via-blue-600 to-indigo-700",
  violet: "from-violet-500 via-fuchsia-600 to-pink-600",
  emerald: "from-emerald-500 via-teal-600 to-cyan-700",
  amber: "from-amber-400 via-orange-500 to-rose-600",
  rose: "from-rose-500 via-pink-600 to-fuchsia-700",
  slate: "from-slate-900 via-slate-800 to-indigo-950",
};

export const PageHero = ({ eyebrow, title, description, icon: Icon = Sparkles, gradient = "slate", children }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${adminGradients[gradient] || adminGradients.slate} p-5 text-white shadow-2xl shadow-slate-200/70 sm:p-7 lg:p-8`}
  >
    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
    <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
    <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-white/20 lg:block" />
    <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur-xl">
          <Icon size={15} />
          {eyebrow}
        </div>
        <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/78 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  </motion.section>
);

export const StatCard = ({ label, value, icon: Icon, tone = "slate", sub }) => {
  const toneMap = {
    sky: "border-sky-100 bg-sky-50 text-sky-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    rose: "border-rose-100 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-white text-slate-700",
  };
  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-sm shadow-slate-200/50 ${toneMap[tone] || toneMap.slate}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5">
          {Icon && <Icon size={20} />}
        </div>
        <p className="text-3xl font-black tracking-tight text-slate-950">{value ?? 0}</p>
      </div>
      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em]">{label}</p>
      {sub && <p className="mt-1 text-xs font-semibold opacity-75">{sub}</p>}
    </div>
  );
};

export const AdminCard = ({ children, className = "" }) => (
  <div className={`rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/70 sm:p-5 ${className}`}>
    {children}
  </div>
);

export const Field = ({ label, className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>}
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${className}`}
    />
  </label>
);

export const TextArea = ({ label, className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>}
    <textarea
      {...props}
      className={`min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${className}`}
    />
  </label>
);

export const Select = ({ label, options = [], className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>}
    <select
      {...props}
      className={`h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${className}`}
    >
      {options.map((option) => {
        const value = option.value ?? option;
        const labelText = option.label ?? option;
        return <option key={value} value={value}>{labelText}</option>;
      })}
    </select>
  </label>
);

export const SearchInput = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
    />
  </div>
);

export const ActionButton = ({ children, variant = "primary", className = "", loading = false, ...props }) => {
  const variants = {
    primary: "bg-slate-950 text-white hover:bg-indigo-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    ghost: "border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700",
    dark: "bg-slate-900 text-white hover:bg-slate-800",
  };
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export const StatusBadge = ({ children, tone = "slate" }) => {
  const tones = {
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    featured: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
    info: "border-sky-200 bg-sky-50 text-sky-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
};

export const LoadingPanel = ({ message = "Loading..." }) => (
  <div className="grid min-h-[52vh] place-items-center">
    <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center gap-3 text-sm font-black text-slate-700">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        {message}
      </div>
    </div>
  </div>
);

export const EmptyAdminState = ({ title = "No data found", description = "Try changing filters or add a new item." }) => (
  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
      <Sparkles size={22} />
    </div>
    <h3 className="mt-4 text-xl font-black text-slate-950">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">{description}</p>
  </div>
);

export const ErrorPanel = ({ message = "Something went wrong." }) => (
  <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700">
    {message}
  </div>
);

export const formatAdminDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
