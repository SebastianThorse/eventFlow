"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarHeart } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  
  return (
    <div className="mr-4 flex items-center">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <CalendarHeart className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block">
          Eventify
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/events"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/events" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Events
        </Link>
        <Link
          href="/pricing"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/pricing" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Pricing
        </Link>
        <Link
          href="/templates"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/templates") ? "text-foreground" : "text-foreground/60"
          )}
        >
          Templates
        </Link>
        <Link
          href="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/about") ? "text-foreground" : "text-foreground/60"
          )}
        >
          About
        </Link>
      </nav>
    </div>
  );
}
