import { motion } from "framer-motion";

const SectionHeading = ({
  label,
  title,
  description,
  align = "center",
}) => {
  const alignmentClass = align === "left" ? "text-left" : "text-center";
  const descriptionClass =
    align === "center" ? "max-w-2xl mx-auto" : "max-w-3xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={alignmentClass}
    >
      {label && (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 shadow-sm ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-600" />
          <p className="text-xs md:text-sm uppercase tracking-[0.32em] text-rose-600 font-semibold">
            {label}
          </p>
        </div>
      )}

      {title && (
        <h2 className="text-4xl md:text-5xl font-black text-gray-950 mt-5 leading-tight">
          {title}
        </h2>
      )}

      {description && (
        <p className={`text-gray-600 mt-5 text-base md:text-lg ${descriptionClass}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;