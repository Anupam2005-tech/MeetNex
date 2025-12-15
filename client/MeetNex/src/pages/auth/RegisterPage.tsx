import React from "react";
import RegisterForm from "@/components/forms/RegisterForm";

function RegisterPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

      {/* ================= LEFT BRAND SECTION ================= */}
      <div className="hidden lg:flex relative flex-col justify-between px-16 py-14
        bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 text-white">

        {/* TOP LOGO */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/90 flex items-center justify-center">
            <span className="text-indigo-700 font-bold text-xl">*</span>
          </div>
          <span className="text-xl font-semibold">MeetNeX</span>
        </div>

        {/* CENTER TEXT */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Join <br /> MeetNeX 🚀
          </h1>

          <p className="mt-6 text-lg text-white/90">
            Create your account and start hosting secure,
            high-quality video meetings in seconds.
          </p>
        </div>

        {/* BOTTOM FOOTER */}
        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} MeetNeX. All rights reserved.
        </p>
      </div>

      {/* ================= RIGHT REGISTER SECTION ================= */}
      <div className="flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>

    </div>
  );
}

export default RegisterPage;
