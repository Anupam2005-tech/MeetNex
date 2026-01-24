import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Loader from "@/components/ui/Loader";
import { ProtectedRoute } from "./ProtectedRoutes";
const HomeLayout = lazy(() => import("@/pages/dashboard/home/HomeLayout"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const MainLayout = lazy(() => import("@/components/layout/MainLayout"));
const JoinMeetingPage = lazy(() => import("@/pages/meeting/JoinMeetingPage"));
const RoomPage = lazy(() => import("@/pages/meeting/RoomPage"));
const LumiChat = lazy(() => import("@/components/ui/LumiChat"));
const NotFound = lazy(() => import("@/components/ui/NotFound"));

function Approuter() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ROOT */}
          <Route path="/" element={
            <>
              <SignedIn><Navigate to="/home" replace /></SignedIn>
              <SignedOut><HomeLayout /></SignedOut>
            </>
          } />

          {/* AUTH */}
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register/*" element={<RegisterPage />} />

          {/* DASHBOARD & SETTINGS */}
          <Route path="/home" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />

          {/* MEETING FLOW */}
          <Route path="/join" element={<ProtectedRoute><JoinMeetingPage /></ProtectedRoute>} />
          <Route path="/join/:roomId" element={<ProtectedRoute><JoinMeetingPage /></ProtectedRoute>} />
          <Route path="/room/:roomId" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />

          {/* TOOLS */}
          <Route path="/lumi" element={<ProtectedRoute><LumiChat /></ProtectedRoute>}/>

          {/* 404 / ERROR */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default Approuter;