"use client";

import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@clerk/nextjs";

export function SiteHeader() {
  const { isSignedIn } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <ModeToggle />
              <UserNav isSignedIn={!!isSignedIn} />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
