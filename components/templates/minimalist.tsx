import { format } from "date-fns";
import { CalendarDays, MapPin, Ticket, Clock } from "lucide-react";
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
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          {coverImageUrl && (
            <div className="mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
              <img
                src={coverImageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            {fromDate && (
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <CalendarDays className="h-5 w-5" />
                {format(new Date(fromDate), "MMMM d, yyyy")}
                {hasTimeSlot && (
                  <>
                    {timeSlotStart && (
                      <span className="ml-2 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {timeSlotStart}
                        {timeSlotEnd && ` - ${timeSlotEnd}`}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <MapPin className="h-5 w-5" />
                {location}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {(ingress || body) && (
          <div className="mb-12 text-center">
            {ingress && (
              <p className="mb-6 text-xl text-muted-foreground">{ingress}</p>
            )}
            {body && (
              <div className="prose mx-auto max-w-none dark:prose-invert">
                {body.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ticket Types */}
        {ticketTypes && ticketTypes.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-center text-2xl font-semibold">
              <div className="mb-2 flex justify-center">
                <Ticket className="h-6 w-6" />
              </div>
              Tickets
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ticketTypes.map((ticket, index) => (
                <Card key={index} className="p-6">
                  <div className="text-center">
                    <h3 className="mb-2 font-medium">{ticket.name}</h3>
                    <p className="mb-4 text-2xl font-semibold">
                      ${ticket.price.toFixed(2)}
                    </p>
                    {ticket.description && (
                      <p className="mb-2 text-sm text-muted-foreground">
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

        {/* Additional Information */}
        {(entrance?.length > 0 || parking?.length > 0 || camping?.length > 0) && (
          <div className="text-center">
            <h2 className="mb-8 text-2xl font-semibold">Event Information</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {entrance?.length > 0 && (
                <div>
                  <h3 className="mb-4 font-semibold">Entrance Information</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {entrance.map((info, index) => (
                      <Badge key={index} variant="secondary">
                        {info}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {parking?.length > 0 && (
                <div>
                  <h3 className="mb-4 font-semibold">Parking Information</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {parking.map((info, index) => (
                      <Badge key={index} variant="secondary">
                        {info}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {camping?.length > 0 && (
                <div>
                  <h3 className="mb-4 font-semibold">Camping Information</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {camping.map((info, index) => (
                      <Badge key={index} variant="secondary">
                        {info}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {images && images.length > 0 && (
          <div className="mt-12 text-center">
            <h2 className="mb-8 text-2xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={url}
                    alt={`Event image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
