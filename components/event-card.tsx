"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/events";
import { CalendarIcon, LinkIcon, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isCopying, setIsCopying] = useState(false);
  
  const copyLink = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(`${window.location.origin}/event/${event.slug}`);
    toast.success("Event link copied to clipboard");
    setTimeout(() => setIsCopying(false), 2000);
  };

  // Template-specific styles
  const cardStyles = {
    minimalist: "bg-white hover:bg-gray-50/50",
    elegant: "bg-[#f8f5f0] hover:bg-[#f5f2ed]",
    bold: "bg-gradient-to-br from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20",
  };

  const titleStyles = {
    minimalist: "text-lg font-semibold",
    elegant: "text-lg font-serif italic",
    bold: "text-lg font-black uppercase tracking-tight",
  };

  const imageStyles = {
    minimalist: "h-40 transition-transform duration-300 group-hover:scale-105",
    elegant: "h-40 rounded-t-lg transition-transform duration-300 group-hover:scale-105",
    bold: "h-40 brightness-90 transition-transform duration-300 group-hover:scale-105",
  };
  
  return (
    <Card className={cn(
      "overflow-hidden group",
      cardStyles[event.template_id as keyof typeof cardStyles] || cardStyles.minimalist
    )}>
      <Link href={`/event/${event.slug}`} className="cursor-pointer">
        <div 
          className={cn(
            "w-full bg-cover bg-center", 
            imageStyles[event.template_id as keyof typeof imageStyles] || imageStyles.minimalist
          )}
          style={{ 
            backgroundImage: event.cover_image_url 
              ? `url(${event.cover_image_url})` 
              : 'url(https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' 
          }}
        />
        <CardHeader>
          <div className="flex flex-col space-y-1.5">
            <h3 className={cn(
              "line-clamp-1",
              titleStyles[event.template_id as keyof typeof titleStyles] || titleStyles.minimalist
            )}>
              {event.title}
            </h3>
            {event.from_date && (
              <div className={cn(
                "flex items-center text-sm",
                event.template_id === "elegant" ? "text-muted-foreground/80" : "text-muted-foreground"
              )}>
                <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                <span>{format(new Date(event.from_date), 'PPP')}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className={cn(
            "line-clamp-2 text-sm",
            event.template_id === "elegant" ? "text-muted-foreground/80" : "text-muted-foreground"
          )}>
            {event.ingress || event.body || "No description provided"}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button 
          variant={event.template_id === "bold" ? "secondary" : "outline"} 
          size="sm" 
          asChild
        >
          <Link href={`/edit/${event.id}`}>
            <PencilIcon className="mr-2 h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
        <Button 
          variant={event.template_id === "bold" ? "secondary" : "outline"}
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
