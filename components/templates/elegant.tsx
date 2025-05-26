import { format } from "date-fns";
import { CalendarDays, MapPin, Ticket, Clock, Car } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateProps } from "./types";

export function ElegantTemplate({
  title,
  ingress,
  body,
  fromDate,
  toDate,
  hasTimeSlot,
  timeSlotStart,
  timeSlotEnd,
  location,
  coverImageUrl,
  images,
  ticketTypes,
  entrance,
  parking,
  camping,
}: TemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 p-6 backdrop-blur">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-3xl italic tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
        </div>
      </header>

      {/* Cover Image */}
      {coverImageUrl && (
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <div className="aspect-[21/9] w-full overflow-hidden rounded-lg">
            <img
              src={coverImageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-12 p-8">
        {/* Event Details */}
        <div className="flex flex-col items-center gap-6 border-y border-border py-8 text-center">
          <div className="flex items-center gap-2 text-lg font-light tracking-wide text-foreground">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            {fromDate && format(new Date(fromDate), "MMMM d, yyyy")}
            {hasTimeSlot && (
              <>
                {timeSlotStart && ` ${timeSlotStart}`}
                {timeSlotEnd && ` - ${timeSlotEnd}`}
              </>
            )}
          </div>
          {location && (
            <div className="flex items-center gap-2 text-lg font-light tracking-wide text-foreground">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              {location}
            </div>
          )}
        </div>

        {/* Description */}
        {(ingress || body) && (
          <div className="prose prose-lg dark:prose-invert mx-auto max-w-2xl text-center">
            {ingress && (
              <p className="font-light leading-relaxed tracking-wide">{ingress}</p>
            )}
            {body && (
              <p className="font-light leading-relaxed tracking-wide">{body}</p>
            )}
          </div>
        )}

        {/* Ticket Types */}
        {ticketTypes && ticketTypes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-foreground">
              Tickets
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {ticketTypes.map((ticket, index) => (
                <Card key={index} className="p-6 bg-card">
                  <div className="space-y-4 text-center">
                    <div>
                      <h3 className="font-serif text-xl text-foreground">
                        {ticket.name}
                      </h3>
                      <div className="mt-2 text-2xl font-light">
                        ${ticket.price}
                      </div>
                    </div>
                    {ticket.description && (
                      <p className="text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                    )}
                    {ticket.quantity && (
                      <p className="text-sm text-muted-foreground">
                        {ticket.quantity} tickets available
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Venue Information */}
        {(entrance?.length > 0 || parking?.length > 0 || camping?.length > 0) && (
          <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-foreground">
              Event Details
            </h2>
            <Card className="p-6 bg-card">
              <div className="grid gap-8 md:grid-cols-2">
                {entrance?.length > 0 && (
                  <div className="text-center">
                    <h3 className="font-serif text-xl text-foreground">
                      Check-in Information
                    </h3>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      {hasTimeSlot && timeSlotStart && (
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Check-in opens at {timeSlotStart}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        {entrance.map((info, index) => (
                          <div key={index} className="flex items-center justify-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {info}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {parking?.length > 0 && (
                  <div className="text-center">
                    <h3 className="font-serif text-xl text-foreground">
                      Parking
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {parking.map((info, index) => (
                        <div key={index} className="flex items-center justify-center gap-2">
                          <Car className="h-4 w-4" />
                          {info}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {camping?.length > 0 && (
                  <div className="text-center md:col-span-2">
                    <h3 className="font-serif text-xl text-foreground">
                      Camping
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {camping.map((info, index) => (
                        <div key={index} className="flex items-center justify-center gap-2">
                          <Ticket className="h-4 w-4" />
                          {info}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Additional Images */}
        {images && images.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((image, index) => (
              <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Event image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
