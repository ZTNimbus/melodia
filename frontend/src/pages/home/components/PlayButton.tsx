import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";

function PlayButton({ song }: { song: Song }) {
  const { currentSong, isPlaying, togglePlay, setCurrentSong } =
    usePlayerStore();

  const isCurrentSong = currentSong?._id === song._id;

  function handlePlay(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  }

  return (
    <Button
      className={`absolute bottom-3 right-2 bg-purple-500 hover:bg-purple-400 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${
        isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      onClick={handlePlay}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
}

export default PlayButton;
