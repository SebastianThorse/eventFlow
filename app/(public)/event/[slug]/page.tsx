import { getEventBySlug } from "@/lib/events";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CalendarIcon, ClockIcon, DownloadIcon, MapPinIcon, ShareIcon, TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { QRCodeComponent } from "@/components/qr-code";
import { notFound } from "next/navigation";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug);
  
  if (!event) {
    notFound();
  }
  
  const eventUrl = `${process.env.NEXT_PUBLIC_APP_URL}/event/${event.slug}`;

  const formatDateRange = () => {
    if (!event.from_date) return null;
    if (!event.to_date || event.from_date === event.to_date) {
      return format(new Date(event.from_date), 'EEEE, MMMM d, yyyy');
    }
    return `${format(new Date(event.from_date), 'MMMM d')} - ${format(new Date(event.to_date), 'MMMM d, yyyy')}`;
  };

  const formatTimeRange = () => {
    if (!event.has_time_slot || !event.time_slot_start || !event.time_slot_end) return null;
    return `${event.time_slot_start} - ${event.time_slot_end}`;
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Cover image */}
        <div 
          className="relative h-64 w-full bg-cover bg-center md:h-96" 
          style={{ 
            backgroundImage: event.cover_image_url 
              ? `url(${event.cover_image_url})` 
              : 'url(https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-col gap-2 text-white/80 sm:flex-row sm:gap-6">
              {event.from_date && (
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{formatDateRange()}</span>
                </div>
              )}
              {event.has_time_slot && event.time_slot_start && event.time_slot_end && (
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <span>{formatTimeRange()}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div>
                {event.ingress && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold">About this event</h2>
                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                      {event.ingress}
                    </p>
                  </div>
                )}
                {event.body && (
                  <div className="prose max-w-none text-muted-foreground">
                    {event.body.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Ticket Types */}
              {event.ticket_types && event.ticket_types.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center text-2xl font-semibold">
                    <TicketIcon className="mr-2 h-6 w-6" />
                    Tickets
                  </h2>
                  <div className="grid gap-4">
                    {event.ticket_types.map((ticket, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{ticket.name}</h3>
                            {ticket.description && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {ticket.description}
                              </p>
                            )}
                            {ticket.quantity && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {ticket.quantity} tickets available
                              </p>
                            )}
                          </div>
                          <div className="text-lg font-semibold">
                            ${ticket.price.toFixed(2)}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(event.entrance?.length > 0 || event.parking?.length > 0 || event.camping?.length > 0) && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">Additional Information</h2>
                  <div className="space-y-6">
                    {event.entrance && event.entrance.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Entrance Options</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.entrance.map((option, index) => (
                            <Badge key={index} variant="secondary">{option}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.parking && event.parking.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Parking Information</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.parking.map((option, index) => (
                            <Badge key={index} variant="secondary">{option}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.camping && event.camping.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Camping Options</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.camping.map((option, index) => (
                            <Badge key={index} variant="secondary">{option}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {event.images && event.images.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {event.images.map((url, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-lg"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
            
            <div>
              {/* QR Code and sharing */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-medium">Share this event</h3>
                <div className="flex flex-col items-center">
                  <QRCodeComponent url={eventUrl} />
                  <div className="mt-4 grid w-full gap-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/api/pdf/${event.slug}`} target="_blank">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download PDF
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <ShareIcon className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
