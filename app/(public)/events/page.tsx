import { auth } from "@clerk/nextjs";
import { getUserEvents } from "@/lib/events";
import type { Event } from "@/lib/events";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
  const { userId } = auth();
  
  let events: Event[] = [];
  if (userId) {
    events = await getUserEvents(userId);
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          </div>
          
          {!userId ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="mb-2 text-lg font-medium">Sign in to view your events</h3>
              <p className="mb-4 text-muted-foreground">
                Create and manage your events by signing in to your account
              </p>
              <Button asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="mb-2 text-lg font-medium">No events yet</h3>
              <p className="mb-4 text-muted-foreground">
                Create your first event to get started
              </p>
              <Button asChild>
                <Link href="/create">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Create your first event
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
} 
