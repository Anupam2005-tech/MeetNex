import React, { useEffect } from "react";
import LoginForm from "@/components/forms/LoginForm";
import { useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Preserve intended route
  const from = location.state?.from?.pathname || "/home";

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoaded, isSignedIn, from, navigate]);

  // ⏳ Wait for Clerk before rendering
  if (!isLoaded) {
    return null; // or loader if you want
  }

  return (
    <div className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

      {/* ================= LEFT BRAND SECTION ================= */}
      <div
        className="hidden lg:flex relative flex-col justify-between px-16 py-14
        bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 text-white"
      >
        {/* TOP LOGO */}
        <div className="flex items-center gap-3 z-10">
          <div className="h-10 w-10 rounded-xl bg-white/90 flex items-center justify-center">
            <span className="text-indigo-700 font-bold text-xl">*</span>
          </div>
          <span className="text-xl font-semibold">MeetNeX</span>
        </div>

        {/* CENTER TEXT */}
        <div className="max-w-lg z-10">
          <h1 className="text-5xl font-bold leading-tight">
            Hello MeetNeX! 👋
          </h1>

          <p className="mt-6 text-lg text-white/90">
            Skip repetitive and manual video-meeting tasks.
            Meet smarter, faster and more securely with MeetNeX.
          </p>
        </div>

        <div>
          <img
            src="/loginBanner.png"
            alt="MeetNeX Login Illustration"
            className="w-[420px] xl:w-[480px]"
          />
        </div>

        {/* BOTTOM FOOTER */}
        <p className="text-sm text-white/70 z-10">
          © {new Date().getFullYear()} MeetNeX. All rights reserved.
        </p>
      </div>

      {/* ================= RIGHT LOGIN SECTION ================= */}
      <div className="flex items-center justify-center px-6 sm:px-10 bg-white">
        <div className="w-full max-w-md z-10">
          <LoginForm />
        </div>
      </div>

    </div>
  );
}

export default LoginPage;
