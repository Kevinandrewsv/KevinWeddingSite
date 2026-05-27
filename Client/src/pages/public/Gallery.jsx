/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Film,
  Image,
  Loader2,
  Play,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { useInfiniteGallery } from "../../hooks/useGallery";
import {
  EmptyState,
  ErrorState,
  GalleryFilter,
  LoadingState,
} from "../../components/common";

const GALLERY_PAGE_LIMIT = 16;

const getShapeFromDimensions = (width, height) => {
  if (!width || !height) return "balanced";

  const ratio = width / height;

  if (ratio >= 1.45) return "landscape";
  if (ratio <= 0.78) return "portrait";

  return "balanced";
};

const getFallbackShape = (index) => {
  const pattern = [
    "portrait",
    "landscape",
    "balanced",
    "portrait",
    "landscape",
    "balanced",
    "portrait",
    "landscape",
  ];

  return pattern[index % pattern.length];
};

const getMobileShapeClass = (shape) => {
  if (shape === "portrait") {
    return "h-[245px] min-[360px]:h-[265px] min-[390px]:h-[285px] sm:h-[340px] md:h-[360px]";
  }

  if (shape === "landscape") {
    return "h-[150px] min-[360px]:h-[160px] min-[390px]:h-[170px] sm:h-[210px] md:h-[230px]";
  }

  return "h-[200px] min-[360px]:h-[215px] min-[390px]:h-[230px] sm:h-[280px] md:h-[300px]";
};

const getDesktopShapeClass = (shape, index) => {
  if (shape === "portrait") return "lg:h-[390px]";
  if (shape === "landscape") return "lg:h-[230px]";

  if (index % 6 === 0) return "lg:h-[340px]";
  if (index % 6 === 2) return "lg:h-[260px]";

  return "lg:h-[300px]";
};

const galleryCardBaseClass =
  "group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.25rem] border border-white bg-white text-left shadow-[0_14px_38px_rgba(15,23,42,0.08)] transition-shadow duration-300 sm:mb-4 sm:rounded-[1.55rem] lg:rounded-[1.5rem] lg:hover:shadow-[0_18px_48px_rgba(15,23,42,0.14)]";

const mediaFillClass =
  "absolute inset-0 block h-full min-h-full w-full min-w-full max-w-none object-cover transition-transform duration-300 ease-out lg:group-hover:scale-[1.035]";

const VideoCardPreview = memo(({ src, title, onShapeReady }) => {
  const videoRef = useRef(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  useEffect(() => {
    setIsPreviewReady(false);
  }, [src]);

  const handleLoadedMetadata = (event) => {
    const video = event.currentTarget;

    if (video.videoWidth && video.videoHeight) {
      onShapeReady(getShapeFromDimensions(video.videoWidth, video.videoHeight));
    }

    setIsPreviewReady(true);
  };

  const handleLoadedData = () => {
    if (!isPreviewReady) {
      setIsPreviewReady(true);
    }
  };

  const handleError = () => {
    setIsPreviewReady(true);
  };

  return (
    <div className="absolute inset-0 h-full min-h-full w-full min-w-full overflow-hidden bg-transparent">
      {!isPreviewReady && (
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300" />
      )}

      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={handleLoadedData}
        onError={handleError}
        className={mediaFillClass}
        aria-label={title}
      />
    </div>
  );
});

VideoCardPreview.displayName = "VideoCardPreview";

const GalleryCard = memo(({ item, index, shape, onOpen, onUpdateShape }) => {
  const mobileShapeClass = getMobileShapeClass(shape);
  const desktopShapeClass = getDesktopShapeClass(shape, index);

  const handleImageLoad = (event) => {
    const image = event.currentTarget;

    onUpdateShape(
      item._id,
      getShapeFromDimensions(image.naturalWidth, image.naturalHeight)
    );
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`${galleryCardBaseClass} ${mobileShapeClass} ${desktopShapeClass}`}
    >
      {item.type === "photo" ? (
        <img
          src={item.url}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
          className={mediaFillClass}
        />
      ) : (
        <VideoCardPreview
          src={item.url}
          title={item.title}
          onShapeReady={(shapeValue) => onUpdateShape(item._id, shapeValue)}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-black/8 opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

      <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-white/94 px-2.5 py-1.5 text-[10px] font-black capitalize text-rose-700 shadow-sm backdrop-blur-xl sm:left-3 sm:top-3 sm:px-3 sm:py-2 sm:text-xs">
        {item.type === "video" ? (
          <Play size={12} className="fill-rose-700 sm:h-[13px] sm:w-[13px]" />
        ) : (
          <Image size={12} className="sm:h-[13px] sm:w-[13px]" />
        )}
        {item.type}
      </div>

      {item.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/94 text-rose-700 shadow-xl backdrop-blur-xl transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <Play size={20} className="ml-1 fill-rose-700 sm:h-6 sm:w-6" />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
        <div className="inline-flex max-w-full flex-col items-start rounded-[1rem] bg-black/42 px-2.5 py-2 shadow-lg backdrop-blur-md sm:rounded-[1.2rem] sm:px-3 sm:py-2.5">
          <p className="max-w-full truncate rounded-full bg-white/18 px-2 py-0.5 text-[8px] font-black text-white sm:text-[10px]">
            {item.category || "Wedding Memory"}
          </p>

          <h3 className="mt-1 max-w-full truncate text-[12px] font-black leading-tight text-white drop-shadow-sm min-[390px]:text-[13px] sm:text-base">
            {item.title}
          </h3>
        </div>

        {item.description && (
          <p className="mt-2 hidden rounded-2xl bg-black/35 px-3 py-2 text-sm font-medium leading-6 text-white/85 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 sm:line-clamp-2 sm:block">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
});

GalleryCard.displayName = "GalleryCard";

const MobileGalleryHeader = ({
  totalGalleryCount,
  isFilterOpen,
  setIsFilterOpen,
  selectedType,
  selectedCategory,
  setSelectedType,
  setSelectedCategory,
  clearFilters,
}) => {
  return (
    <div className="lg:hidden">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto max-w-[430px] overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/55 px-5 pb-5 pt-5 text-center shadow-[0_18px_45px_rgba(244,63,94,0.08)] sm:max-w-[560px] sm:rounded-[2.4rem] sm:px-7 sm:pb-7 sm:pt-7 md:max-w-[680px]"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-pink-50 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <div className="relative z-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/85 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-rose-600 shadow-sm backdrop-blur-xl sm:text-xs sm:tracking-[0.32em]">
            <span className="h-2 w-2 rounded-full bg-rose-600" />
            Gallery
          </div>

          <h1 className="mx-auto mt-4 max-w-xs text-[2.25rem] font-black leading-[1.05] tracking-tight text-slate-950 min-[390px]:text-[2.55rem] sm:max-w-xl sm:text-5xl md:text-6xl">
            Photo & Video Gallery
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm font-medium leading-7 text-slate-500 sm:max-w-xl sm:text-base sm:leading-8">
            Beautiful moments, smiles, celebrations, and blessings in one place.
          </p>

          <div className="relative mt-5 rounded-[1.45rem] border border-white/80 bg-white/70 p-2 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.9),0_12px_28px_rgba(244,63,94,0.08)] backdrop-blur-xl sm:mx-auto sm:max-w-md sm:rounded-[1.7rem]">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <div className="flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] bg-gradient-to-br from-white via-white to-rose-50/65 px-3 text-sm font-black text-slate-700 sm:min-h-14 sm:rounded-[1.35rem]">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                {totalGalleryCount} memories
              </div>

              <button
                type="button"
                onClick={() => setIsFilterOpen((current) => !current)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] bg-slate-950 px-4 text-sm font-black text-white shadow-[0_10px_22px_rgba(15,23,42,0.16)] sm:min-h-14 sm:rounded-[1.35rem] sm:px-5"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            {isFilterOpen && (
              <div className="mt-3 rounded-[1.25rem] border border-rose-100 bg-white p-3 text-left shadow-xl shadow-rose-100/50 sm:rounded-[1.45rem] sm:p-4">
                <div className="grid gap-3">
                  <div>
                    <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      Media Type
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "All", value: "" },
                        { label: "Photo", value: "photo" },
                        { label: "Video", value: "video" },
                      ].map((filterItem) => (
                        <button
                          key={filterItem.label}
                          type="button"
                          onClick={() => {
                            setSelectedType(filterItem.value);
                            setIsFilterOpen(false);
                          }}
                          className={`min-h-11 rounded-2xl px-3 text-xs font-black transition ${
                            selectedType === filterItem.value
                              ? "bg-rose-700 text-white"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {filterItem.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      Category
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "All", value: "" },
                        { label: "Engagement", value: "engagement" },
                        { label: "Marriage", value: "marriage" },
                        { label: "Reception", value: "reception" },
                      ].map((filterItem) => (
                        <button
                          key={filterItem.label}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(filterItem.value);
                            setIsFilterOpen(false);
                          }}
                          className={`min-h-11 rounded-2xl px-3 text-xs font-black transition ${
                            selectedCategory === filterItem.value
                              ? "bg-rose-700 text-white"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {filterItem.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(selectedType || selectedCategory) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DesktopGalleryHeader = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedType,
  selectedCategory,
  setSelectedType,
  setSelectedCategory,
  clearFilters,
  totalGalleryCount,
}) => {
  return (
    <div className="hidden lg:block">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.35em] text-rose-600 shadow-[0_10px_24px_rgba(244,63,94,0.08)]">
          <span className="h-2 w-2 rounded-full bg-rose-600" />
          Gallery
        </div>

        <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-950 xl:text-6xl">
          Photo & Video Gallery
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-500">
          A clean collection of our beautiful moments, celebrations, smiles, and blessings.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="mt-7"
      >
        <GalleryFilter
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen((current) => !current)}
          onClose={() => setIsFilterOpen(false)}
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          onTypeChange={(value) => {
            setSelectedType(value);
            setIsFilterOpen(false);
          }}
          onCategoryChange={(value) => {
            setSelectedCategory(value);
            setIsFilterOpen(false);
          }}
          onClear={clearFilters}
          totalCount={totalGalleryCount}
        />
      </motion.div>
    </div>
  );
};

const Gallery = () => {
  const loadMoreTriggerRef = useRef(null);

  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [mediaShapes, setMediaShapes] = useState({});

  const filters = useMemo(
    () => ({
      ...(selectedType && { type: selectedType }),
      ...(selectedCategory && { category: selectedCategory }),
    }),
    [selectedType, selectedCategory]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGallery(filters, GALLERY_PAGE_LIMIT);

  const galleryItems = useMemo(
    () => data?.pages?.flatMap((page) => page?.data || []) || [],
    [data]
  );

  const totalGalleryCount = data?.pages?.[0]?.total || galleryItems.length;
  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;

  const updateMediaShape = useCallback((itemId, shape) => {
    setMediaShapes((prev) => {
      if (prev[itemId] === shape) return prev;

      return {
        ...prev,
        [itemId]: shape,
      };
    });
  }, []);

  const openPreview = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const clearFilters = () => {
    setSelectedType("");
    setSelectedCategory("");
    setIsFilterOpen(false);
  };

  const closePreview = () => setActiveIndex(null);

  const showPrevious = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || galleryItems.length === 0) return null;
      return currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
    });
  };

  const showNext = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || galleryItems.length === 0) return null;
      return currentIndex === galleryItems.length - 1 ? 0 : currentIndex + 1;
    });
  };

  useEffect(() => {
    setActiveIndex(null);
  }, [selectedType, selectedCategory]);

  useEffect(() => {
    if (!loadMoreTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isLoading
        ) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "500px 0px 500px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(loadMoreTriggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, galleryItems.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePreview();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, galleryItems.length]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-12 pt-5 sm:px-5 sm:pb-14 sm:pt-6 md:px-6 md:pb-16 md:pt-7 lg:px-8 lg:pb-20 lg:pt-8">
      <div className="relative mx-auto max-w-7xl">
        <MobileGalleryHeader
          totalGalleryCount={totalGalleryCount}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          setSelectedType={setSelectedType}
          setSelectedCategory={setSelectedCategory}
          clearFilters={clearFilters}
        />

        <DesktopGalleryHeader
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          setSelectedType={setSelectedType}
          setSelectedCategory={setSelectedCategory}
          clearFilters={clearFilters}
          totalGalleryCount={totalGalleryCount}
        />

        {isLoading && <LoadingState message="Loading gallery..." />}

        {isError && (
          <div className="mt-8">
            <ErrorState
              message={
                error?.response?.data?.message || "Failed to load gallery."
              }
            />
          </div>
        )}

        {!isLoading && !isError && galleryItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <div className="mx-auto max-w-xl rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-700">
                <Camera size={26} />
              </div>

              <div className="mt-6">
                <EmptyState
                  title="Coming Soon"
                  message="Beautiful wedding memories will be uploaded soon."
                />
              </div>
            </div>
          </motion.div>
        )}

        {!isLoading && !isError && galleryItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="mt-5 sm:mt-6 lg:mt-7"
          >
            <div className="mb-3 hidden flex-col gap-3 sm:mb-5 lg:flex lg:flex-row lg:items-center lg:justify-between">
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-rose-600 shadow-sm ring-1 ring-rose-100">
                <Sparkles size={14} />
                Memories
              </p>

              <p className="text-xs font-semibold leading-5 text-gray-500 sm:text-sm">
                Scroll naturally through memories.
              </p>
            </div>

            <div className="mb-3 flex items-center justify-between lg:hidden">
              <p className="text-xs font-bold text-slate-500">
                Tap any memory to preview.
              </p>

              <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-rose-700">
                <Sparkles size={12} />
                Memories
              </div>
            </div>

            <div className="columns-2 gap-3 sm:columns-2 sm:gap-4 md:columns-3 lg:columns-3 xl:columns-4">
              {galleryItems.map((item, index) => {
                const shape = mediaShapes[item._id] || getFallbackShape(index);

                return (
                  <GalleryCard
                    key={item._id}
                    item={item}
                    index={index}
                    shape={shape}
                    onOpen={openPreview}
                    onUpdateShape={updateMediaShape}
                  />
                );
              })}
            </div>

            <div ref={loadMoreTriggerRef} className="h-8 w-full" />

            {(hasNextPage || isFetchingNextPage) && (
              <div className="flex justify-center px-4 pb-6 pt-6 lg:pb-10 lg:pt-6">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-5 py-3 text-sm font-black text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading memories...
                    </>
                  ) : (
                    <>Load more memories</>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#070a12]/95 p-0 backdrop-blur-2xl sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
          >
            <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
              className="relative flex h-full w-full flex-col overflow-hidden bg-[#0b0f19] shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:h-[92vh] sm:max-w-6xl sm:rounded-[2rem] sm:border sm:border-white/10"
            >
              <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between gap-3 bg-gradient-to-b from-black/75 via-black/38 to-transparent px-3 pb-10 pt-3 sm:px-5 sm:pt-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/15 backdrop-blur-xl">
                    {activeItem.type === "video" ? (
                      <Film size={18} />
                    ) : (
                      <Camera size={18} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white sm:text-base">
                      {activeItem.title}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200/80 sm:text-[11px]">
                      {activeItem.category || "Wedding Memory"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePreview}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl shadow-black/30 transition hover:scale-105 active:scale-95"
                  aria-label="Close preview"
                >
                  <X size={21} strokeWidth={2.8} />
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
                {activeItem.type === "photo" ? (
                  <img
                    src={activeItem.url}
                    alt={activeItem.title}
                    className="h-full max-h-full w-full object-contain"
                  />
                ) : (
                  <video
                    src={activeItem.url}
                    controls
                    autoPlay
                    className="h-full max-h-full w-full object-contain"
                  />
                )}

                {galleryItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        showPrevious();
                      }}
                      className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/14 text-white ring-1 ring-white/20 backdrop-blur-xl transition hover:bg-white hover:text-slate-950 md:flex"
                      aria-label="Previous memory"
                    >
                      <ChevronLeft size={28} />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        showNext();
                      }}
                      className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/14 text-white ring-1 ring-white/20 backdrop-blur-xl transition hover:bg-white hover:text-slate-950 md:flex"
                      aria-label="Next memory"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
              </div>

              <div className="z-20 border-t border-white/10 bg-[#0b0f19]/92 px-4 py-4 backdrop-blur-2xl sm:px-5 md:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3 py-1.5 text-[11px] font-black capitalize text-cyan-200 ring-1 ring-cyan-300/20">
                        {activeItem.type === "video" ? (
                          <Film size={13} />
                        ) : (
                          <Camera size={13} />
                        )}
                        {activeItem.type}
                      </span>

                      <span className="rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-black text-white/75 ring-1 ring-white/10">
                        {activeIndex + 1} / {galleryItems.length}
                      </span>
                    </div>

                    {activeItem.description && (
                      <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-white/62">
                        {activeItem.description}
                      </p>
                    )}
                  </div>
                </div>

                {galleryItems.length > 1 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
                    <button
                      type="button"
                      onClick={showPrevious}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/8 px-4 py-3 text-sm font-black text-white ring-1 ring-white/12"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={showNext}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;