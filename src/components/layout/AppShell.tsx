"use client";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Main app shell: fixed sidebar (desktop right/start) + bottom mobile nav.
 * Content area has padding-start to clear the sidebar.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-sukuk-gradient relative">
      <Sidebar />
      <MobileNav />
      {/* Content: offset by sidebar width on desktop, bottom nav on mobile */}
      <main className="lg:ps-60 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
