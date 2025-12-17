import { useUser } from "@clerk/clerk-react";

export function UserDetails() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  return {
    firstname: user.firstName,
    lastname:user.lastName,
    avatarUrl: user.imageUrl,
    emailAddress: user.primaryEmailAddress?.emailAddress || "",
  };
}
