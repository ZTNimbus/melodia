import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const prevSongRef = useRef<string | null>(null);

  const { isPlaying, currentSong, playNext } = usePlayerStore();

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    function handleEventEnded() {
      playNext();
    }

    audio?.addEventListener("ended", handleEventEnded);

    return () => audio?.removeEventListener("ended", handleEventEnded);
  }, [playNext]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    const isSongChanged = prevSongRef.current !== currentSong?.audioUrl;

    if (isSongChanged) {
      audio.src = currentSong?.audioUrl;
      audio.currentTime = 0;

      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
}

export default AudioPlayer;
