import { format } from "date-fns";
import { CalendarDays, MapPin, Ticket, Clock, Car } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateProps } from "./types";

export function BoldTemplate({
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen bg-black">
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={title}
            className="absolute h-full w-full object-cover opacity-50"
          />
        )}
        <div className="absolute h-full w-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-90 dark:opacity-70" />
        <div className="relative z-10 flex h-full items-center justify-center p-8">
          <div className="max-w-4xl text-center">
            <h1 className="mb-8 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              {title}
            </h1>
            <div className="flex flex-col items-center gap-6">
              {fromDate && (
                <div className="flex items-center gap-2 text-xl font-medium text-white">
                  <CalendarDays className="h-6 w-6" />
                  {format(new Date(fromDate), "MMMM d, yyyy")}
                  {hasTimeSlot && (
                    <>
                      {timeSlotStart && ` ${timeSlotStart}`}
                      {timeSlotEnd && ` - ${timeSlotEnd}`}
                    </>
                  )}
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-xl font-medium text-white">
                  <MapPin className="h-6 w-6" />
                  {location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-6xl space-y-16 px-8 py-16">
        {/* Description */}
        {(ingress || body) && (
          <div className="mx-auto max-w-3xl text-center">
            {ingress && (
              <p className="text-xl font-medium leading-relaxed">{ingress}</p>
            )}
            {body && (
              <div className="mt-6 text-lg text-muted-foreground">{body}</div>
            )}
          </div>
        )}

        {/* Ticket Types */}
        {ticketTypes && ticketTypes.length > 0 && (
          <div>
            <h2 className="mb-8 text-center text-4xl font-black uppercase">
              Tickets
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {ticketTypes.map((ticket, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1">
                    <div className="bg-card p-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-xl font-bold uppercase text-foreground">
                            {ticket.name}
                          </h3>
                          <div className="mt-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            ${ticket.price}
                          </div>
                        </div>
                        {ticket.description && (
                          <p className="text-center text-sm text-muted-foreground">
                            {ticket.description}
                          </p>
                        )}
                        {ticket.quantity && (
                          <p className="text-center text-sm text-muted-foreground">
                            {ticket.quantity} tickets available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Venue Information */}
        {(entrance?.length > 0 || parking?.length > 0 || camping?.length > 0) && (
          <div>
            <h2 className="mb-8 text-center text-4xl font-black uppercase">
              Event Details
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {entrance?.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4 text-center text-xl font-bold uppercase">
                    Check-in Info
                  </h3>
                  <div className="space-y-4">
                    {hasTimeSlot && timeSlotStart && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <span>Check-in opens at {timeSlotStart}</span>
                      </div>
                    )}
                    {entrance.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {parking?.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4 text-center text-xl font-bold uppercase">
                    Parking
                  </h3>
                  <div className="space-y-4">
                    {parking.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-purple-600" />
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {camping?.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4 text-center text-xl font-bold uppercase">
                    Camping
                  </h3>
                  <div className="space-y-4">
                    {camping.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-purple-600" />
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Additional Images */}
        {images && images.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={image}
                  alt={`Event image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform hover:scale-110 duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
