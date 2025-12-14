import React from "react";
import {
  IconBrandGoogle,
  IconBrandApple,
  IconBrandFacebook,
  IconKey,
} from "@tabler/icons-react";

export default function LoginForm() {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* LEFT ILLUSTRATION */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src="/loginBanner.png"
          alt="Video Conference"
          className="max-w-md"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-6 text-center ">
            Sign in
          </h1>

          {/* INPUT */}
          <input
            type="text"
            placeholder="Email or phone number"
            className="w-full border rounded-md px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* BUTTON */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition">
            Next
          </button>

          {/* OR */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-500">Or sign in with</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex justify-between gap-3">
            <SocialButton icon={<IconBrandApple size={20} />} />
            <SocialButton icon={<IconBrandGoogle size={20} />} />
            <SocialButton icon={<IconBrandFacebook size={20} />} />
          </div>

          {/* FOOTER */}
          <div className="text-center mt-10 text-sm text-gray-500">
            <p className="text-xs">
              MeetNeX is protected by reCAPTCHA and the Privacy Policy and Terms
              of Service apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label?: string;
}) {
  return (
    <button className="flex items-center justify-center border rounded-md w-12 h-12 hover:bg-gray-100 transition">
      {icon}
    </button>
  );
}
