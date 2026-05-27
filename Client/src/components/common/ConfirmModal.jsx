import useConfirmStore from "../../store/confirmStore";

const ConfirmModal = () => {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    closeConfirm,
  } = useConfirmStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }

    closeConfirm();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeConfirm}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-xl p-6">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-2xl font-bold">
          !
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-5">{title}</h2>

        <p className="text-gray-600 mt-3 leading-relaxed">{message}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={closeConfirm}
            className="px-5 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;