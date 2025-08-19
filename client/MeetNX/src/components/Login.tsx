import React from "react";

import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { cn } from "../lib/Utils";
import {
  IconBrandGoogle,
  IconBrandApple,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export function Login() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Top-left Gradient (Dark Navy) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#031326] to-[#04183c]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)", // top-left diagonal
        }}
      />

      {/* Bottom-right Gradient (Black) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)", // bottom-right diagonal
        }}
      />

      {/* Form Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-8">
        <div className="shadow-2xl w-full max-w-md rounded-2xl p-8 bg-black/70 backdrop-blur-md border border-[#1f2a3d]">
          {/* Welcome Back Banner */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              Welcome Back 👋
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Please login to continue your journey
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6 text-white">
            Login To your Account
          </h2>

          <form className="mb-6" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                className="bg-[#0a192f]/50 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                className="bg-[#0a192f]/50 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500"
              />
            </LabelInputContainer>

            <button
              className="group/btn cursor-pointer relative block h-11 w-full rounded-lg bg-gradient-to-br from-blue-900 to-black font-medium text-white shadow-md hover:shadow-lg transition"
              type="submit"
            >
              Sign in &rarr;
              <BottomGradient />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

          {/* Social Logins */}
          <div className="flex flex-col space-y-4">
            <SocialButton icon={<IconBrandGoogle size={18} />} label="Google" />
            <SocialButton icon={<IconBrandApple size={18} />} label="Apple ID" />
            <SocialButton
              icon={<IconBrandLinkedin size={18} />}
              label="LinkedIn"
            />
          </div>

          {/* Redirect to Register */}
          <p className="text-center text-gray-400 text-sm mb-4 mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-blue-400 hover:underline hover:text-blue-300 transition"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Social Button */
const SocialButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    className="group/btn cursor-pointer shadow-md relative flex h-10 w-full items-center justify-center gap-3 rounded-md bg-[#0f1a2b]/80 px-4 font-medium text-white border border-gray-700 hover:bg-[#112240]/90 transition"
    type="button"
  >
    <span className="flex items-center text-gray-200">{icon}</span>
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <BottomGradient />
  </button>
);

/* Button Hover Gradient */
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

/* Add Tailwind Custom Animation */
