import { useAuth } from "@clerk/clerk-react";
import Loader from "@/components/ui/Loader";

export default function AuthBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loader />;
  }

  return <>{children}</>;
}
