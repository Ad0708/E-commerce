interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant: "danger" | "primary";
}

export function ActionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant,
}: ActionDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 w-full"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl w-full transition-all ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
