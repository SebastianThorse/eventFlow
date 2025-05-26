import { CalendarHeart } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 flex-col items-center justify-between gap-4 py-6 sm:flex-row sm:py-0">
          <div className="flex items-center gap-2">
            <CalendarHeart className="h-5 w-5" />
            <p className="text-center text-sm leading-loose sm:text-left">
              © 2025 Eventify. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link 
              href="/terms" 
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
