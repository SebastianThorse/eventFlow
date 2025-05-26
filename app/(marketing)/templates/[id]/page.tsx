"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Ticket, Clock, Car } from "lucide-react";
import { format } from "date-fns";

const templates = {
  minimalist: {
    name: "Minimalist",
    render: () => (
      <div className="min-h-screen bg-background">
        <div className="relative h-[60vh] w-full bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Tech Conference 2024
            </h1>
          </div>
        </div>
        <div className="mx-auto max-w-4xl space-y-12 p-8">
          {/* Event Details */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-foreground">March 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-foreground">San Francisco, CA</span>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>Join us for an immersive experience exploring the future of technology.</p>
          </div>

          {/* Ticket Types */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Tickets</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Early Bird",
                  price: "$299",
                  benefits: ["Full conference access", "Workshop materials", "Lunch included"]
                },
                {
                  name: "Regular",
                  price: "$399",
                  benefits: ["Full conference access", "Workshop materials", "Lunch included"]
                },
                {
                  name: "VIP",
                  price: "$699",
                  benefits: ["Full access", "Workshop materials", "Lunch included", "VIP dinner", "Priority seating"]
                }
              ].map((ticket) => (
                <Card key={ticket.name} className="p-6 bg-card">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{ticket.name}</h3>
                      <Badge variant="secondary">{ticket.price}</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {ticket.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center">
                          <Ticket className="mr-2 h-4 w-4" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Venue Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Venue Details</h2>
            <Card className="p-6 bg-card">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-medium text-foreground">Check-in Information</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Check-in opens at 8:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <div>Main Entrance - 123 Tech Boulevard</div>
                        <div>VIP Entrance - West Wing</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 font-medium text-foreground">Parking</h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Car className="h-4 w-4" />
                    <span>Free parking available on-site</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
  elegant: {
    name: "Elegant",
    render: () => (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/80 p-6 backdrop-blur">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-3xl italic tracking-tight text-foreground md:text-5xl">
              Annual Charity Gala
            </h1>
          </div>
        </header>
        <div className="mx-auto max-w-3xl space-y-12 p-8">
          {/* Event Details */}
          <div className="flex flex-col items-center gap-6 border-y border-border py-8 text-center">
            <div className="flex items-center gap-2 text-lg font-light tracking-wide text-foreground">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              December 31, 2024
            </div>
            <div className="flex items-center gap-2 text-lg font-light tracking-wide text-foreground">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              The Grand Hotel
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert mx-auto max-w-2xl text-center">
            <p className="font-light leading-relaxed tracking-wide">
              Join us for an evening of elegance, fine dining, and charitable giving.
            </p>
          </div>

          {/* Ticket Types */}
          <div className="space-y-8">
            <h2 className="text-center text-2xl font-serif italic text-foreground">Reservations</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Individual",
                  price: "$500",
                  benefits: ["Gala dinner", "Welcome champagne", "Live entertainment"]
                },
                {
                  name: "Couple",
                  price: "$900",
                  benefits: ["Gala dinner for two", "Welcome champagne", "Live entertainment"]
                },
                {
                  name: "Patron Table",
                  price: "$5000",
                  benefits: ["Table for 10 guests", "Premium wine", "Program recognition", "VIP reception"]
                }
              ].map((ticket) => (
                <Card key={ticket.name} className="bg-card/70 p-6 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-serif text-xl text-foreground">{ticket.name}</h3>
                      <div className="mt-2 text-2xl font-light text-foreground">{ticket.price}</div>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {ticket.benefits.map((benefit) => (
                        <li key={benefit} className="text-center font-light">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Venue Information */}
          <div className="space-y-6 border-t border-border pt-8">
            <h2 className="text-center text-2xl font-serif italic text-foreground">Event Details</h2>
            <div className="grid gap-6">
              <Card className="bg-card/70 p-6 backdrop-blur-sm">
                <div className="grid gap-6 text-center">
                  <div>
                    <h3 className="mb-3 font-medium text-foreground">Arrival</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Check-in begins at 6:30 PM</span>
                      </div>
                      <div>Black tie required</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 font-medium text-foreground">Location</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>Grand Ballroom Entrance</div>
                      <div>Complimentary valet parking</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  bold: {
    name: "Bold",
    render: () => (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-screen bg-black">
          <div className="absolute h-full w-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-90 dark:opacity-70" />
          <div className="relative z-10 flex h-full items-center justify-center p-8">
            <div className="max-w-4xl text-center">
              <h1 className="mb-8 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
                Music Festival 2024
              </h1>
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-xl font-medium text-white">
                  <CalendarDays className="h-6 w-6" />
                  July 1-3, 2024
                </div>
                <div className="flex items-center gap-2 text-xl font-medium text-white">
                  <MapPin className="h-6 w-6" />
                  Central Park, NYC
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-background py-20">
          <div className="container mx-auto max-w-5xl px-8">
            {/* Description */}
            <div className="mb-20 text-center">
              <div className="prose prose-xl dark:prose-invert mx-auto">
                <p className="text-2xl font-medium leading-relaxed text-foreground">
                  Three days of incredible music, art, and unforgettable experiences.
                </p>
              </div>
            </div>

            {/* Ticket Types */}
            <div className="mb-20 space-y-8">
              <h2 className="text-center text-4xl font-black uppercase text-foreground">Tickets</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    name: "Single Day",
                    price: "$89",
                    benefits: ["Access to all stages", "Food vendor area access"]
                  },
                  {
                    name: "3-Day Pass",
                    price: "$199",
                    benefits: ["Full festival access", "Food vendor area", "Festival t-shirt"]
                  },
                  {
                    name: "VIP Weekend",
                    price: "$399",
                    benefits: ["Full access", "VIP areas", "Exclusive lounge", "Meet & greet", "Merch pack"]
                  }
                ].map((ticket) => (
                  <Card key={ticket.name} className="overflow-hidden">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1">
                      <div className="bg-card p-6">
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="text-xl font-bold uppercase text-foreground">{ticket.name}</h3>
                            <div className="mt-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                              {ticket.price}
                            </div>
                          </div>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {ticket.benefits.map((benefit) => (
                              <li key={benefit} className="flex items-center justify-center">
                                <Ticket className="mr-2 h-4 w-4" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Venue Information */}
            <div className="space-y-8">
              <h2 className="text-center text-4xl font-black uppercase text-foreground">Festival Info</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="p-6 bg-card">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">Entrances</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Main Festival Entrance - North Gate
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        VIP Entrance - East Gate
                      </li>
                    </ul>
                  </div>
                </Card>
                <Card className="p-6 bg-card">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">Parking & Transport</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Main Parking Lot - $20/day
                      </li>
                      <li className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        VIP Parking - Included with VIP ticket
                      </li>
                      <li className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Free Downtown Shuttle Service
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

interface TemplatePageProps {
  params: {
    id: string;
  };
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const template = templates[params.id as keyof typeof templates];

  if (!template) {
    notFound();
  }

  return (
    <div>
      <div className="fixed left-4 right-4 top-4 z-50 flex justify-between md:left-8 md:right-8 md:top-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/templates">
            ← Back to Templates
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up">
            Use this template
          </Link>
        </Button>
      </div>
      {template.render()}
    </div>
  );
} 
