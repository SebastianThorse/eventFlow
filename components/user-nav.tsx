"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarDays } from "lucide-react";

interface UserNavProps {
  isSignedIn: boolean;
}

export function UserNav({ isSignedIn }: UserNavProps) {
  const router = useRouter();
  
  return (
    <div className="flex items-center space-x-4">
      {isSignedIn ? (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/events")}
            className="hidden sm:flex"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            View Events
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/create")}
            className="hidden sm:flex"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/sign-in")}
          >
            Sign in
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => router.push("/sign-up")}
          >
            Sign up
          </Button>
        </>
      )}
    </div>
  );
}
