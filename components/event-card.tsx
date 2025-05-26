"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/events";
import { CalendarIcon, LinkIcon, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isCopying, setIsCopying] = useState(false);
  
  const copyLink = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(`${window.location.origin}/event/${event.id}`);
    toast.success("Event link copied to clipboard");
    setTimeout(() => setIsCopying(false), 2000);
  };
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-40 w-full bg-cover bg-center" 
        style={{ 
          backgroundImage: event.cover_image_url 
            ? `url(${event.cover_image_url})` 
            : 'url(https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' 
        }}
      />
      <CardHeader>
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
          {event.date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
              <span>{format(new Date(event.date), 'PPP')}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {event.description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/edit/${event.id}`}>
            <PencilIcon className="mr-2 h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyLink}
          disabled={isCopying}
        >
          <LinkIcon className="mr-2 h-3.5 w-3.5" />
          {isCopying ? 'Copied!' : 'Copy Link'}
        </Button>
      </CardFooter>
    </Card>
  );
}
