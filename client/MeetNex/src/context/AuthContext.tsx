// import React, { createContext, useContext, useMemo } from "react";
// import { useUser, useAuth } from "@clerk/clerk-react";

// interface UserProfile {
//   id: string;
//   fullName: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   imageUrl: string;
// }

// interface AuthContextType {
//   user: UserProfile | null;
//   isSignedIn: boolean;
//   isLoaded: boolean;
//   getToken: () => Promise<string | null>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const { user, isSignedIn, isLoaded } = useUser();
//   const { getToken } = useAuth();

//   const userProfile = useMemo(() => {
//     if (!user) return null;
//     return {
//       id: user.id,
//       fullName: user.fullName || "Anonymous",
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       email: user.primaryEmailAddress?.emailAddress || "",
//       imageUrl: user.imageUrl,
//     };
//   }, [user]);

//   const value = useMemo(() => ({
//     user: userProfile,
//     isSignedIn: !!isSignedIn,
//     isLoaded,
//     getToken,
//   }), [userProfile, isSignedIn, isLoaded, getToken]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAppAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAppAuth must be used within AuthProvider");
//   return ctx;
// };

import React, { useMemo, createContext, useContext } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

interface UserProfile {
    firstName: string
    lastName: string
    fullName: string
    imageUrl: string
    id: string
    email: string
}

interface AuthContextType {
    user: UserProfile | null;
    isSignedIn: boolean;
    isLoaded: boolean;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isSignedIn, isLoaded } = useUser();
    const { getToken } = useAuth();

    const userProfile = useMemo(() => {
        if (!user) return null
        return {
            id: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            fullName: user.fullName || "Anonymous",
            imageUrl: user.imageUrl,
            email: user.primaryEmailAddress?.emailAddress || ""
        }
    }, [user])
    const value = useMemo(() => ({
        user: userProfile,
        isSignedIn: !!isSignedIn,
        isLoaded,
        getToken,
    }), [userProfile, isSignedIn, isLoaded, getToken]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}
export const useAppAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAppAuth must be used within AuthProvider");
    return ctx;
};