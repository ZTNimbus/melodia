import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";
import PlayButton from "./PlayButton";
import { Song } from "@/types";
import { usePlayerStore } from "@/stores/usePlayerStore";

function FeaturedSection() {
  const { isLoadingPlaylists, featuredSongs, error } = useMusicStore();

  const { currentSong, togglePlay, setCurrentSong } = usePlayerStore();

  function handlePlay(song: Song) {
    if (currentSong?._id === song._id) togglePlay();
    else setCurrentSong(song);
  }

  if (isLoadingPlaylists) return <FeaturedGridSkeleton />;

  if (error) <p className="text-red-500 mb-4 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {featuredSongs.map((song) => {
        return (
          <div
            key={song._id}
            onClick={() => handlePlay(song)}
            className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative"
          >
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-1/6 sm:w-20 h-1/6 sm:h-20 object-cover flex-shrink-0"
            />
            <div className="flex-1 p-4">
              <p className="font-medium truncate">{song.title}</p>
              <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
            </div>

            <PlayButton song={song} />
          </div>
        );
      })}
    </div>
  );
}

export default FeaturedSection;
