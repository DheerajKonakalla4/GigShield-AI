"use client";

import { usePathname } from "next/navigation";
import NavigationBar from "@/components/NavigationBar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show navbar on protected pages
  const showNavbar = [
    "/dashboard",
    "/users",
    "/claims",
    "/settings",
    "/admin",
    "/design-system",
  ].some((path) => pathname.startsWith(path));

  return (
    <>
      {showNavbar && <NavigationBar />}
      {children}
    </>
  );
}
