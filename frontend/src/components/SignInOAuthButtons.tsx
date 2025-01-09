import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

function SignInOAuthButtons() {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  function signInWithGoogle() {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  }

  return (
    <Button
      onClick={() => signInWithGoogle()}
      variant={"secondary"}
      className="w-full text-white border-zinc-200 h-11"
    >
      Sign In with Google
    </Button>
  );
}

export default SignInOAuthButtons;
