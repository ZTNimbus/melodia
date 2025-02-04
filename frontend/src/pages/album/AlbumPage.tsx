import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDuration } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function AlbumPage() {
  const { id } = useParams();

  const { fetchAlbum, selectedAlbum, isLoadingAlbum } = useMusicStore();

  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (!id) return;

    fetchAlbum(id);
  }, [id, fetchAlbum]);

  function handlePlaySong(index: number) {
    if (!selectedAlbum) return;

    playAlbum(selectedAlbum.songs, index);
  }

  function handlePlayAlbum() {
    if (!selectedAlbum) return;

    const isCurrentAlbumPlaying = selectedAlbum?.songs.some(
      (s) => s._id === currentSong?._id
    );

    if (isCurrentAlbumPlaying) togglePlay();
    else playAlbum(selectedAlbum.songs);
  }

  if (isLoadingAlbum) return null;

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/10 to-zinc-900 pointer-events-none"
            aria-hidden={true}
          />

          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={selectedAlbum?.imageUrl}
                alt={selectedAlbum?.title}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />

              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {selectedAlbum?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm  to-zinc-100">
                  <span className="font-medium text-white">
                    {selectedAlbum?.artist}
                  </span>
                  <span>- {selectedAlbum?.songs.length} Songs</span>
                  <span>- {selectedAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                className="size-14 rounded-full bg-purple-500 hover:bg-purple-400 hover:scale-105 transition-all"
                size={"icon"}
              >
                {isPlaying &&
                selectedAlbum?.songs.some((s) => s._id === currentSong?._id) ? (
                  <Pause className="size-7 text-black" />
                ) : (
                  <Play className="size-7 text-black" />
                )}
              </Button>
            </div>

            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[30px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>Track</div>
                <div>Title</div>
                <div>Release Date</div>
                <div>
                  <Clock className="size-4" />
                </div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {selectedAlbum?.songs.map((song, i) => {
                    const isCurrentSong = currentSong?._id === song._id;

                    return (
                      <div
                        onClick={() => handlePlaySong(i)}
                        key={song._id}
                        className="grid grid-cols-[30px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong ? (
                            <div className="size-4 text-purple-500 animate-pulse">
                              🎵
                            </div>
                          ) : (
                            <span className="group-hover:hidden">{i + 1}</span>
                          )}

                          {!isCurrentSong && (
                            <Play className="size-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />

                          <div>
                            <div className="font-medium text-white">
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {song.createdAt.split("T").at(0)}
                        </div>

                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default AlbumPage;
