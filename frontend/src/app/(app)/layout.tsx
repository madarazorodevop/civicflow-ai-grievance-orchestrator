import React from "react";
import { ResponsiveShell } from "@/components/layout/ResponsiveShell";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ResponsiveShell>{children}</ResponsiveShell>;
}
