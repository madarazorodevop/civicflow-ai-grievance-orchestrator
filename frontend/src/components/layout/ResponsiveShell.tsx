"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, FileText, Map as MapIcon, Bell, User, X, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Map", href: "/map", icon: MapIcon },
  { name: "Orchestrator", href: "/ai", icon: Cpu },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 flex-col lg:flex-row overflow-hidden">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="text-xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
          <img src="/logo.jpg" alt="CivicFlow" className="w-8 h-8 rounded-full" />
          CIVICFLOW
        </div>
        <button
          className="p-2 -mr-2 text-gray-500 hover:text-gray-700"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer (Secondary Actions) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-sm bg-white h-full p-4 shadow-xl">
            <button
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-xl font-bold text-blue-600 mb-8 mt-2 flex items-center gap-2">
              <img src="/logo.jpg" alt="CivicFlow" className="w-8 h-8 rounded-full" />
              CIVICFLOW
            </div>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 z-10">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
            <img src="/logo.jpg" alt="CivicFlow" className="w-8 h-8 rounded-full" />
            CIVICFLOW
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* Desktop Profile / Settings bottom area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              OP
            </div>
            <span>Operator</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 lg:pb-0 relative">
        <div className="mx-auto max-w-7xl h-full p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Primary Actions) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 pb-safe z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-blue-50")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
