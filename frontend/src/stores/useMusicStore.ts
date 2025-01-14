import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  selectedAlbum: Album | null;
  isLoadingAlbums: boolean;
  isLoadingAlbum: boolean;
  isLoadingPlaylists: boolean;
  isLoadingSongs: boolean;
  isLoadingStats: boolean;
  isDeleting: boolean;
  error: string | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbum: (id: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => {
  return {
    albums: [],
    selectedAlbum: null,
    songs: [],
    isLoadingAlbums: false,
    isLoadingAlbum: false,
    isLoadingPlaylists: false,
    isLoadingSongs: false,
    isLoadingStats: false,
    isDeleting: false,
    error: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    stats: {
      totalSongsCount: 0,
      totalAlbumsCount: 0,
      totalUsersCount: 0,
      totalArtistsCount: 0,
    },

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

    fetchSongs: async () => {
      set({ isLoadingSongs: true, error: null });

      try {
        const res = await axiosInstance.get("/songs");

        set({ songs: [...res.data] });
      } catch (error: any) {
        console.log("fetch all songs error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingSongs: false });
      }
    },

    fetchStats: async () => {
      set({ isLoadingStats: true, error: null });

      try {
        const res = await axiosInstance.get("/stats");

        set({ stats: res.data });
      } catch (error: any) {
        console.log("fetch stats error", error);

        set({ error: error.response.data.message });
      } finally {
        set({ isLoadingStats: false });
      }
    },

    fetchFeaturedSongs: async () => {
      set({ isLoadingPlaylists: true, error: null });

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
      set({ isLoadingPlaylists: true, error: null });

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
      set({ isLoadingPlaylists: true, error: null });

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

    deleteSong: async (id) => {
      set({ isDeleting: true, error: null });

      try {
        const res = await axiosInstance.delete(`/admin/songs/${id}`);

        set((state) => {
          return {
            songs: state.songs.filter((song) => song._id !== id),
          };
        });

        toast.success(res.data.message);
      } catch (error: any) {
        console.log("delete song error", error);

        set({ error: error.response.data.message });

        toast.error(error.response.data.message);
      } finally {
        set({ isDeleting: false });
      }
    },

    deleteAlbum: async (id) => {
      set({ isDeleting: true, error: null });

      try {
        const res = await axiosInstance.delete(`/admin/albums/${id}`);

        set((state) => {
          return {
            albums: state.albums.filter((album) => album._id !== id),
            songs: state.songs.map((song) =>
              state.albums.find((a) => a._id === id)?.title
                ? { ...song, album: null }
                : song
            ),
          };
        });

        toast.success(res.data.message);
      } catch (error: any) {
        console.log("delete album error", error);

        set({ error: error.response.data.message });

        toast.error(error.response.data.message);
      } finally {
        set({ isDeleting: false });
      }
    },
  };
});

export { useMusicStore };
