import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../ui/Sidebar";
import {
  IconArrowLeft,
  IconArrowsJoin,
  IconHistory,
  IconHttpDelete,
  IconSettings,
  IconVideoPlus,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/Utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/Dropdown-menu"

export function DashboardSidebar() {
  // Separate links into a top section and a bottom section
  const topLinks = [
    {
      label: "New Meeting",
      icon: (
        <IconVideoPlus className="h-7 w-7 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Join Meeting",
      href: "#",
      icon: (
        <IconArrowsJoin className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "History",
      href: "#",
      icon: (
        <IconHistory className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const bottomLinks = [
    {
      label: "Delete Account",
      href: "#",
      icon: (
        <IconHttpDelete className="h-6 w-6 shrink-0 text-red-500 dark:text-red-400" />
      ),
      isButton: true,
      buttonStyle: "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900",
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      isButton: true,
      buttonStyle: "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600",
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full h-screen flex-col md:flex-row",
        "bg-gray-100 dark:bg-neutral-800"
      )}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {/* Render the top links */}
              {topLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* Render the user's avatar link */}
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            {/* Render the bottom links (Logout and Delete Account) */}
            {bottomLinks.map((link, idx) => (
              <SidebarLink key={idx} link={link} isButton={true} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Divider */}
      <div className="w-px bg-neutral-300 dark:bg-neutral-700"></div>

      {/* Main content placeholder */}
      <div className="flex-1 bg-gray-50 dark:bg-neutral-900">
        {/* Add your main content here */}
      </div>
    </div>
  );
}

// Logo and LogoIcon components remain the same
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-xl whitespace-pre text-black dark:text-white"
      >
        MeetNX
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded bg-black dark:bg-white" />
    </a>
  );
}; 