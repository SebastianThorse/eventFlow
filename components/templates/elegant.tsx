import { format } from "date-fns";
import { CalendarDays, MapPin, Ticket, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="font-serif text-3xl italic tracking-tight text-[#2c1810] md:text-5xl">
            {title}
          </h1>
        </header>

        {/* Cover Image */}
        {coverImageUrl && (
          <div className="mb-12">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
              <img
                src={coverImageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Event Details */}
        <div className="mb-12 flex flex-col items-center gap-6 border-y border-[#e6e0d6] py-8 text-center">
          <div className="flex items-center gap-2 text-lg font-light tracking-wide text-[#2c1810]">
            <CalendarDays className="h-5 w-5 text-[#8b7355]" />
            {fromDate && format(new Date(fromDate), "MMMM d, yyyy")}
            {hasTimeSlot && (
              <>
                {timeSlotStart && (
                  <span className="ml-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#8b7355]" />
                    {timeSlotStart}
                    {timeSlotEnd && ` - ${timeSlotEnd}`}
                  </span>
                )}
              </>
            )}
          </div>
          {location && (
            <div className="flex items-center gap-2 text-lg font-light tracking-wide text-[#2c1810]">
              <MapPin className="h-5 w-5 text-[#8b7355]" />
              {location}
            </div>
          )}
        </div>

        {/* Description */}
        {(ingress || body) && (
          <div className="mb-12 text-center">
            {ingress && (
              <p className="font-light italic leading-relaxed tracking-wide text-[#2c1810]">
                {ingress}
              </p>
            )}
            {body && (
              <div className="mt-6 font-light leading-relaxed tracking-wide text-[#2c1810]/80">
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
            <h2 className="mb-8 text-center text-2xl font-serif italic text-[#2c1810]">
              Tickets
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {ticketTypes.map((ticket, index) => (
                <Card key={index} className="border-[#e6e0d6] bg-white p-6">
                  <div className="space-y-4 text-center">
                    <div>
                      <h3 className="font-serif text-xl text-[#2c1810]">
                        {ticket.name}
                      </h3>
                      <div className="mt-2 text-2xl font-light text-[#2c1810]">
                        ${ticket.price.toFixed(2)}
                      </div>
                    </div>
                    {ticket.description && (
                      <p className="text-sm text-[#8b7355]">
                        {ticket.description}
                      </p>
                    )}
                    {ticket.quantity && (
                      <p className="text-sm text-[#8b7355]">
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
          <div className="mb-12">
            <h2 className="mb-8 text-center text-2xl font-serif italic text-[#2c1810]">
              Event Details
            </h2>
            <Card className="border-[#e6e0d6] bg-white p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {entrance?.length > 0 && (
                  <div className="text-center">
                    <h3 className="font-serif text-xl text-[#2c1810]">
                      Check-in Information
                    </h3>
                    <div className="mt-4 space-y-3 text-sm text-[#8b7355]">
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
                    <h3 className="font-serif text-xl text-[#2c1810]">
                      Parking Information
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-[#8b7355]">
                      {parking.map((info, index) => (
                        <div key={index}>{info}</div>
                      ))}
                    </div>
                  </div>
                )}

                {camping?.length > 0 && (
                  <div className="text-center">
                    <h3 className="font-serif text-xl text-[#2c1810]">
                      Camping Information
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-[#8b7355]">
                      {camping.map((info, index) => (
                        <div key={index}>{info}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Image Gallery */}
        {images && images.length > 0 && (
          <div>
            <h2 className="mb-8 text-center text-2xl font-serif italic text-[#2c1810]">
              Gallery
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg border border-[#e6e0d6]"
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
