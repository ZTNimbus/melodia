import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoadingUsers: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseUrl =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const socket = io(baseUrl, { autoConnect: false, withCredentials: true });

const useChatStore = create<ChatStore>((set, get) => {
  return {
    users: [],
    isLoadingUsers: false,
    isLoadingMessages: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,

    fetchUsers: async () => {
      set({ isLoadingUsers: true, error: null });

      try {
        const res = await axiosInstance.get("/users");

        set({ users: res.data });
      } catch (error: any) {
        console.log("fetch users error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingUsers: false });
      }
    },

    initSocket: (userId) => {
      if (!get().isConnected) {
        socket.auth = { userId };

        socket.connect();

        socket.emit("user_connected", userId);

        socket.on("users_online", (users: string[]) => {
          set({ onlineUsers: new Set(users) });
        });

        socket.on("activities", (activities: [string, string][]) => {
          set({ userActivities: new Map(activities) });
        });

        socket.on("user_connected", (userId: string) => {
          set((state) => {
            return {
              onlineUsers: new Set([...state.onlineUsers, userId]),
            };
          });
        });

        socket.on("user_disconnected", (userId: string) => {
          set((state) => {
            const newOnlineUsers = new Set(state.onlineUsers);
            newOnlineUsers.delete(userId);

            return {
              onlineUsers: newOnlineUsers,
            };
          });
        });

        socket.on("receive_message", (message: Message) => {
          set((state) => {
            return { messages: [...state.messages, message] };
          });
        });

        socket.on("message_sent", (message: Message) => {
          set((state) => {
            return { messages: [...state.messages, message] };
          });
        });

        socket.on("activity_updated", ({ userId, activity }) => {
          set((state) => {
            const newActivities = new Map(state.userActivities);
            newActivities.set(userId, activity);

            return {
              userActivities: newActivities,
            };
          });
        });

        set({ isConnected: true });
      }
    },

    disconnectSocket: () => {
      if (!get().isConnected) return;

      socket.disconnect();
      set({ isConnected: false });
    },

    sendMessage: async (receiverId, senderId, content) => {
      const socket = get().socket;

      if (!socket) return;

      socket.emit("send_message", { receiverId, senderId, content });
    },

    fetchMessages: async (userId) => {
      set({ isLoadingMessages: true });

      try {
        const res = await axiosInstance.get(`/users/messages/${userId}`);

        set({ messages: res.data });
      } catch (error: any) {
        console.log("fetch messages error", error);
        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingMessages: false });
      }
    },

    setSelectedUser: (user) => {
      set({ selectedUser: user });
    },
  };
});

export { useChatStore };
