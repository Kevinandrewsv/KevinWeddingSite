import { create } from "zustand";

const useConfirmStore = create((set) => ({
  isOpen: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  onConfirm: null,

  openConfirm: ({
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
    }),

  closeConfirm: () =>
    set({
      isOpen: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Cancel",
      onConfirm: null,
    }),
}));

export default useConfirmStore;