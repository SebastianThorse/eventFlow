import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 md:gap-10 md:py-24">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold md:text-6xl">404</h1>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Page not found
            </h2>
            <p className="mx-auto max-w-[400px] text-muted-foreground md:text-lg">
              We couldn't find the page you were looking for. It might have been moved or deleted.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <Link href="/">Return to home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}