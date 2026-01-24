import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      visibleToasts={3}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex items-center gap-3 w-full p-4 rounded-xl bg-[#121212] border border-[#2A2A2A] shadow-2xl backdrop-blur-md min-w-[320px] font-sans",
          title: "text-sm font-medium text-zinc-100",
          description: "text-xs text-zinc-400 mt-0.5",
          // Accent colors for dark mode
          success: "text-emerald-400",
          error: "text-rose-400",
          info: "text-sky-400",
        },
      }}
    />
  );
};