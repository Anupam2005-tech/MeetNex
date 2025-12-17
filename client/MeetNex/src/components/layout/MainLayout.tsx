import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import {
  IconVideo,
  IconPlus,
  IconClock,
  IconMessage2Bolt,
} from "@tabler/icons-react";
import MainLayoutText from "./MainLayoutText";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

/* ================= MAIN LAYOUT ================= */
export function MainLayout() {
  const [open, setOpen] = useState(false);
  const [meetingDropdownOpen, setMeetingDropdownOpen] =
    useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

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
      label: "Chat",
      to: "/chat",
      icon: <IconMessage2Bolt className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-6">
          {/* TOP */}
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
                          meetingDropdownOpen === link.label
                            ? null
                            : link.label
                        );
                      }
                      setSelected(link.label);
                    }}
                  >
                    {link.dropdown ? (
                      <SidebarLink
                        link={link}
                        className={`rounded-md px-2 py-2 transition
                          ${selected === link.label
                            ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                            : "hover:bg-gray-100"
                          }`}
                      />
                    ) : (
                      <Link to={link.to}>
                        <SidebarLink
                          link={link}
                          className={`rounded-md px-2 py-2 transition
                            ${selected === link.label
                              ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                              : "hover:bg-gray-100"
                            }`}
                        />
                      </Link>
                    )}
                  </div>

                  {/* DROPDOWN */}
                  {link.dropdown && meetingDropdownOpen === link.label && (
                    <div className="ml-6 mt-1 flex flex-col gap-2 rounded-md border p-2">
                      {link.dropdown.map((sub, i) => (
                        <Link key={i} to={sub.to}>
                          <SidebarLink
                            link={sub}
                            className="rounded-md px-2 py-1 hover:bg-gray-100"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-2 pb-4">
            <div className="flex items-center gap-2 px-2  rounded-md hover:bg-gray-100">
              <UserButton
                showName
                appearance={{
                  elements: {
                    userButtonBox: "flex items-center gap-2",
                    userButtonAvatarBox: "order-1 h-8 w-8",
                    userButtonOuterIdentifier: "order-2 text-sm text-gray-700",
                  },
                }}
              />

            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative flex flex-1 flex-col bg-gray-50 p-6">
        <div className="absolute right-4 top-3">
          <CurrentDateTime />
        </div>
        <MainLayoutText />
      </main>
    </div>
  );
}

/* ================= LOGO ================= */
export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 py-1">
    <div className="h-6 w-6 rounded bg-gray-800" />
    <span className="text-sm font-medium">MeetNeX</span>
  </Link>
);

/* ================= DATE TIME ================= */
export const CurrentDateTime = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div className="text-xl text-gray-500">{time}</div>;
};
