import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProfile, createUserProfile } from "@/lib/user";
import { getUserEvents } from "@/lib/events";
import { EventCard } from "@/components/event-card";
import { CalendarPlus, CreditCard } from "lucide-react";

export default async function ProfilePage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  let userProfile = await getUserProfile(userId);
  
  // If no profile exists, try to create one
  if (!userProfile) {
    userProfile = await createUserProfile(userId);
    if (!userProfile) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Error Loading Profile</h1>
            <p className="mt-2 text-muted-foreground">Unable to load or create your profile. Please try again later.</p>
          </div>
        </div>
      );
    }
  }
  
  const events = await getUserEvents(userId);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="/pricing">
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Credits
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/create">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Event Credits</CardTitle>
          <CardDescription>Your available credits for creating new events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-3xl font-bold">{userProfile.event_credits}</p>
              <p className="text-sm text-muted-foreground">Available credits</p>
            </div>
          </div>
          {userProfile.event_credits === 0 && (
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/pricing">Purchase credits</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div>
        <h2 className="mb-4 text-xl font-semibold">Your Events</h2>
        {events.length === 0 ? (
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
    </div>
  );
}
