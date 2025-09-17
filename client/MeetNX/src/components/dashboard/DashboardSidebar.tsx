import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../reuseable Components/ui/Sidebar";
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
} from "../../reuseable Components/ui/Dropdown-menu";

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const topLinks = [
    {
      label: "New Meeting",
      href: "#",
      icon: <IconVideoPlus className="h-7 w-7 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      hasDropdown: true,
    },
    {
      label: "Join Meeting",
      href: "#",
      icon: <IconArrowsJoin className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "History",
      href: "#",
      icon: <IconHistory className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  const bottomLinks = [
    {
      label: "Delete Account",
      href: "#",
      icon: <IconHttpDelete className="h-6 w-6 shrink-0 text-red-500 dark:text-red-400" />,
      isButton: true,
      buttonStyle:
        "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900",
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      isButton: true,
      buttonStyle:
        "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600",
    },
  ];

  const shouldSidebarBeOpen = open || dropdownOpen;

  const renderLinkWithDropdown = (link, idx) => {
    if (link.hasDropdown && link.label === "New Meeting") {
      return (
        <DropdownMenu key={idx} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200 p-1 -m-1">
              <SidebarLink link={link} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 z-[99999] bg-black dark:bg-black border-gray-700 dark:border-gray-600"
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions
          >
            <DropdownMenuLabel className="text-white">Meeting Options</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
              <IconVideoPlus className="mr-2 h-4 w-4 text-white" />
              <span>Start Instant Meeting</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
              <IconVideoPlus className="mr-2 h-4 w-4 text-white" />
              <span>Schedule Meeting</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
              <IconVideoPlus className="mr-2 h-4 w-4 text-white" />
              <span>Start with Video Off</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div key={idx} className="rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200 p-1 -m-1">
        <SidebarLink link={link} />
      </div>
    );
  };

  return (
    <div className={cn("flex w-full h-screen flex-col md:flex-row", "bg-gray-900 dark:bg-neutral-900")}>
      <Sidebar open={shouldSidebarBeOpen} setOpen={setOpen} className="relative z-50">
        <SidebarBody className="justify-between gap-10 relative z-60">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {shouldSidebarBeOpen ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {topLinks.map((link, idx) => renderLinkWithDropdown(link, idx))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-2">
            {/* Avatar Link */}
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

            {/* Logout & Delete Account */}
            {bottomLinks.map((link, idx) => (
              <div
                key={idx}
                className="rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200 p-1 -m-1"
              >
                <SidebarLink link={link} isButton />
              </div>
            ))}
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="w-px bg-neutral-300 dark:bg-neutral-700"></div>

      <div className="flex-1 bg-gray-50 dark:bg-neutral-900">{/* Main Content */}</div>
    </div>
  );
}

export const Logo = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
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

export const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded bg-black dark:bg-white" />
  </a>
);
