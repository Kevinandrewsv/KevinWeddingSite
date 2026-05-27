import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bug, Code2, Heart, MapPin, Sparkles } from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/events" },
  { label: "Memories", path: "/gallery" },
  { label: "Wishes", path: "/wishes" },
  { label: "Circle of Love", path: "/circle-of-love" },
  { label: "Couple Polls", path: "/couple-polls" },
];

const GlassFilter = () => (
  <svg className="pointer-events-none absolute h-0 w-0 opacity-0">
    <filter
      id="footer-glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="58"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

const MainGlassLayers = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.8rem] sm:rounded-[2.1rem] lg:rounded-[2.4rem]"
        style={{
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          filter: "url(#footer-glass-distortion)",
          isolation: "isolate",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[1] rounded-[1.8rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(255,245,247,0.92)_28%,rgba(255,228,235,0.64)_52%,rgba(255,245,247,0.88)_74%,rgba(255,255,255,0.96)_100%)] sm:rounded-[2.1rem] lg:rounded-[2.4rem]" />

      <div
        className="pointer-events-none absolute inset-0 z-[2] rounded-[1.8rem] sm:rounded-[2.1rem] lg:rounded-[2.4rem]"
        style={{
          boxShadow:
            "inset 2px 2px 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(255,255,255,0.72), inset 0 0 34px rgba(255,255,255,0.44)",
        }}
      />

      <div className="pointer-events-none absolute inset-[1px] z-[3] rounded-[1.75rem] border border-white/85 sm:rounded-[2.05rem] lg:rounded-[2.35rem]" />
      <div className="pointer-events-none absolute inset-x-5 top-3 z-[4] h-12 rounded-full bg-white/60 blur-2xl sm:inset-x-8 sm:top-4 sm:h-16" />
      <div className="pointer-events-none absolute -left-16 top-6 z-[4] h-36 w-36 rounded-full bg-white/58 blur-3xl sm:h-44 sm:w-44" />
      <div className="pointer-events-none absolute -right-16 bottom-2 z-[4] h-40 w-40 rounded-full bg-pink-100/42 blur-3xl sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -left-20 top-0 z-[5] h-24 w-[58%] rotate-[-16deg] rounded-full bg-gradient-to-r from-transparent via-white/75 to-transparent blur-xl sm:h-32 sm:w-[46%]" />
    </>
  );
};

const InnerGlassBox = ({ children, className = "" }) => {
  return (
    <div
      className={`relative overflow-hidden border border-white/85 bg-pink-50/50 backdrop-blur-2xl ${className}`}
      style={{
        boxShadow:
          "inset 2px 2px 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(255,255,255,0.68), inset 0 0 22px rgba(255,255,255,0.45)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          filter: "url(#footer-glass-distortion)",
          isolation: "isolate",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(255,241,244,0.60)_42%,rgba(255,228,235,0.48)_68%,rgba(255,255,255,0.76)_100%)]" />
      <div className="pointer-events-none absolute inset-x-4 top-1 z-[2] h-5 rounded-full bg-white/68 blur-md" />
      <div className="pointer-events-none absolute -right-8 -top-8 z-[2] h-24 w-24 rounded-full bg-white/60 blur-2xl" />
      <div className="pointer-events-none absolute inset-[1px] z-[3] rounded-[inherit] border border-white/70" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleFooterNavClick = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <footer className="relative isolate overflow-hidden bg-white px-4 pb-5 pt-8 sm:px-5 sm:pb-6 sm:pt-10 md:px-6 md:pt-12 lg:px-4 lg:pb-6 lg:pt-14 xl:px-4">
      <GlassFilter />

      <div className="absolute inset-0 bg-white" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.8rem] border border-rose-100/75 bg-white px-4 py-6 sm:rounded-[2.1rem] sm:px-6 sm:py-7 md:px-7 md:py-8 lg:rounded-[2.4rem] lg:px-6 lg:py-7 xl:px-6 xl:py-7"
          style={{
            boxShadow:
              "inset 2px 2px 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(255,255,255,0.72)",
          }}
        >
          <MainGlassLayers />

          <div className="relative z-10 grid items-center gap-6 text-center sm:gap-7 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <h3 className="whitespace-nowrap font-['Playfair_Display',serif] text-[2.35rem] font-black tracking-tight text-gray-950 drop-shadow-sm min-[390px]:text-[2.65rem] sm:text-5xl md:text-[3.35rem] lg:text-5xl">
                Kevin
                <span className="mx-2 inline-flex align-middle text-rose-700 md:mx-3">
                  <Heart
                    size={24}
                    fill="currentColor"
                    className="sm:h-7 sm:w-7"
                  />
                </span>
                <span className="rose-text-gradient">Jenith</span>
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="inline-flex items-center gap-2">
                <Sparkles size={14} className="text-rose-700" />
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-700 sm:text-[11px] sm:tracking-[0.3em]">
                  Explore
                </span>
              </div>

              <div className="grid w-full max-w-[360px] grid-cols-2 gap-2.5 sm:max-w-[460px] sm:grid-cols-3 sm:gap-3 lg:max-w-[470px]">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={handleFooterNavClick}
                    className="group block"
                  >
                    <InnerGlassBox className="min-h-[46px] rounded-[1.05rem] px-3 py-3 text-center transition duration-300 hover:-translate-y-0.5 hover:bg-pink-50/70 sm:rounded-[1.25rem] sm:px-3.5">
                      <span className="pointer-events-none absolute -left-10 top-0 z-[8] h-full w-10 skew-x-[-18deg] bg-white/60 transition duration-700 group-hover:left-[120%]" />
                      <span className="relative z-10 flex min-h-[20px] items-center justify-center text-[13px] font-black leading-tight text-gray-700 transition duration-300 group-hover:text-rose-700 sm:text-sm">
                        {link.label}
                      </span>
                    </InnerGlassBox>
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <MapPin size={15} className="shrink-0 text-rose-700" />
                <span className="text-sm font-semibold text-gray-600">
                  Koradacheri, Tamil Nadu
                </span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <InnerGlassBox className="w-full max-w-[310px] rounded-[1.55rem] px-4 py-5 text-center sm:max-w-[360px] sm:rounded-[1.8rem] sm:px-5 md:max-w-[390px] lg:max-w-[290px] lg:rounded-[2rem] lg:text-right xl:max-w-[310px]">
                <p className="font-['Great_Vibes',cursive] text-[2rem] leading-snug text-rose-700 min-[390px]:text-[2.2rem] sm:text-4xl lg:text-[2.35rem]">
                  With love, faith,
                  <br />
                  and joyful hearts.
                </p>

                <div className="mt-4 flex items-center justify-center gap-3 lg:justify-end">
                  <span className="h-px w-12 bg-gradient-to-r from-transparent via-rose-300 to-rose-300 sm:w-14" />
                  <Heart
                    size={16}
                    fill="currentColor"
                    className="text-rose-700"
                  />
                  <span className="h-px w-12 bg-gradient-to-l from-transparent via-rose-300 to-rose-300 sm:w-14" />
                </div>
              </InnerGlassBox>
            </div>
          </div>
        </motion.div>

        <div
          className="relative z-10 mt-4 overflow-hidden rounded-[1.25rem] border border-rose-100/75 bg-white px-4 py-4 text-center backdrop-blur-2xl sm:rounded-[1.45rem] sm:px-5 lg:rounded-[1.6rem]"
          style={{
            boxShadow:
              "inset 2px 2px 1px rgba(255,255,255,0.9), inset -1px -1px 1px rgba(255,255,255,0.68)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.25rem] sm:rounded-[1.45rem] lg:rounded-[1.6rem]"
            style={{
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              filter: "url(#footer-glass-distortion)",
              isolation: "isolate",
            }}
          />

          <div className="pointer-events-none absolute inset-0 z-[1] rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(255,241,244,0.64)_48%,rgba(255,255,255,0.92)_100%)] sm:rounded-[1.45rem] lg:rounded-[1.6rem]" />
          <div className="pointer-events-none absolute inset-x-5 top-1 z-[2] h-4 rounded-full bg-white/75 blur-md" />
          <div className="pointer-events-none absolute inset-[1px] z-[3] rounded-[1.2rem] border border-white/75 sm:rounded-[1.4rem] lg:rounded-[1.55rem]" />

          <div className="relative z-10 flex flex-col items-center justify-center gap-3 md:flex-row md:justify-between md:text-left">
            <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold leading-6 text-gray-500 sm:text-sm">
              <span>© {currentYear} Kevin & Jenith</span>
              <span className="hidden text-rose-300 sm:inline">•</span>
              <span>Made with</span>
              <Heart
                size={14}
                fill="currentColor"
                className="mx-0.5 inline text-rose-700"
              />
              <span>and blessings</span>
            </p>

            <div className="flex flex-col items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-rose-700 sm:text-[11px] sm:tracking-[0.18em] md:items-end">
              <Link
                to="/project-overview"
                onClick={handleFooterNavClick}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-700 sm:text-[11px]"
              >
                <Sparkles size={13} className="shrink-0 text-rose-700" />
                Project Overview
              </Link>

              <p className="flex items-center justify-center gap-2">
                <Code2 size={14} className="shrink-0" />
                <span>Built by Groom</span>
              </p>

              <p className="flex items-center justify-center gap-2">
                <Bug size={14} className="shrink-0" />
                <span>Tested with love by Bride</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;