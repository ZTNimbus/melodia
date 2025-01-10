import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface ChatStore {
  users: any[];
  isLoadingUsers: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

const useChatStore = create<ChatStore>((set) => {
  return {
    users: [],
    isLoadingUsers: false,
    error: null,

    fetchUsers: async () => {
      set({ isLoadingUsers: true, error: null });

      try {
        const res = await axiosInstance.get("/users");

        set({ users: res.data });
      } catch (error: any) {
        console.log("fetch users error", error);

        set({ error: error.response.data.message });
      }
    },
  };
});

export { useChatStore };
