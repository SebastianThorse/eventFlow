'use client';

import { format } from 'date-fns';
import { MapPin, Calendar } from 'lucide-react';
import { useEventStore } from '@/lib/stores/event-store';

export function EventPreview() {
  const { event } = useEventStore();
  
  if (!event) {
    return null;
  }
  
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="min-h-[100vh] bg-background">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          {event.coverImageUrl ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${event.coverImageUrl})` }}
            />
          ) : (
            <div className="h-full w-full bg-primary/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold md:text-6xl">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-4xl space-y-8 p-8">
          {/* Date & Location */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            {event.date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg">{format(event.date, 'PPP')}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg">{event.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="prose prose-lg max-w-none">
              <p>{event.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
