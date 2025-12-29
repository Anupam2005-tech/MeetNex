import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import { MainLayout } from "@/components/layout/MainLayout";
import Settings from "@/components/layout/Settings";
import Loader from "@/components/ui/Loader";
import HomeLayout from "@/pages/dashboard/home/HomeLayout";
import RoomPage from "@/pages/meeting/RoomPage";
import { ProtectedRoute } from "./ProtectedRoutes";
import LumiChat from "@/components/ui/LumiChat";
import JoinMeetingPage from "@/pages/meeting/JoinMeetingPage";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

function Approuter() {
  return (
    <Router>
      <Suspense
        fallback={<Loader/>
        }
      >
        <Routes>

          {/* ROOT */}
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Navigate to="/home" replace />
                </SignedIn>
                <SignedOut>
                  <HomeLayout />
                </SignedOut>
              </>
            }
          />

          {/* HOME */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />

          {/* AUTH */}
          <Route
            path="/login"
            element={
              <>
                <SignedIn>
                  <Navigate to="/home" replace />
                </SignedIn>
                <SignedOut>
                  <LoginPage />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <SignedIn>
                  <Navigate to="/home" replace />
                </SignedIn>
                <SignedOut>
                  <RegisterPage />
                </SignedOut>
              </>
            }
          />

          {/* PROTECTED */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />
          <Route path="/lumi/chat" element={
            <ProtectedRoute>
              <LumiChat/>
            </ProtectedRoute>
          }/>
          <Route path="/join" element={
            <ProtectedRoute>
              <JoinMeetingPage/>
            </ProtectedRoute>
          }/>
          
        </Routes>
      </Suspense>
    </Router>
  );
}

export default Approuter;
