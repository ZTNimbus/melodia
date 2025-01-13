import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  error: string | null;
  isLoading: boolean;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

const useAuthStore = create<AuthStore>((set) => {
  return {
    isAdmin: false,
    error: null,
    isLoading: false,

    checkAdminStatus: async () => {
      set({ isLoading: true, error: null });

      try {
        const res = await axiosInstance.get("/admin/check");

        set({ isAdmin: res.data.admin });
      } catch (error: any) {
        set({ isAdmin: false, error: error.response.data.message });
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () => {
      set({ isAdmin: false, error: null, isLoading: false });
    },
  };
});

export { useAuthStore };
