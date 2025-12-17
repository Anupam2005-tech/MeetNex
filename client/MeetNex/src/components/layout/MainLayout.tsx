import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import {
  IconVideo,
  IconTrash,
  IconSettings,
  IconArrowLeft,
  IconPlus,
  IconClock,
  IconMessage2Bolt,
} from "@tabler/icons-react";
import { Modal } from "../ui/Modal";
import MainLayoutText from "./MainLayoutText";
import { Link } from "react-router-dom";

/* ================= MAIN LAYOUT ================= */
export function MainLayout() {
  const [open, setOpen] = useState(false);
  const [meetingDropdownOpen, setMeetingDropdownOpen] = useState<string | null>(null);
  const [selected, setSelected] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
    {
      label: "Settings",
      icon: <IconSettings className="h-5 w-5" />,
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
                <div key={idx} className="flex flex-col">

                  {/* MAIN LINK */}
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
                        className={`rounded-md px-2 py-2 transition-all duration-200
                          flex items-center gap-3
                          ${
                            selected === link.label
                              ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                      />
                    ) : (
                      <Link to={link.to}>
                        <SidebarLink
                          link={link}
                          className={`rounded-md px-2 py-2 transition-all duration-200
                            flex items-center gap-3
                            ${
                              selected === link.label
                                ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                        />
                      </Link>
                    )}
                  </div>

                  {/* DROPDOWN */}
                  {link.dropdown && meetingDropdownOpen === link.label && (
                    <div className="ml-6 mt-1 flex flex-col gap-2 border border-gray-200 rounded-md p-2">
                      {link.dropdown.map((subLink, subIdx) => (
                        <div
                          key={subIdx}
                          onClick={() => setSelected(subLink.label)}
                          className="cursor-pointer"
                        >
                          <Link to={subLink.to}>
                            <SidebarLink
                              link={subLink}
                              className={`rounded-md px-2 py-1 transition-all duration-200
                                flex items-center gap-2
                                ${
                                  selected === subLink.label
                                    ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= BOTTOM ================= */}
          <div className="px-2 pb-4 flex flex-col gap-2">

            {/* PROFILE */}
            <Link to="/profile">
              <SidebarLink
                link={{
                  label: "John Doe",
                  icon: (
                    <img
                      src="https://i.pravatar.cc/150?img=12"
                      className="h-8 w-8 rounded-full"
                      alt="Avatar"
                    />
                  ),
                }}
                className="rounded-md px-2 py-2 hover:bg-gray-100"
              />
            </Link>

            {/* DELETE ACCOUNT */}
            <div
              onClick={() => setDeleteModalOpen(true)}
              className="cursor-pointer"
            >
              <SidebarLink
                link={{
                  label: "Delete Account",
                  icon: <IconTrash className="h-5 w-5" />,
                }}
                className="rounded-md px-2 py-2 hover:bg-gray-100 text-red-600"
              />
            </div>

            {/* LOGOUT */}
            <Link to="/login">
              <SidebarLink
                link={{
                  label: "Logout",
                  icon: <IconArrowLeft className="h-5 w-5" />,
                }}
                className="rounded-md px-2 py-2 hover:bg-gray-100"
              />
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative flex flex-1 flex-col bg-gray-50 p-3 sm:p-4 md:p-6">
        <div className="absolute right-3 top-2 text-xl">
          <CurrentDateTime />
        </div>

        <div className="flex flex-1 items-end justify-cente sm:pb-2">
          <MainLayoutText />
        </div>
      </main>

      {/* ================= DELETE MODAL ================= */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-6 flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold text-red-600">
            Delete Account?
          </h2>
          <p className="text-gray-700 text-center text-sm">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="flex gap-4 mt-4">
            <button
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                alert("Account deleted!");
                setDeleteModalOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ================= LOGO ================= */
export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 py-1">
    <div className="h-6 w-6 rounded-md bg-gray-800" />
    <span className="text-sm font-medium text-gray-800">MeetNeX</span>
  </Link>
);

/* ================= DATE TIME ================= */
export const CurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString());
      setCurrentDate(
        date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 text-gray-500">
      <span>{currentTime},</span>
      <span>{currentDate}</span>
    </div>
  );
};
