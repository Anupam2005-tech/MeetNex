import React from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "@/components/ui/Loader";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      
      <SignedOut>
        <Navigate 
          to={`/login?reason=auth&redirect_url=${encodeURIComponent(location.pathname + location.search)}`} 
          replace 
        />
      </SignedOut>
    </>
  );
};