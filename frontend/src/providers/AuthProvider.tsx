import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";

function updateApiToken(token: string | null) {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
}

function AuthProvider({ children }: PropsWithChildren) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      try {
        const token = await getToken();

        updateApiToken(token);

        if (token) await checkAdminStatus();
      } catch (error) {
        console.log("auth provider error", error);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, [getToken, checkAdminStatus]);

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <div>{children}</div>;
}

export default AuthProvider;
