import { NextResponse } from "next/server";
import { getEventBySlug } from "@/lib/events";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

interface TicketType {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
}

interface EventData {
  slug: string;
  title: string;
  ingress?: string;
  body?: string;
  from_date?: string;
  to_date?: string;
  has_time_slot?: boolean;
  time_slot_start?: string;
  time_slot_end?: string;
  location?: string;
  ticket_types: TicketType[];
  entrance?: string[];
  parking?: string[];
  camping?: string[];
}

type Json = string | number | boolean | { [key: string]: Json | undefined } | Json[] | null;

interface RawTicketType {
  name?: Json;
  price?: Json;
  description?: Json;
  quantity?: Json;
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const rawEvent = await getEventBySlug(slug);
    
    if (!rawEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // Cast the raw event data to our expected format
    const event: EventData = {
      ...rawEvent,
      ticket_types: (rawEvent.ticket_types || []).map((ticket: Json) => {
        const t = ticket as RawTicketType;
        return {
          name: String(t.name || ''),
          price: Number(t.price || 0),
          description: t.description ? String(t.description) : undefined,
          quantity: t.quantity ? Number(t.quantity) : undefined,
        };
      }),
      entrance: Array.isArray(rawEvent.entrance) ? rawEvent.entrance.map(String) : [],
      parking: Array.isArray(rawEvent.parking) ? rawEvent.parking.map(String) : [],
      camping: Array.isArray(rawEvent.camping) ? rawEvent.camping.map(String) : [],
    };
    
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

    // Create styles
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 40
      },
      section: {
        marginBottom: 20
      },
      title: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold'
      },
      details: {
        marginBottom: 20
      },
      detail: {
        fontSize: 14,
        marginBottom: 5
      },
      ingress: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'medium'
      },
      body: {
        fontSize: 12,
        marginBottom: 20
      },
      sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold'
      },
      ticket: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb'
      },
      ticketName: {
        fontSize: 14,
        fontWeight: 'medium'
      },
      ticketDescription: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2
      },
      ticketQuantity: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2
      },
      ticketPrice: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      infoSection: {
        marginBottom: 10
      },
      infoTitle: {
        fontSize: 14,
        fontWeight: 'medium',
        marginBottom: 2
      },
      infoText: {
        fontSize: 12,
        color: '#6b7280'
      },
      qrCode: {
        alignItems: 'center',
        marginTop: 30
      },
      qrText: {
        fontSize: 10,
        marginTop: 10,
        color: '#6b7280',
        textAlign: 'center'
      }
    });

    // Create PDF Document component
    const MyDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>{event.title}</Text>
            
            <View style={styles.details}>
              {event.from_date && (
                <Text style={styles.detail}>
                  Date: {formatDateRange()}
                </Text>
              )}
              {event.has_time_slot && event.time_slot_start && event.time_slot_end && (
                <Text style={styles.detail}>
                  Time: {formatTimeRange()}
                </Text>
              )}
              {event.location && (
                <Text style={styles.detail}>
                  Location: {event.location}
                </Text>
              )}
            </View>

            {event.ingress && (
              <Text style={styles.ingress}>{event.ingress}</Text>
            )}
            {event.body && (
              <Text style={styles.body}>{event.body}</Text>
            )}

            {event.ticket_types && event.ticket_types.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tickets</Text>
                {event.ticket_types.map((ticket, index) => (
                  <View key={index} style={styles.ticket}>
                    <View>
                      <Text style={styles.ticketName}>{ticket.name}</Text>
                      {ticket.description && (
                        <Text style={styles.ticketDescription}>{ticket.description}</Text>
                      )}
                      {ticket.quantity && (
                        <Text style={styles.ticketQuantity}>
                          {ticket.quantity} tickets available
                        </Text>
                      )}
                    </View>
                    <Text style={styles.ticketPrice}>${ticket.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}

            {((event.entrance && event.entrance.length > 0) || 
              (event.parking && event.parking.length > 0) || 
              (event.camping && event.camping.length > 0)) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Information</Text>
                {event.entrance && event.entrance.length > 0 && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Entrance Options:</Text>
                    <Text style={styles.infoText}>{event.entrance.join(", ")}</Text>
                  </View>
                )}
                {event.parking && event.parking.length > 0 && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Parking Information:</Text>
                    <Text style={styles.infoText}>{event.parking.join(", ")}</Text>
                  </View>
                )}
                {event.camping && event.camping.length > 0 && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Camping Options:</Text>
                    <Text style={styles.infoText}>{event.camping.join(", ")}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.qrCode}>
              <Text style={styles.qrText}>Scan to view event details</Text>
              <Text style={styles.qrText}>{eventUrl}</Text>
            </View>
          </View>
        </Page>
      </Document>
    );

    // Generate the PDF buffer
    const pdfBuffer = await renderToBuffer(<MyDocument />);

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${event.slug}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response("Error generating PDF", { status: 500 });
  }
}
