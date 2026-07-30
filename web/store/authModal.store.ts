import { create } from "zustand";

export type PendingAction =
  | { type: "ADD_TO_CART"; payload: any }
  | { type: "ADD_TO_WISHLIST"; productId: string }
  | { type: "BUY_NOW"; payload: any }
  | { type: "NAVIGATE"; path: string };

interface AuthModalState {
  isOpen: boolean;
  title: string;
  description: string;
  pendingAction: PendingAction | null;
  openAuthModal: (options?: {
    title?: string;
    description?: string;
    pendingAction?: PendingAction;
  }) => void;
  closeAuthModal: () => void;
  setPendingAction: (action: PendingAction | null) => void;
  clearPendingAction: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  title: "Login Required",
  description:
    "You need to log in to perform this action. Please sign in to continue.",
  pendingAction: null,
  openAuthModal: (options) => {
    if (options?.pendingAction && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "pending_user_action",
          JSON.stringify(options.pendingAction),
        );
      } catch (e) {
        console.error("Failed to set pending action in sessionStorage:", e);
      }
    }
    set({
      isOpen: true,
      title: options?.title || "Login Required",
      description:
        options?.description ||
        "You need to log in to perform this action. Please sign in to continue.",
      pendingAction: options?.pendingAction || null,
    });
  },
  closeAuthModal: () => set({ isOpen: false }),
  setPendingAction: (pendingAction) => set({ pendingAction }),
  clearPendingAction: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pending_user_action");
    }
    set({ pendingAction: null });
  },
}));
