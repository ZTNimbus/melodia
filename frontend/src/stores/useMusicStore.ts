import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  selectedAlbum: Album | null;
  isLoadingAlbums: boolean;
  isLoadingAlbum: boolean;
  isLoadingPlaylists: boolean;
  error: string | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  fetchAlbums: () => Promise<void>;
  fetchAlbum: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => {
  return {
    albums: [],
    selectedAlbum: null,
    songs: [],
    isLoadingAlbums: false,
    isLoadingAlbum: false,
    isLoadingPlaylists: false,
    error: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],

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

    fetchFeaturedSongs: async () => {
      set({ isLoadingPlaylists: true });

      try {
        const res = await axiosInstance.get("/songs/featured");

        set({ featuredSongs: res.data });
      } catch (error: any) {
        console.log("fetch featured error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingPlaylists: false });
      }
    },

    fetchMadeForYouSongs: async () => {
      set({ isLoadingPlaylists: true });

      try {
        const res = await axiosInstance.get("/songs/made-for-you");

        set({ madeForYouSongs: res.data });
      } catch (error: any) {
        console.log("fetch made for you error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingPlaylists: false });
      }
    },

    fetchTrendingSongs: async () => {
      set({ isLoadingPlaylists: true });

      try {
        const res = await axiosInstance.get("/songs/trending");

        set({ trendingSongs: res.data });
      } catch (error: any) {
        console.log("fetch trending error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingPlaylists: false });
      }
    },
  };
});

export { useMusicStore };
