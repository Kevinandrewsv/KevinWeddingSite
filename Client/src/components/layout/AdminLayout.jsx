/* eslint-disable react-hooks/static-components */
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  CalendarDays,
  GalleryHorizontal,
  Globe2,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircleHeart,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import useAuthStore from "../../store/authStore";

const navLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, accent: "from-sky-500 to-blue-600" },
  { name: "Events", path: "/admin/events", icon: CalendarDays, accent: "from-violet-500 to-indigo-600" },
  { name: "Gallery", path: "/admin/gallery", icon: GalleryHorizontal, accent: "from-fuchsia-500 to-pink-600" },
  { name: "Wishes", path: "/admin/wishes", icon: MessageCircleHeart, accent: "from-amber-400 to-orange-600" },
  { name: "Attendance", path: "/admin/guest-responses", icon: Users, accent: "from-emerald-500 to-teal-600" },
  { name: "Circle of Love", path: "/admin/circle-of-love", icon: HeartHandshake, accent: "from-rose-500 to-fuchsia-600" },
  { name: "Couple Polls", path: "/admin/polls", icon: BarChart3, accent: "from-indigo-500 to-violet-600" },
  { name: "Chatbot", path: "/admin/chatbot-messages", icon: Bot, accent: "from-cyan-500 to-sky-600" },
];

const pageMeta = {
  "/admin/dashboard": "Command Center",
  "/admin/events": "Event Studio",
  "/admin/gallery": "Media Control",
  "/admin/wishes": "Blessing Review",
  "/admin/guest-responses": "Attendance Desk",
  "/admin/circle-of-love": "Story Moderation",
  "/admin/polls": "Poll Control",
  "/admin/chatbot-messages": "Assistant Inbox",
};

const LogoMark = ({ collapsed = false }) => (
  <NavLink
    to="/admin/dashboard"
    className={`group flex min-w-0 items-center rounded-[1.35rem] border border-white/10 bg-white/[0.07] text-white shadow-[0_14px_42px_rgba(2,6,23,0.2)] backdrop-blur-2xl transition hover:bg-white/[0.11] ${
      collapsed ? "justify-center p-2" : "gap-3 p-2.5"
    }`}
    aria-label="Admin dashboard"
    title="Wedding OS"
  >
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-slate-950 shadow-lg shadow-cyan-950/30 transition-all ${
        collapsed ? "h-12 w-12" : "h-11 w-11"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-200 via-white to-fuchsia-200" />
      <span className="relative font-serif text-lg font-black italic tracking-tighter">KJ</span>
      <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
    </div>

    {!collapsed && (
      <div className="min-w-0">
        <h2 className="truncate text-base font-black leading-tight">Wedding OS</h2>
        <p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-[0.22em] text-cyan-100/80">
          Kevin & Jenith
        </p>
      </div>
    )}
  </NavLink>
);

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentTitle = useMemo(() => pageMeta[location.pathname] || "Admin Workspace", [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const closeDrawer = () => setIsSidebarOpen(false);

  const SidebarBody = ({ mobile = false }) => {
    const compact = !mobile && isCollapsed;

    return (
      <div className="relative flex h-full min-h-0 flex-col">
        <div className={`flex items-center ${compact ? "justify-center" : "justify-between gap-3"}`}>
          <LogoMark collapsed={compact} />

          {mobile && (
            <button
              type="button"
              onClick={closeDrawer}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/15"
              aria-label="Close sidebar"
            >
              <X size={19} />
            </button>
          )}
        </div>

        <div
          className={`mt-4 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            compact ? "px-0" : "pr-1"
          }`}
        >
          <div
            className={`border border-white/10 bg-white/[0.055] backdrop-blur-2xl ${
              compact ? "rounded-[1.55rem] px-2 py-3" : "rounded-[1.35rem] p-2"
            }`}
          >
            <p
              className={
                compact
                  ? "sr-only"
                  : "px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400"
              }
            >
              Main controls
            </p>

            <nav className={compact ? "flex flex-col items-center gap-2.5" : "space-y-1.5"}>
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={closeDrawer}
                    title={link.name}
                    className={({ isActive }) =>
                      compact
                        ? `group relative flex h-12 w-12 items-center justify-center rounded-[1.15rem] transition duration-300 ${
                            isActive
                              ? `bg-gradient-to-br ${link.accent} text-white shadow-[0_14px_30px_rgba(79,70,229,0.32)]`
                              : "bg-white/[0.075] text-slate-300 hover:bg-white/[0.13] hover:text-white"
                          }`
                        : `group relative flex min-w-0 items-center gap-3 rounded-[1.05rem] px-2.5 py-2.5 text-[13px] font-black transition duration-300 ${
                            isActive
                              ? "bg-white text-slate-950 shadow-lg shadow-black/15"
                              : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                          }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {compact ? (
                          <>
                            <Icon size={19} strokeWidth={2.25} />
                            {isActive && (
                              <span className="absolute -right-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white/90" />
                            )}
                          </>
                        ) : (
                          <>
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                isActive
                                  ? `bg-gradient-to-br ${link.accent} text-white shadow-lg shadow-slate-950/15`
                                  : "bg-white/[0.08] text-slate-300 group-hover:bg-white/[0.12] group-hover:text-white"
                              }`}
                            >
                              <Icon size={17} />
                            </span>
                            <span className="min-w-0 flex-1 truncate leading-tight">{link.name}</span>
                            {isActive && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className={`shrink-0 pt-4 ${compact ? "space-y-2.5" : "space-y-2"}`}>
          <NavLink
            to="/"
            onClick={closeDrawer}
            className={({ isActive }) =>
              compact
                ? `group flex h-12 w-12 items-center justify-center rounded-[1.15rem] border border-white/10 bg-white/[0.075] text-slate-300 transition hover:bg-white hover:text-slate-950 ${
                    isActive ? "bg-white text-slate-950" : ""
                  }`
                : "group flex min-w-0 items-center gap-3 rounded-[1.05rem] border border-white/10 bg-white/[0.07] px-2.5 py-2.5 text-[13px] font-black text-slate-200 transition hover:bg-white hover:text-slate-950"
            }
            title="View Website"
          >
            {compact ? (
              <Globe2 size={19} />
            ) : (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.09] group-hover:bg-slate-100">
                  <Globe2 size={17} />
                </span>
                <span className="truncate">View Website</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className={
              compact
                ? "group flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-950/20 transition hover:scale-[1.04]"
                : "group flex w-full min-w-0 items-center gap-3 rounded-[1.05rem] bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-2.5 text-[13px] font-black text-white shadow-lg shadow-rose-950/20 transition hover:scale-[1.01]"
            }
            title="Logout"
          >
            {compact ? (
              <LogOut size={19} />
            ) : (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <LogOut size={17} />
                </span>
                <span className="truncate">Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f7fb] text-slate-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.13),transparent_30%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]" />

      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen transition-all duration-300 xl:block ${
          isCollapsed ? "w-[6.4rem]" : "w-[17.25rem]"
        }`}
      >
        <div className="h-full p-3">
          <div
            className={`relative flex h-full min-h-0 flex-col overflow-hidden border border-white/10 bg-slate-950 shadow-[0_22px_64px_rgba(15,23,42,0.22)] transition-all duration-300 ${
              isCollapsed ? "rounded-[2rem] px-2.5 py-4" : "rounded-[1.75rem] p-3"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_90%_18%,rgba(217,70,239,0.15),transparent_32%)]" />
            <div className="relative min-h-0 flex-1">
              <SidebarBody />
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[80] xl:hidden">
          <button
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-label="Close sidebar overlay"
          />
          <aside className="relative h-full w-[min(21.5rem,calc(100vw-1.5rem))] p-3">
            <div className="h-full overflow-hidden rounded-[1.75rem] bg-slate-950 p-3 shadow-2xl">
              <SidebarBody mobile />
            </div>
          </aside>
        </div>
      )}

      <div
        className={`relative min-w-0 transition-all duration-300 ${
          isCollapsed ? "xl:ml-[6.4rem]" : "xl:ml-[17.25rem]"
        }`}
      >
        <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5 lg:px-6">
          <div className="rounded-[1.45rem] border border-white/70 bg-white/85 px-3 py-3 shadow-sm shadow-slate-200/80 backdrop-blur-2xl sm:px-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white xl:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu size={20} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCollapsed((value) => !value)}
                  className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:border-indigo-200 hover:bg-indigo-50 xl:flex"
                  aria-label="Toggle sidebar"
                >
                  {isCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600 sm:text-[10px]">
                    <Sparkles size={12} />
                    Wedding Admin Studio
                  </div>
                  <h1 className="truncate text-base font-black text-slate-950 sm:text-xl">{currentTitle}</h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-black text-slate-950">{admin?.name || "Admin"}</p>
                  <p className="max-w-[10rem] truncate text-xs font-semibold text-slate-500">
                    {admin?.email || "admin@wedding.com"}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 text-sm font-black text-white shadow-lg shadow-fuchsia-200">
                  {admin?.name?.charAt(0) || "A"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
          <div className="mx-auto max-w-[1480px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;