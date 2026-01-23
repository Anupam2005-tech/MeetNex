import React, { useMemo, createContext, useContext, useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { initializeApiAuth, syncUserToDatabase, logoutApi } from "@/utils/api";

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
    const [tokenInitialized, setTokenInitialized] = useState(false);

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

    // Initialize API auth token and sync user when authenticated
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (isSignedIn && !tokenInitialized) {
                    const token = await getToken();
                    if (token) {
                        initializeApiAuth(token);
                        setTokenInitialized(true);
                        
                        // Sync user to database
                        try {
                            await syncUserToDatabase();
                            console.log("User synced to database");
                        } catch (error) {
                            console.error("Failed to sync user:", error);
                        }
                    }
                } else if (!isSignedIn && tokenInitialized) {
                    logoutApi();
                    setTokenInitialized(false);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            }
        };

        if (isLoaded) {
            initializeAuth();
        }
    }, [isSignedIn, isLoaded, getToken, tokenInitialized]);

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