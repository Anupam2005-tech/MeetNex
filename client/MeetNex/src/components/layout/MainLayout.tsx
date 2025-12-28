import { useEffect, useState, lazy } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import {
  IconVideo,
  IconPlus,
  IconClock,
  IconMessage2Bolt,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import MainLayoutText from "./MainLayoutText";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Modal } from "../ui/Modal"; 
import RoomID from "@/pages/meeting/RoomID";

export function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [meetingDropdownOpen, setMeetingDropdownOpen] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const links = [
    {
      label: "Create New Meeting",
      icon: <IconVideo className="h-5 w-5" />,
      dropdown: [
        {
          label: "Start Instant Meeting",
          to: "/meeting/instant",
          icon: <IconPlus className="h-4 w-4" />,
        },
        {
          label: "Schedule Meeting",
          to: "/meeting/schedule",
          icon: <IconClock className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Lumi",
      to: "/lumi/chat",
      icon: <IconMessage2Bolt className="h-5 w-5" />,
    },
  ];

  const handleSubLinkClick = (sub: { label: string; to: string }) => {
    if (sub.label === "Start Instant Meeting") {
      // We set a flag that we want to start an instant meeting
      setPendingRoute("instant");
    } else if (sub.label === "Schedule Meeting") {
      setIsScheduleModalOpen(true);
    } else {
      navigate(sub.to);
    }
  };

  // NEW: Backend-driven Room Generation
  const createMeetingAndNavigate = async (mode: "p2p" | "sfu") => {
    try {
      /** * TODO: Replace this with your actual backend call:
       * const response = await fetch("/api/rooms/create", { method: "POST" });
       * const { roomId } = await response.json();
       */
      
      // Simulating backend response:
      const backendRoomId = Math.random().toString(36).substring(2, 10).toUpperCase(); 

      // Navigate to the dynamic room path with the type query
      navigate(`/room/${backendRoomId}?type=${mode}`);
      
      setPendingRoute(null);
    } catch (error) {
      console.error("Backend Error:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      
      <Modal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)}
        title="Scheduled Meeting Generated"
        className="max-w-md bg-white shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center py-2">
          <RoomID />
        </div>
      </Modal>

      {/* SELECTION OVERLAY */}
      {pendingRoute === "instant" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Select Meeting Style</h2>
            <div className="flex gap-6">
              <button
                onClick={() => createMeetingAndNavigate("p2p")}
                className="flex flex-col items-center gap-4 p-8 border-2 border-gray-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
              >
                <IconUser size={48} className="text-gray-400 group-hover:text-blue-600" />
                <div className="text-center">
                  <span className="block font-bold text-gray-900">1:1 Direct</span>
                  <span className="text-xs text-gray-500 font-mono uppercase">P2P Architecture</span>
                </div>
              </button>

              <button
                onClick={() => createMeetingAndNavigate("sfu")}
                className="flex flex-col items-center gap-4 p-8 border-2 border-gray-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
              >
                <IconUsers size={48} className="text-gray-400 group-hover:text-blue-600" />
                <div className="text-center">
                  <span className="block font-bold text-gray-900">Group Mesh</span>
                  <span className="text-xs text-gray-500 font-mono uppercase">SFU Architecture</span>
                </div>
              </button>
            </div>
            <button
              onClick={() => setPendingRoute(null)}
              className="mt-12 text-sm text-gray-400 hover:text-gray-900 underline underline-offset-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-6">
          <div className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
            <Logo />
            <div className="mt-8 flex flex-col gap-3">
              {links.map((link, idx) => (
                <div key={idx}>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (link.dropdown) {
                        setMeetingDropdownOpen(
                          meetingDropdownOpen === link.label ? null : link.label
                        );
                      }
                      setSelected(link.label);
                    }}
                  >
                    <SidebarLink
                      link={link}
                      className={`rounded-md px-2 py-2 transition
                        ${selected === link.label
                          ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                          : "hover:bg-gray-100"
                        }`}
                    />
                  </div>

                  {link.dropdown && meetingDropdownOpen === link.label && (
                    <div className="ml-6 mt-1 flex flex-col gap-2 rounded-md border p-2">
                      {link.dropdown.map((sub, i) => (
                        <div
                          key={i}
                          onClick={() => handleSubLinkClick(sub)}
                          className="w-full cursor-pointer"
                        >
                          <SidebarLink
                            link={{ ...sub, to: "#" }} 
                            className="rounded-md px-2 py-1 hover:bg-gray-100"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

       <div className="px-2 pb-4">
  <UserButton 
    showName 
    appearance={{ 
      elements: { 
        userButtonBox: "flex flex-row items-center gap-3",
        userButtonAvatarBox: "order-first", 
        userButtonOuterIdentifier: "order-last text-sm font-semibold text-gray-700"
      } 
    }} 
  />
</div>
        </SidebarBody>
      </Sidebar>

      <main className="relative flex flex-1 flex-col bg-gray-50 p-6">
        <div className="absolute right-4 top-3 text-xl">
          <CurrentDateTime />
        </div>
        <div className="w-full h-full absolute top-1/8">
          <MainLayoutText />
        </div>
      </main>
    </div>
  );
}

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 py-1">
    <div className="h-6 w-6 rounded bg-gray-800" />
    <span className="text-sm font-medium">MeetNeX</span>
  </Link>
);

export const CurrentDateTime = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  return <>{time}, {date}</>;
};