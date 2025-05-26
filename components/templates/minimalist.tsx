import { format } from "date-fns";
import { CalendarDays, MapPin, Ticket, Clock, Car } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateProps } from "./types";

export function MinimalistTemplate({
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
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full bg-muted">
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-12 p-8">
        {/* Event Details */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg text-foreground">
              {fromDate && format(new Date(fromDate), "MMMM d, yyyy")}
              {hasTimeSlot && (
                <>
                  {timeSlotStart && ` ${timeSlotStart}`}
                  {timeSlotEnd && ` - ${timeSlotEnd}`}
                </>
              )}
            </span>
          </div>
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-foreground">{location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {(ingress || body) && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {ingress && <p>{ingress}</p>}
            {body && <p>{body}</p>}
          </div>
        )}

        {/* Ticket Types */}
        {ticketTypes && ticketTypes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Tickets</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {ticketTypes.map((ticket, index) => (
                <Card key={index} className="p-6 bg-card">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        {ticket.name}
                      </h3>
                      <Badge variant="secondary">${ticket.price}</Badge>
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
            <h2 className="text-2xl font-semibold text-foreground">
              Venue Details
            </h2>
            <Card className="p-6 bg-card">
              <div className="grid gap-6 md:grid-cols-2">
                {entrance?.length > 0 && (
                  <div>
                    <h3 className="mb-4 font-medium text-foreground">
                      Check-in Information
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      {hasTimeSlot && timeSlotStart && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Check-in opens at {timeSlotStart}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <div>
                          {entrance.map((info, index) => (
                            <div key={index}>{info}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {parking?.length > 0 && (
                  <div>
                    <h3 className="mb-4 font-medium text-foreground">Parking</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {parking.map((info, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Car className="h-4 w-4" />
                          <span>{info}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {camping?.length > 0 && (
                  <div>
                    <h3 className="mb-4 font-medium text-foreground">Camping</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {camping.map((info, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Ticket className="h-4 w-4" />
                          <span>{info}</span>
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
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
