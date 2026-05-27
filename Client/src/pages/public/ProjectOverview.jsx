import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BotMessageSquare,
  CalendarHeart,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Crown,
  DatabaseZap,
  FileCheck2,
  GalleryHorizontalEnd,
  Heart,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LockKeyhole,
  MessageCircleHeart,
  MonitorSmartphone,
  PieChart,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UsersRound,
  Vote,
  WandSparkles,
} from "lucide-react";

const publicSummary = [
  { title: "Invitation Home", icon: Home, text: "Hero, countdown, Bible verse, events, memories, wishes, guest hub, final actions, and wedding assistant." },
  { title: "Guest Pages", icon: UsersRound, text: "Events, gallery, wishes, attendance, Circle of Love, and Couple Polls are built as separate responsive experiences." },
  { title: "Guest Interaction", icon: HeartHandshake, text: "Guests can submit wishes, attendance, relationship stories, chatbot notes, and poll question ideas." },
];

const adminShowcase = [
  {
    title: "Dashboard command center",
    eyebrow: "Analytics overview",
    icon: LayoutDashboard,
    tone: "from-sky-500 to-indigo-600",
    description:
      "A consolidated control room that summarizes the website in one place using counters, charts, activity blocks, and quick operational signals. It is designed like a lightweight data center for the full wedding product.",
    bullets: [
      "Total events, memories, wishes, attendance, stories, polls, and chatbot activity",
      "Visual chart areas for quick decision making instead of long text-heavy reports",
      "Clean admin-first layout with sidebar navigation and responsive spacing",
      "Useful for instantly understanding how guests are interacting with the website",
    ],
    preview: "dashboard",
  },
  {
    title: "Content publishing suite",
    eyebrow: "Events + gallery",
    icon: GalleryHorizontalEnd,
    tone: "from-rose-500 to-pink-600",
    description:
      "The admin can control the information guests see without touching code. Event information and gallery memories are managed from structured forms and media controls.",
    bullets: [
      "Create and update wedding events with date, time, venue, address, and status",
      "Upload image/video memories and decide which items are public or featured",
      "Keep Home-page featured memories fresh while the full gallery can continue growing",
      "Maintain consistent guest-facing content across desktop, tablet, and mobile pages",
    ],
    preview: "content",
  },
  {
    title: "Moderation and approval workflow",
    eyebrow: "Safe public content",
    icon: ShieldCheck,
    tone: "from-emerald-500 to-teal-600",
    description:
      "Guest-generated content is not pushed directly to public pages. The admin panel works as a review gate so only selected, meaningful, and safe content becomes visible.",
    bullets: [
      "Approve, reject, feature, or delete guest wishes before they appear publicly",
      "Review Circle of Love stories from groom side, bride side, or both sides",
      "Approve visitor-submitted poll questions before publishing them",
      "Keep the public website polished even when many guests submit content",
    ],
    preview: "moderation",
  },
  {
    title: "Guest response intelligence",
    eyebrow: "Attendance + messages",
    icon: ClipboardCheck,
    tone: "from-amber-500 to-orange-600",
    description:
      "The backend side captures practical guest information and keeps it easy to review. Attendance responses and assistant messages become organized records for planning and follow-up.",
    bullets: [
      "View attendance confirmations submitted from the RSVP page",
      "Check guest details, response status, and planning-related information",
      "Read chatbot messages or questions sent from the floating wedding assistant",
      "Use the admin panel as the single source for guest communication records",
    ],
    preview: "responses",
  },
  {
    title: "Poll studio and voting control",
    eyebrow: "Kevin vs Jenith polls",
    icon: Vote,
    tone: "from-violet-500 to-fuchsia-600",
    description:
      "The poll manager keeps the playful voting feature controlled. Every public poll uses exactly two options — Kevin and Jenith — while results are shown as clean percentages.",
    bullets: [
      "Create fun couple questions with exactly two fixed voting options",
      "Track result percentages and vote counts in a visual format",
      "Approve guest-suggested poll questions before public display",
      "Reset or manage poll visibility when needed from the admin side",
    ],
    preview: "polls",
  },
  {
    title: "Protected product architecture",
    eyebrow: "Frontend + API flow",
    icon: DatabaseZap,
    tone: "from-slate-600 to-slate-950",
    description:
      "The project is structured as a real application with public pages, protected admin routes, reusable API services, reusable hooks, and separated layout systems.",
    bullets: [
      "PublicLayout and AdminLayout keep guest and admin experiences separate",
      "Protected routes keep admin pages behind authentication logic",
      "Axios API modules and query hooks keep data access consistent",
      "Feature files are separated so future modules can be added safely",
    ],
    preview: "architecture",
  },
];

const productMetrics = [
  { label: "Admin modules", value: "8", icon: LayoutDashboard },
  { label: "Approval queues", value: "3", icon: ShieldCheck },
  { label: "Guest flows", value: "5+", icon: UsersRound },
  { label: "Responsive pages", value: "All", icon: MonitorSmartphone },
];

const architectureRows = [
  { layer: "Public website", detail: "Home, events, memories, wishes, attendance, Circle of Love, Couple Polls, and assistant experience." },
  { layer: "Admin panel", detail: "Dashboard, event manager, gallery manager, wishes moderation, guest responses, chatbot messages, stories, and polls." },
  { layer: "Data handling", detail: "Reusable API modules, Axios services, feature hooks, approval status, featured status, and public visibility control." },
  { layer: "UX foundation", detail: "Responsive layouts, clean spacing, guest-first forms, admin-first summaries, and mobile-aware components." },
];

const SectionLabel = ({ children, dark = false }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] shadow-sm backdrop-blur-xl sm:text-[11px] ${
      dark
        ? "border-white/12 bg-white/10 text-rose-100 shadow-black/10"
        : "border-rose-100 bg-white/85 text-rose-700 shadow-rose-100/50"
    }`}
  >
    <Sparkles size={14} />
    {children}
  </span>
);

const OverviewGlass = ({ children, className = "", dark = false }) => (
  <div
    className={`relative overflow-hidden border backdrop-blur-2xl ${
      dark ? "border-white/12 bg-white/[0.08]" : "border-rose-100/80 bg-white/86"
    } ${className}`}
    style={{
      boxShadow: dark
        ? "inset 2px 2px 1px rgba(255,255,255,0.13), 0 24px 80px rgba(15,23,42,0.22)"
        : "inset 2px 2px 1px rgba(255,255,255,0.96), inset -1px -1px 1px rgba(244,63,94,0.06), 0 24px 70px rgba(190,18,60,0.07)",
    }}
  >
    <div
      className={`pointer-events-none absolute inset-0 ${
        dark
          ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.11),rgba(255,255,255,0.02))]"
          : "bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(255,241,244,0.54)_48%,rgba(255,255,255,0.94)_100%)]"
      }`}
    />
    <div className="pointer-events-none absolute inset-x-6 top-2 h-12 rounded-full bg-white/35 blur-2xl" />
    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-rose-100/35 blur-3xl" />
    <div className="pointer-events-none absolute inset-[1px] rounded-[inherit] border border-white/40" />
    <div className="relative z-10">{children}</div>
  </div>
);

const AdminDashboardImage = ({ type = "dashboard", tone = "from-rose-500 to-pink-600" }) => {
  const cards = {
    dashboard: ["Guests", "Wishes", "Stories", "Votes"],
    content: ["Events", "Gallery", "Featured", "Media"],
    moderation: ["Pending", "Approved", "Featured", "Rejected"],
    responses: ["RSVP", "Messages", "Names", "Notes"],
    polls: ["Polls", "Votes", "Ideas", "Results"],
    architecture: ["Routes", "Hooks", "API", "Auth"],
  }[type];

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/12 bg-slate-950 p-3 shadow-2xl shadow-slate-950/20 sm:rounded-[2.2rem] sm:p-4">
      <div className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${tone} opacity-35 blur-3xl`} />
      <div className="absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative grid min-h-[310px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.06] sm:min-h-[360px] sm:rounded-[1.75rem] md:grid-cols-[86px_1fr]">
        <aside className="hidden border-r border-white/10 bg-white/[0.05] p-3 md:block">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-rose-700">
            <Heart size={18} fill="currentColor" />
          </div>
          <div className="space-y-2">
            {["Dash", "Media", "Guest", "Poll"].map((item, index) => (
              <div
                key={item}
                className={`h-9 rounded-xl ${index === 0 ? "bg-white text-slate-950" : "bg-white/8 text-white/55"} px-2 py-2 text-[10px] font-black`}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <main className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="h-2 w-28 rounded-full bg-white/25" />
              <div className="mt-2 h-7 w-44 rounded-full bg-white/85" />
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
              <LockKeyhole size={17} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {cards.map((card, index) => (
              <div key={card} className="rounded-2xl border border-white/10 bg-white/[0.08] p-3">
                <div className={`mb-3 h-8 w-8 rounded-xl bg-gradient-to-br ${tone} opacity-${index === 0 ? "100" : "70"}`} />
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">{card}</p>
                <p className="mt-1 text-xl font-black text-white">{[42, 18, 27, 96][index]}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.08] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-4 w-28 rounded-full bg-white/70" />
                <BarChart3 size={18} className="text-white/50" />
              </div>
              <div className="flex h-32 items-end gap-2">
                {[44, 76, 52, 88, 64, 96, 58].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-xl bg-white/12">
                    <div className={`mt-auto rounded-t-xl bg-gradient-to-t ${tone}`} style={{ height: `${height}%` }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.08] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-4 w-24 rounded-full bg-white/70" />
                <PieChart size={18} className="text-white/50" />
              </div>
              <div className="space-y-3">
                {["Approval queue", "Featured content", "Guest updates"].map((row, index) => (
                  <div key={row} className="rounded-2xl bg-white/8 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-white/72">{row}</span>
                      <span className="text-xs font-black text-white">{[12, 8, 24][index]}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${[62, 46, 78][index]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const PublicMiniCard = ({ item }) => {
  const Icon = item.icon;
  return (
    <OverviewGlass className="rounded-[1.7rem] p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-xl font-black text-slate-950">{item.title}</h3>
      <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{item.text}</p>
    </OverviewGlass>
  );
};

const AdminShowcaseBlock = ({ item, index }) => {
  const Icon = item.icon;
  const reverse = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <AdminDashboardImage type={item.preview} tone={item.tone} />

      <OverviewGlass className="rounded-[2rem] p-5 sm:rounded-[2.4rem] sm:p-7 lg:p-8">
        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-lg shadow-rose-100/50`}>
          <Icon size={23} />
        </div>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-rose-700">
          {item.eyebrow}
        </p>
        <h3 className="mt-2 font-['Playfair_Display',serif] text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
          {item.title}
        </h3>
        <p className="mt-4 text-sm font-semibold leading-7 text-slate-600 sm:text-base sm:leading-8">
          {item.description}
        </p>
        <div className="mt-5 grid gap-2.5">
          {item.bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-3 rounded-[1.2rem] border border-rose-100/70 bg-white/75 px-3 py-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-rose-700" />
              <span className="text-sm font-bold leading-6 text-slate-700">{bullet}</span>
            </div>
          ))}
        </div>
      </OverviewGlass>
    </motion.article>
  );
};

const ProjectOverview = () => {
  return (
    <div className="safe-page-x overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-white px-4 pb-10 pt-28 sm:px-5 sm:pb-12 sm:pt-32 md:px-6 lg:px-4 lg:pb-16 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-white" />
        <div className="pointer-events-none absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-pink-100/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-center lg:text-left"
            >
              <SectionLabel>Project overview</SectionLabel>
              <h1 className="mt-5 font-['Playfair_Display',serif] text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                A complete wedding invitation product with a private admin control center.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600 lg:mx-0">
                This overview presents the system as a full web application: elegant public invitation pages for guests, plus a detailed admin panel for content control, approvals, guest records, media management, and voting management.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-rose-100 transition hover:-translate-y-0.5 hover:bg-slate-950"
                >
                  Back to invitation
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-6 py-3.5 text-sm font-black text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  Admin route
                  <LockKeyhole size={16} />
                </Link>
              </div>
            </motion.div>

            <div className="space-y-4">
              <AdminDashboardImage type="dashboard" tone="from-rose-500 to-pink-600" />
              <div className="grid gap-3 sm:grid-cols-4">
                {productMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <OverviewGlass key={metric.label} className="rounded-[1.45rem] p-4 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                        <Icon size={18} />
                      </div>
                      <p className="mt-2 text-2xl font-black text-slate-950">{metric.value}</p>
                      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">{metric.label}</p>
                    </OverviewGlass>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-5 sm:py-12 md:px-6 lg:px-4 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="text-center lg:text-left">
              <SectionLabel>Public side summary</SectionLabel>
              <h2 className="mt-4 font-['Playfair_Display',serif] text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
                Guest-facing website kept clean and simple.
              </h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                The public side is intentionally summarized here. It works as the polished invitation layer, while the main operational strength is handled inside the admin panel.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {publicSummary.map((item) => (
                <PublicMiniCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-12 sm:px-5 sm:py-14 md:px-6 lg:px-4 lg:py-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,63,94,0.28),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(255,255,255,0.10),transparent_24%),linear-gradient(135deg,#0f172a,#2a0716_48%,#4c0519)]" />
        <div className="absolute left-1/2 top-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-rose-500/12 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel dark>Admin panel focus</SectionLabel>
            <h2 className="mt-4 font-['Playfair_Display',serif] text-3xl font-black text-white sm:text-4xl md:text-5xl">
              Private control room for the full product.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-white/62 sm:text-base">
              The admin panel is designed to make the project look and work like a serious product: measured, organized, secure, and easy to maintain.
            </p>
          </div>

          <div className="mt-9 grid gap-7 lg:mt-12 lg:gap-10">
            {adminShowcase.map((item, index) => (
              <AdminShowcaseBlock key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-5 sm:py-12 md:px-6 lg:px-4 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <OverviewGlass className="rounded-[2.2rem] p-5 sm:rounded-[2.6rem] sm:p-7 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <SectionLabel>System architecture</SectionLabel>
                <h2 className="mt-4 font-['Playfair_Display',serif] text-3xl font-black text-slate-950 sm:text-4xl">
                  Built as a maintainable web application, not a single static invitation.
                </h2>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                  The project separates public UI, admin UI, API calls, hooks, layouts, and protected pages. That makes future feature additions safer and keeps the codebase easier to extend.
                </p>
              </div>

              <div className="grid gap-3">
                {architectureRows.map((row, index) => (
                  <div key={row.layer} className="flex gap-4 rounded-[1.45rem] border border-rose-100 bg-white/75 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                      {index === 0 && <MonitorSmartphone size={19} />}
                      {index === 1 && <LayoutDashboard size={19} />}
                      {index === 2 && <DatabaseZap size={19} />}
                      {index === 3 && <WandSparkles size={19} />}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-950">{row.layer}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{row.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </OverviewGlass>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 pt-6 sm:px-5 sm:pb-16 md:px-6 lg:px-4">
        <div className="mx-auto max-w-5xl">
          <OverviewGlass className="rounded-[2rem] p-5 text-center sm:rounded-[2.35rem] sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-700 text-white shadow-lg shadow-rose-100">
              <FileCheck2 size={22} />
            </div>
            <h2 className="mt-4 font-['Playfair_Display',serif] text-3xl font-black text-slate-950 sm:text-4xl">
              A presentation-ready product overview
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              The final structure highlights the strongest parts of the work: protected admin operations, content moderation, media management, guest data, polls, approval queues, clean public UX, and responsive execution across screen sizes.
            </p>
          </OverviewGlass>
        </div>
      </section>
    </div>
  );
};

export default ProjectOverview;
