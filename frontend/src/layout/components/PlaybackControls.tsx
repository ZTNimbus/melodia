import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  VolumeOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function PlaybackControls() {
  const { currentSong, isPlaying, togglePlay, playPrevious, playNext } =
    usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleSeek(value: number[]) {
    if (audioRef.current) audioRef.current.currentTime = value[0];
  }

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;

    if (!audio) return;

    function updateTime() {
      if (!audio) return;

      setCurrentTime(audio.currentTime);
    }

    function updateDuration() {
      if (!audio) return;

      setDuration(audio.duration);
    }

    function handleEnded() {
      usePlayerStore.setState({ isPlaying: false });
    }

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted) audioRef.current.volume = 0;
    else audioRef.current.volume = volume / 100;
  }, [isMuted, volume]);

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="size-14 object-cover rounded-md"
              />

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Shuffle className="size-4" />
            </Button>

            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-white text-zinc-400"
              onClick={() => {
                if (!audioRef.current) return;

                if (currentTime > 2) {
                  audioRef.current.currentTime = 0;
                } else playPrevious();
              }}
              disabled={!currentSong}
            >
              <SkipBack className="size-4" />
            </Button>

            <Button
              size={"icon"}
              className="hover:text-white/80 text-black rounded-full bg-white"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
            </Button>

            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="size-4" />
            </Button>

            <Button
              size={"icon"}
              variant={"ghost"}
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <SkipForward className="size-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />

            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <Mic2 className="size-4" />
          </Button>

          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <ListMusic className="size-4" />
          </Button>

          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <Laptop2 className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-white text-zinc-400"
              onClick={() => {
                if (isMuted && volume === 0 && audioRef.current) {
                  setIsMuted(false);
                  setVolume(25);
                  audioRef.current.volume = 25 / 100;
                } else setIsMuted((m) => !m);
              }}
            >
              {isMuted ? (
                <VolumeOff className="size-4" />
              ) : (
                <Volume1 className="size-4" />
              )}
            </Button>

            <Slider
              value={isMuted ? [0] : [volume]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);

                if (value[0] === 0) setIsMuted(true);
                else setIsMuted(false);

                if (audioRef.current) audioRef.current.volume = value[0] / 100;
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PlaybackControls;
