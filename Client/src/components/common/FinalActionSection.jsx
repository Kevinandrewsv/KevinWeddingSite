import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  MessageCircleHeart,
  Send,
  Sparkles,
} from "lucide-react";
import { FaCross } from "react-icons/fa6";

const floatingBlessings = [
  { text: "Love", className: "left-[8%] top-[18%]", delay: 0 },
  { text: "Joy", className: "right-[10%] top-[22%]", delay: 0.4 },
  { text: "Faith", className: "left-[14%] bottom-[25%]", delay: 0.8 },
  { text: "Grace", className: "right-[14%] bottom-[24%]", delay: 1.1 },
];

const FinalActionSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white px-4 py-14 sm:px-5 sm:py-18 md:px-6 md:py-20 lg:px-8 lg:py-28">
      <div className="absolute inset-0 bg-white" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-100/45 blur-3xl sm:h-[430px] sm:w-[430px] lg:h-[560px] lg:w-[560px]" />
      <div className="pointer-events-none absolute left-[12%] top-[18%] h-48 w-48 rounded-full bg-pink-100/45 blur-3xl sm:h-60 sm:w-60 lg:h-72 lg:w-72" />
      <div className="pointer-events-none absolute bottom-[12%] right-[10%] h-52 w-52 rounded-full bg-red-100/40 blur-3xl sm:h-64 sm:w-64 lg:h-80 lg:w-80" />

      <div className="pointer-events-none absolute inset-x-0 top-10 h-28 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.08),transparent_62%)] sm:top-14 sm:h-36 lg:top-16 lg:h-40" />

      {floatingBlessings.map((item) => (
        <motion.div
          key={item.text}
          animate={{
            y: [0, -14, 0],
            opacity: [0.55, 1, 0.55],
          }}
          transition={{
            duration: 4.8,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`pointer-events-none absolute z-10 hidden rounded-full border border-rose-100 bg-white/70 px-5 py-2 font-['Great_Vibes',cursive] text-2xl text-rose-600 shadow-xl shadow-rose-100/60 backdrop-blur-xl md:block ${item.className}`}
        >
          {item.text}
        </motion.div>
      ))}

      <div className="relative z-20 mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-rose-700 shadow-xl shadow-rose-100 ring-1 ring-rose-100 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 lg:shadow-2xl"
        >
          <FaCross className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-rose-700 sm:mt-6 sm:text-xs sm:tracking-[0.34em] lg:mt-7 lg:tracking-[0.42em]"
        >
          With Prayer & Love
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="mx-auto mt-4 max-w-[340px] pb-2 font-['Playfair_Display',serif] text-[2.35rem] font-black leading-[1.05] tracking-tight text-gray-950 min-[390px]:max-w-[380px] min-[390px]:text-[2.65rem] sm:mt-5 sm:max-w-3xl sm:text-5xl md:text-6xl md:leading-[1.04] lg:max-w-5xl lg:text-7xl"
        >
          <span className="block">Your presence makes</span>
          <span className="block pb-1 rose-text-gradient">
            our day complete
          </span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 h-px max-w-[260px] origin-center bg-gradient-to-r from-transparent via-rose-300 to-transparent sm:mt-7 sm:max-w-xl lg:mt-8 lg:max-w-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, delay: 0.3 }}
          className="mx-auto mt-8 flex w-full max-w-[330px] flex-col items-center justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-4 lg:mt-11"
        >
          <Link
            to="/guest-response"
            className="group relative inline-flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-rose-700 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-rose-200 transition duration-300 hover:bg-rose-800 sm:w-auto sm:min-w-[230px] sm:px-8 sm:py-4 sm:text-base lg:shadow-2xl"
          >
            <span className="absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-[130%]" />
            <Heart size={19} fill="currentColor" className="relative" />
            <span className="relative">Confirm Attendance</span>
            <ArrowRight
              size={18}
              className="relative transition duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/wishes"
            className="group relative inline-flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-rose-100 bg-white px-6 py-3.5 text-sm font-black text-rose-700 shadow-lg shadow-rose-100/70 transition duration-300 hover:border-rose-200 hover:bg-rose-50 sm:w-auto sm:min-w-[230px] sm:px-8 sm:py-4 sm:text-base lg:shadow-xl lg:shadow-rose-100/80"
          >
            <span className="absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-rose-100/80 to-transparent transition duration-700 group-hover:translate-x-[130%]" />
            <Send size={19} className="relative" />
            <span className="relative">Send Wishes</span>
            <MessageCircleHeart
              size={19}
              className="relative transition duration-300 group-hover:scale-110"
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-9 flex max-w-[335px] items-center justify-center gap-2 text-rose-700 sm:mt-11 sm:max-w-xl sm:gap-4 lg:mt-12"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-200 to-rose-200" />

          <Sparkles size={15} className="shrink-0 sm:h-[18px] sm:w-[18px]" />

          <p className="max-w-[210px] font-['Great_Vibes',cursive] text-[1.45rem] leading-[1.15] sm:max-w-none sm:text-3xl sm:leading-none">
            With your blessings, our forever begins in grace
          </p>

          <Sparkles size={15} className="shrink-0 sm:h-[18px] sm:w-[18px]" />

          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-rose-200 to-rose-200" />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white sm:h-32" />
    </section>
  );
};

export default FinalActionSection;