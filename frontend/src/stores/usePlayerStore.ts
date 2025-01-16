import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => {
  return {
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs) => {
      set({
        queue: songs,
        currentSong: get().currentSong || songs[0],
        currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
      });
    },

    playAlbum: (songs, startIndex = 0) => {
      if (!songs.length) return;

      const song = songs[startIndex];

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${song.title} by ${song.artist}`,
        });
      }

      set({
        queue: songs,
        currentSong: song,
        currentIndex: startIndex,
        isPlaying: true,
      });
    },

    setCurrentSong: (song) => {
      if (!song) return;

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${song.title} by ${song.artist}`,
        });
      }

      const songIndex = get().queue.findIndex((s) => s._id === song._id);

      set({
        currentSong: song,
        isPlaying: true,
        currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      });
    },

    togglePlay: () => {
      const willPlay = !get().isPlaying;

      set({ isPlaying: willPlay });

      const currentSong = get().currentSong;
      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity:
            willPlay && currentSong
              ? `Playing ${currentSong.title} by ${currentSong.artist}`
              : "Online",
        });
      }
    },

    playNext: () => {
      const { currentIndex, queue } = get();

      const nextIndex = currentIndex + 1;

      if (nextIndex < queue.length) {
        const nextSong = queue[nextIndex];

        const socket = useChatStore.getState().socket;

        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
          });
        }

        set({
          currentSong: nextSong,
          currentIndex: nextIndex,
          isPlaying: true,
        });
      } else {
        set({ isPlaying: false });

        const socket = useChatStore.getState().socket;

        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: "Online",
          });
        }
      }
    },

    playPrevious: () => {
      const { currentIndex, queue } = get();

      const previousIndex = currentIndex - 1;

      if (previousIndex >= 0) {
        const nextSong = queue[previousIndex];

        const socket = useChatStore.getState().socket;

        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
          });
        }

        set({
          currentSong: nextSong,
          currentIndex: previousIndex,
          isPlaying: true,
        });
      } else {
        set({ isPlaying: false });

        const socket = useChatStore.getState().socket;

        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: "Online",
          });
        }
      }
    },
  };
});

export { usePlayerStore };
