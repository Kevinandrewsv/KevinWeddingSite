import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Film,
  Image,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

const GalleryFilter = ({
  isOpen,
  onToggle,
  onClose,
  selectedType,
  selectedCategory,
  onTypeChange,
  onCategoryChange,
  onClear,
  totalCount,
}) => {
  const typeFilters = [
    { label: "All", value: "", icon: Sparkles },
    { label: "Photos", value: "photo", icon: Image },
    { label: "Videos", value: "video", icon: Film },
  ];

  const categoryFilters = [
    { label: "All", value: "" },
    { label: "Engagement", value: "Engagement" },
    { label: "Marriage", value: "Marriage" },
    { label: "Couple", value: "Couple" },
    { label: "Family", value: "Family" },
    { label: "Friends", value: "Friends" },
  ];

  const hasActiveFilter = Boolean(selectedType || selectedCategory);

  const selectedTypeLabel =
    typeFilters.find((item) => item.value === selectedType)?.label || "All";

  const selectedCategoryLabel =
    categoryFilters.find((item) => item.value === selectedCategory)?.label ||
    "All";

  return (
    <div className="relative z-30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm font-black text-gray-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-rose-600" />
            {totalCount} memories
          </span>

          {hasActiveFilter && (
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/70 px-4 py-2 text-rose-700">
              {selectedTypeLabel} / {selectedCategoryLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilter && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full px-4 py-2.5 text-sm font-black text-gray-500 transition hover:bg-rose-50 hover:text-rose-700"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={onToggle}
            className={`group inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-black transition duration-300 ${
              isOpen
                ? "border-gray-950 bg-gray-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
                : "border-rose-100 bg-gradient-to-br from-white via-rose-50/70 to-white text-rose-700 shadow-[inset_3px_3px_8px_rgba(255,255,255,0.95),inset_-4px_-5px_10px_rgba(244,63,94,0.08),0_14px_34px_rgba(244,63,94,0.13)] hover:border-rose-200 hover:bg-rose-50"
            }`}
          >
            <SlidersHorizontal size={17} />
            Filters
            <ChevronDown
              size={17}
              className={`transition duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 hidden cursor-default bg-transparent md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              aria-label="Close filters"
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 12, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="absolute right-0 top-full z-50 w-full overflow-hidden rounded-[2rem] border border-rose-100 bg-white/95 shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:w-[540px]"
            >
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <div>
                  <h3 className="text-lg font-black text-gray-950">
                    Filter memories
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    Select media type or event category.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-700 transition hover:bg-rose-50 hover:text-rose-700"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-[1.5rem] bg-rose-50/45 p-3">
                  <p className="mb-3 px-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Type
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {typeFilters.map((item) => {
                      const Icon = item.icon;
                      const isActive = selectedType === item.value;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => onTypeChange(item.value)}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition ${
                            isActive
                              ? "bg-gray-950 text-white shadow-lg shadow-gray-200"
                              : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon size={16} />
                            {item.label}
                          </span>

                          {isActive && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 rounded-[1.5rem] bg-rose-50/45 p-3">
                  <p className="mb-3 px-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Event
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.map((item) => {
                      const isActive = selectedCategory === item.value;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => onCategoryChange(item.value)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition ${
                            isActive
                              ? "bg-rose-700 text-white shadow-lg shadow-rose-100"
                              : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                          }`}
                        >
                          {isActive && <Check size={14} />}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryFilter;