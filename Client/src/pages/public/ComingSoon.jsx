import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, ChevronRight, Heart, Sparkles } from "lucide-react";

const ComingSoon = () => {
  return (
    <section className="relative min-h-screen bg-rose-50 flex items-center justify-center px-4 py-24 overflow-hidden">
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-rose-200/60 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-red-200/50 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="relative max-w-3xl text-center glass-card rounded-[2.5rem] p-8 md:p-14"
      >
        <div className="mx-auto h-20 w-20 rounded-[2rem] bg-gradient-to-br from-rose-700 to-red-500 text-white flex items-center justify-center shadow-xl shadow-rose-100">
          <Camera size={36} />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 shadow-sm mt-8">
          <Sparkles size={16} className="text-rose-600" />
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-rose-600 font-bold">
            After Wedding
          </p>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-950 mt-6">
          Coming <span className="rose-text-gradient">Soon</span>
        </h1>

        <p className="text-gray-600 mt-6 text-lg leading-relaxed">
          Our wedding photos, videos, and beautiful memories will be shared here
          soon.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-rose-700 text-white font-bold hover:bg-rose-800 transition shadow-xl shadow-rose-100"
          >
            Go Home
            <ChevronRight size={18} />
          </Link>

          <Link
            to="/wishes"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-rose-700 border border-rose-100 font-bold hover:bg-rose-50 transition"
          >
            Send Wishes
            <Heart size={18} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default ComingSoon;