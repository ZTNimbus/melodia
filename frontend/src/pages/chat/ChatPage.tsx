import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { formatDate } from "@/lib/utils";
import { Loader } from "lucide-react";

function ChatPage() {
  const {
    messages,
    selectedUser,
    fetchUsers,
    fetchMessages,
    isLoadingMessages,
  } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchUsers();
  }, [user, fetchUsers]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  if (!user) return null;

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />

      <div className="grid grid-cols-[80px_1fr] lg:grid-cols-[300px_1fr] h-[calc(100vh-180px)]">
        <UsersList />

        <div className="flex flex-col h-full">
          {!selectedUser && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <img
                src="/melodia.png"
                alt="Melodia"
                className="size-16 animate-bounce [animation-duration:2s]"
              />

              <div className="text-center">
                <h3 className="text-zinc-300 text-lg font-medium mb-1">
                  Welcome to Melodia Chat
                </h3>
                <p className="text-zinc-500 text-sm">
                  Select a user to start your chat
                </p>
              </div>
            </div>
          )}

          {isLoadingMessages && (
            <div className="h-full flex items-center justify-center">
              <Loader className=" size-10 animate-spin text-purple-500" />
            </div>
          )}

          {selectedUser && !isLoadingMessages && (
            <>
              <ChatHeader />

              <ScrollArea className="h-[100vh-340px]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => {
                    return (
                      <div
                        key={message._id}
                        className={`flex items-start gap-3${
                          message.senderId === user?.id && " flex-row-reverse"
                        }`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              message.senderId === user?.id
                                ? user.imageUrl
                                : selectedUser.imageUrl
                            }
                            alt={
                              message.senderId === user.id
                                ? user.fullName || "user avatar"
                                : selectedUser.fullName || "user avatar"
                            }
                          />
                        </Avatar>

                        <div
                          className={`rounded-lg p-3 max-w-[70%] ${
                            message.senderId === user?.id
                              ? "bg-purple-500"
                              : "bg-zinc-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-zinc-300 mt-1 block">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default ChatPage;
