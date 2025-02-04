import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { SignedOut, useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, MusicIcon, Users } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

function LoginPrompt() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative">
        <div
          className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse"
          aria-hidden="true"
        />

        <div className="relative bg-zinc-900 rounded-full p-4">
          <HeadphonesIcon className="size-8 text-purple-400" />
        </div>
      </div>

      <div className="space-y-3 max-w-[250px]">
        <h3 className="text-xl font-semibold text-white">
          See what others are listening to
        </h3>
        <p className="text-sm text-zinc-400">
          Login to discover the Melodia world
        </p>
      </div>
    </div>
  );
}

function FriendsActivity() {
  const { user } = useUser();
  const { users, fetchUsers, onlineUsers, userActivities, setSelectedUser } =
    useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetchUsers();
  }, [fetchUsers, user]);

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">What they are listening</h2>
        </div>
      </div>

      <SignedOut>
        <LoginPrompt />
      </SignedOut>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users.map((user) => {
            const activity = userActivities.get(user.clerkId);
            const isPlaying = activity && activity !== "Online";

            return (
              <div
                key={user._id}
                className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
                onClick={() => {
                  navigate("/chat");

                  setSelectedUser(user);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="size-10 border border-zinc-800">
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>

                    <div
                      className={twMerge(
                        "absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900",
                        onlineUsers.has(user.clerkId)
                          ? "bg-purple-500"
                          : "bg-zinc-500"
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">
                        {user.fullName}
                      </span>
                      {isPlaying && (
                        <MusicIcon className="size-3.5 text-purple-400 shrink-0" />
                      )}
                    </div>

                    {isPlaying ? (
                      <div className="mt-1">
                        <div className="my-1 text-sm text-white font-medium truncate">
                          {activity.replace("Playing", "").split(" by ")[0]}
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {activity.split(" by ")[1]}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-zinc-400">
                        {onlineUsers.has(user.clerkId) ? "Online" : "Offline"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default FriendsActivity;
