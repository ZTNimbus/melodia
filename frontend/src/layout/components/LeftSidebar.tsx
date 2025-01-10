import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function LeftSidebar() {
  const { isLoadingAlbums, albums, fetchAlbums } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-center items-center md:justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="md:mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-center items-center md:justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <MessageCircleIcon className="md:mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      <div className="bg-zinc-900 p-4 flex-1 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="mr-2 size-5" />
            <span className="hidden md:inline">Playlists</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoadingAlbums ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => {
                return (
                  <Link
                    to={`/albums/${album._id}`}
                    key={album._id}
                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <img
                      src={album.imageUrl}
                      alt="playlist image"
                      className="size-12 rounded-md flex-shrink-0 object-cover"
                    />

                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">{album.title}</p>
                      <p className="text-sm text-zinc-400 truncate">
                        {album.artist}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default LeftSidebar;
