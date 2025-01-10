import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  selectedAlbum: Album | null;
  isLoadingAlbums: boolean;
  isLoadingAlbum: boolean;
  error: string | null;
  fetchAlbums: () => Promise<void>;
  fetchAlbum: (id: string) => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => {
  return {
    albums: [],
    selectedAlbum: null,
    songs: [],
    isLoadingAlbums: false,
    isLoadingAlbum: false,
    error: null,

    fetchAlbums: async () => {
      set({ isLoadingAlbums: true, error: null });

      try {
        const res = await axiosInstance.get("/albums");

        set({ albums: res.data });
      } catch (error: any) {
        console.log("use music store error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingAlbums: false });
      }
    },

    fetchAlbum: async (id) => {
      set({ isLoadingAlbum: true, error: null });

      try {
        const res = await axiosInstance.get(`/albums/${id}`);

        set({ selectedAlbum: res.data });
      } catch (error: any) {
        console.log("fetch album error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingAlbum: false });
      }
    },
  };
});

export { useMusicStore };
