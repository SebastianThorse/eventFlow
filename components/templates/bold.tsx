import { format } from "date-fns";
import { CalendarDays, MapPin, Ticket, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 overflow-hidden rounded-lg bg-white dark:bg-black">
          <div className="relative aspect-[16/9]">
            {coverImageUrl && (
              <img
                src={coverImageUrl}
                alt={title}
                className="absolute h-full w-full object-cover opacity-80 dark:opacity-50"
              />
            )}
            <div className="absolute h-full w-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <h1 className="mb-6 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                  {title}
                </h1>
                <div className="flex flex-col items-center gap-4">
                  {fromDate && (
                    <div className="flex items-center gap-2 text-lg font-medium text-white">
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
                    <div className="flex items-center gap-2 text-lg font-medium text-white">
                      <MapPin className="h-5 w-5" />
                      {location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {(ingress || body) && (
          <div className="mb-12 text-center">
            {ingress && (
              <p className="text-xl font-medium leading-relaxed text-gray-900 dark:text-white">
                {ingress}
              </p>
            )}
            {body && (
              <div className="mt-6 space-y-4 text-lg text-gray-700 dark:text-white/80">
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
            <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              Get Your Tickets
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {ticketTypes.map((ticket, index) => (
                <Card
                  key={index}
                  className="overflow-hidden bg-gray-50/80 backdrop-blur dark:bg-white/10"
                >
                  <div className="p-6 text-center">
                    <h3 className="mb-2 text-xl font-bold uppercase text-gray-900 dark:text-white">
                      {ticket.name}
                    </h3>
                    <div className="mb-4 text-3xl font-black text-purple-600 dark:text-purple-400">
                      ${ticket.price.toFixed(2)}
                    </div>
                    {ticket.description && (
                      <p className="mb-2 text-sm text-gray-600 dark:text-white/60">
                        {ticket.description}
                      </p>
                    )}
                    {ticket.quantity && (
                      <p className="text-sm text-gray-600 dark:text-white/60">
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
            <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              Event Information
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {entrance?.length > 0 && (
                <Card className="overflow-hidden bg-gray-50/80 backdrop-blur dark:bg-white/10">
                  <div className="p-6 text-center">
                    <h3 className="mb-4 text-xl font-bold uppercase text-gray-900 dark:text-white">
                      Entrance
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {entrance.map((info, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-200"
                        >
                          {info}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {parking?.length > 0 && (
                <Card className="overflow-hidden bg-gray-50/80 backdrop-blur dark:bg-white/10">
                  <div className="p-6 text-center">
                    <h3 className="mb-4 text-xl font-bold uppercase text-gray-900 dark:text-white">
                      Parking
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {parking.map((info, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-200"
                        >
                          {info}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {camping?.length > 0 && (
                <Card className="overflow-hidden bg-gray-50/80 backdrop-blur dark:bg-white/10">
                  <div className="p-6 text-center">
                    <h3 className="mb-4 text-xl font-bold uppercase text-gray-900 dark:text-white">
                      Camping
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {camping.map((info, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-200"
                        >
                          {info}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {images && images.length > 0 && (
          <div>
            <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              Gallery
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="group aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={url}
                    alt={`Event image ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
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
