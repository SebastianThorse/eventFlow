import { getEventBySlug } from "@/lib/events";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MinimalistTemplate } from "@/components/templates/minimalist";
import { ElegantTemplate } from "@/components/templates/elegant";
import { BoldTemplate } from "@/components/templates/bold";
import type { TicketType } from "@/lib/event-store";
import type { Json } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { DownloadIcon, ShareIcon } from "lucide-react";
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

  // Convert event data to template props format
  const templateProps = {
    title: event.title,
    ingress: event.ingress,
    body: event.body,
    fromDate: event.from_date ? new Date(event.from_date) : undefined,
    toDate: event.to_date ? new Date(event.to_date) : undefined,
    hasTimeSlot: event.has_time_slot,
    timeSlotStart: event.time_slot_start,
    timeSlotEnd: event.time_slot_end,
    location: event.location,
    coverImageUrl: event.cover_image_url,
    images: event.images || [],
    ticketTypes: Array.isArray(event.ticket_types) 
      ? event.ticket_types
          .filter((ticket): ticket is { [key: string]: Json } => 
            ticket !== null && typeof ticket === 'object'
          )
          .map(ticket => ({
            name: String(ticket.name || ''),
            price: Number(ticket.price || 0),
            description: ticket.description ? String(ticket.description) : undefined,
            quantity: ticket.quantity ? Number(ticket.quantity) : undefined,
          }))
      : [],
    entrance: event.entrance || [],
    parking: event.parking || [],
    camping: event.camping || [],
  };

  // Render the appropriate template based on event.template_id
  const renderTemplate = () => {
    switch (event.template_id) {
      case 'elegant':
        return <ElegantTemplate {...templateProps} />;
      case 'bold':
        return <BoldTemplate {...templateProps} />;
      case 'minimalist':
      default:
        return <MinimalistTemplate {...templateProps} />;
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {renderTemplate()}
        
        {/* Share and Download Section */}
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="mb-4 text-lg font-medium">Share this event</h3>
              <QRCodeComponent url={eventUrl} />
              <div className="mt-4 grid w-full gap-2 sm:grid-cols-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/api/pdf/${event.slug}`} target="_blank">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download PDF
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
