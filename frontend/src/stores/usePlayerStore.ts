import { create } from "zustand";
import { Song } from "@/types";

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

      set({
        queue: songs,
        currentSong: song,
        currentIndex: startIndex,
        isPlaying: true,
      });
    },

    setCurrentSong: (song) => {
      if (!song) return;

      const songIndex = get().queue.findIndex((s) => s._id === song._id);

      set({
        currentSong: song,
        isPlaying: true,
        currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      });
    },

    togglePlay: () => {
      set({ isPlaying: !get().isPlaying });
    },

    playNext: () => {
      const { currentIndex, queue } = get();

      const nextIndex = currentIndex + 1;

      if (nextIndex < queue.length) {
        const nextSong = queue[nextIndex];

        set({
          currentSong: nextSong,
          currentIndex: nextIndex,
          isPlaying: true,
        });
      } else set({ isPlaying: false });
    },

    playPrevious: () => {
      const { currentIndex, queue } = get();

      const previousIndex = currentIndex - 1;

      if (previousIndex >= 0) {
        const nextSong = queue[previousIndex];

        set({
          currentSong: nextSong,
          currentIndex: previousIndex,
          isPlaying: true,
        });
      } else set({ isPlaying: false });
    },
  };
});

export { usePlayerStore };
