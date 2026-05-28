import { NavLink } from "react-router-dom";
import { Heart, Menu, ShieldCheck, X } from "lucide-react";
import useUiStore from "../../store/uiStore";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Gallery", path: "/gallery" },
  { name: "Wishes", path: "/wishes" },
  { name: "Circle of Love", path: "/circle-of-love" },
  { name: "Couple Polls", path: "/couple-polls" },
  { name: "Attendance", path: "/guest-response" },
];

const NavbarLogo = () => (
  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.25rem] border border-rose-100/90 bg-white/80 backdrop-blur-2xl transition-transform duration-200 group-hover:scale-[1.03] sm:h-13 sm:w-13 lg:h-14 lg:w-14">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/70 to-pink-100/65" />
    <div
      className="pointer-events-none absolute inset-0 rounded-[1.25rem]"
      style={{
        boxShadow:
          "inset 1.5px 1.5px 1px rgba(255,255,255,0.95), inset -1px -1px 1px rgba(244,63,94,0.08)",
      }}
    />

    <svg viewBox="0 0 52 52" className="relative z-10 h-10 w-10" aria-hidden="true">
      <defs>
        <linearGradient id="kj-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="48%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>

      <text
        x="7"
        y="31"
        fill="url(#kj-logo-gradient)"
        fontSize="27"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="-2"
      >
        K
      </text>

      <text
        x="23"
        y="35"
        fill="url(#kj-logo-gradient)"
        fontSize="29"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="-2"
      >
        J
      </text>

      <path
        d="M11 35 C18 27, 29 25, 39 30"
        fill="none"
        stroke="#f9a8d4"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>

    <Heart
      size={10}
      className="absolute bottom-2 right-2 z-10 text-rose-700"
      fill="#be123c"
    />
  </div>
);

const Navbar = () => {
  const isMobileMenuOpen = useUiStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const closeMobileMenu = useUiStore((state) => state.closeMobileMenu);

  const handleNavClick = () => {
    closeMobileMenu();

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-[999] w-full border-b border-rose-50/90 bg-white/78 shadow-[0_10px_28px_rgba(244,63,94,0.07)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-rose-50/45 to-white/95" />

        <nav className="relative mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4 sm:h-[4.5rem] sm:px-5 lg:h-20 lg:px-6">
          <NavLink
            to="/"
            onClick={handleNavClick}
            className="group relative inline-flex items-center justify-center justify-self-start"
            aria-label="Go to home"
          >
            <NavbarLogo />
          </NavLink>

          <div className="hidden justify-center lg:flex">
            <div className="relative rounded-[2rem] bg-gradient-to-br from-white/95 via-white/60 to-rose-100/60 p-[1px] shadow-[0_8px_24px_rgba(190,18,60,0.10),0_2px_6px_rgba(0,0,0,0.06)]">
              <div className="relative flex items-center gap-1.5 overflow-hidden rounded-[1.95rem] border border-white/75 bg-white/35 px-2 py-2 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-white/25 to-rose-50/35" />
                <div className="pointer-events-none absolute inset-x-3 top-1 h-1/2 rounded-full bg-white/35 blur-xl" />
                <div className="pointer-events-none absolute bottom-1 right-4 h-8 w-28 rounded-full bg-rose-100/40 blur-lg" />
                <div
                  className="pointer-events-none absolute inset-0 rounded-[1.95rem]"
                  style={{
                    boxShadow:
                      "inset 2px 2px 1px rgba(255,255,255,0.82), inset -1px -1px 1px rgba(255,255,255,0.55)",
                  }}
                />

                <div className="relative flex items-center gap-1.5">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `group/link relative transform-gpu overflow-hidden rounded-full px-2.5 py-2.5 text-[13px] font-bold transition duration-150 xl:px-3 ${
                          isActive
                            ? "text-white shadow-[0_8px_18px_rgba(190,18,60,0.20)]"
                            : "text-slate-600 hover:bg-white/45 hover:text-rose-700"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive ? (
                            <>
                              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-rose-700 via-rose-600 to-pink-600" />
                              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/5" />
                              <span className="pointer-events-none absolute left-3 right-3 top-1 h-2 rounded-full bg-white/30 blur-[2px]" />
                              <span
                                className="pointer-events-none absolute inset-0 rounded-full"
                                style={{
                                  boxShadow:
                                    "inset 1px 1px 1px rgba(255,255,255,0.35), inset -1px -1px 1px rgba(0,0,0,0.08)",
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <span className="pointer-events-none absolute inset-0 rounded-full bg-white/0 transition-colors duration-150 group-hover/link:bg-white/55" />
                              <span className="pointer-events-none absolute inset-x-3 top-1 h-2 rounded-full bg-white/0 blur-[2px] transition-colors duration-150 group-hover/link:bg-white/45" />
                            </>
                          )}

                          <span className="relative whitespace-nowrap">{link.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 justify-self-end">
            <NavLink
              to="/admin/login"
              onClick={handleNavClick}
              className="group relative hidden h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/75 bg-white/70 text-rose-700 shadow-[0_10px_22px_rgba(244,63,94,0.10)] backdrop-blur-xl transition duration-200 hover:scale-105 lg:inline-flex"
              aria-label="Admin login"
              title="Admin"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/95 via-rose-50/75 to-pink-100/70" />
              <span className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-white/80 blur-xl" />
              <ShieldCheck size={21} className="relative transition group-hover:rotate-6" />
            </NavLink>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/75 bg-white/75 text-rose-800 shadow-[0_10px_22px_rgba(244,63,94,0.10)] backdrop-blur-xl sm:h-12 sm:w-12 lg:hidden"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/95 via-rose-50/70 to-pink-100/70" />
              <span className="relative">
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </span>
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="relative border-t border-rose-50/90 bg-white/92 shadow-[0_20px_40px_rgba(244,63,94,0.10)] backdrop-blur-2xl lg:hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/98 via-rose-50/60 to-pink-50/70" />

            <div className="relative mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `relative overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-black transition ${
                      isActive
                        ? "text-white shadow-[0_12px_24px_rgba(190,18,60,0.16)]"
                        : "border border-white/75 bg-white/68 text-slate-700 hover:bg-white/95 hover:text-rose-700"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <>
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-700 via-rose-600 to-pink-600" />
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/16 via-transparent to-black/5" />
                          <span className="pointer-events-none absolute left-4 right-4 top-1.5 h-2 rounded-full bg-white/25 blur-[2px]" />
                        </>
                      ) : (
                        <>
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/92 via-rose-50/48 to-white/70" />
                          <span
                            className="pointer-events-none absolute inset-0 rounded-2xl"
                            style={{
                              boxShadow:
                                "inset 1px 1px 1px rgba(255,255,255,0.82), inset -1px -1px 1px rgba(255,255,255,0.45)",
                            }}
                          />
                        </>
                      )}

                      <span className="relative block truncate">{link.name}</span>
                    </>
                  )}
                </NavLink>
              ))}

              <NavLink
                to="/admin/login"
                onClick={handleNavClick}
                className="group relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/75 bg-white/70 px-4 py-3.5 text-sm font-black text-rose-700 shadow-[0_12px_24px_rgba(244,63,94,0.10)] backdrop-blur-xl transition hover:bg-white/95 hover:text-rose-800"
                aria-label="Admin login"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/95 via-rose-50/70 to-pink-100/70" />
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow:
                      "inset 1px 1px 1px rgba(255,255,255,0.82), inset -1px -1px 1px rgba(255,255,255,0.45)",
                  }}
                />
                <ShieldCheck size={18} className="relative transition group-hover:rotate-6" />
                <span className="relative">Admin Panel</span>
              </NavLink>
            </div>
          </div>
        )}
      </header>

      <div className="h-16 sm:h-[4.5rem] lg:h-20" aria-hidden="true" />
    </>
  );
};

export default Navbar;