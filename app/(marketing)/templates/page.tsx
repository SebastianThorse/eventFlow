"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

const templates = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean and modern design with focus on content",
    image: "/templates/minimalist.png",
    mockData: {
      title: "Tech Conference 2024",
      description: "Join us for a day of innovation and insights with industry leaders. Featuring keynote speakers, interactive workshops, and networking opportunities.",
      date: "2024-09-15",
      location: "Silicon Valley Convention Center",
      images: [
        "/mock/tech-conference-main.jpg",
        "/mock/tech-conference-workshop.jpg",
        "/mock/tech-conference-speakers.jpg",
        "/mock/tech-conference-venue.jpg"
      ],
      ingress: {
        ticketTypes: [
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
            benefits: ["Full conference access", "Workshop materials", "Lunch included", "VIP networking dinner", "Priority seating"]
          }
        ],
        registrationStart: "2024-06-01",
        registrationEnd: "2024-09-14",
        checkInTime: "8:00 AM",
        venue: {
          entrances: ["Main Entrance - 123 Tech Boulevard", "VIP Entrance - West Wing"],
          parking: "Free parking available on-site"
        }
      }
    }
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated design with elegant typography",
    image: "/templates/elegant.png",
    mockData: {
      title: "Annual Charity Gala",
      description: "An enchanting evening of fine dining, live music, and charitable giving. Black tie attire required. All proceeds benefit local education initiatives.",
      date: "2024-12-31",
      location: "The Grand Hotel Ballroom",
      images: [
        "/mock/gala-ballroom.jpg",
        "/mock/gala-dining.jpg",
        "/mock/gala-performance.jpg",
        "/mock/gala-auction.jpg"
      ],
      ingress: {
        ticketTypes: [
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
            benefits: ["Table for 10 guests", "Premium wine selection", "Recognition in program", "VIP reception"]
          }
        ],
        registrationStart: "2024-09-01",
        registrationEnd: "2024-12-15",
        checkInTime: "6:30 PM",
        venue: {
          entrances: ["Grand Ballroom Entrance", "Valet Drop-off"],
          parking: "Complimentary valet parking for all guests",
          dresscode: "Black tie required"
        }
      }
    }
  },
  {
    id: "bold",
    name: "Bold",
    description: "Stand out with vibrant colors and dynamic layouts",
    image: "/templates/bold.png",
    mockData: {
      title: "Summer Music Festival",
      description: "Three days of non-stop music featuring over 30 artists across 4 stages. Food trucks, art installations, and unforgettable experiences await!",
      date: "2024-07-20",
      location: "Riverside Park Amphitheater",
      images: [
        "/mock/festival-stage.jpg",
        "/mock/festival-crowd.jpg",
        "/mock/festival-food.jpg",
        "/mock/festival-art.jpg"
      ],
      ingress: {
        ticketTypes: [
          {
            name: "Single Day Pass",
            price: "$89",
            benefits: ["Access to all stages", "Food vendor area access"]
          },
          {
            name: "3-Day Pass",
            price: "$199",
            benefits: ["Full festival access", "Food vendor area access", "Free festival t-shirt"]
          },
          {
            name: "VIP Weekend Pass",
            price: "$399",
            benefits: ["Full festival access", "VIP viewing areas", "Exclusive lounge access", "Meet & greet opportunities", "Free merchandise pack"]
          }
        ],
        registrationStart: "2024-03-01",
        registrationEnd: "2024-07-19",
        checkInTime: "Gates open at 11:00 AM daily",
        venue: {
          entrances: [
            "Main Festival Entrance - North Gate",
            "VIP Entrance - East Gate",
            "Staff/Artist Entrance - South Gate"
          ],
          parking: [
            "Main Parking Lot - $20/day",
            "VIP Parking - Included with VIP ticket",
            "Shuttle Service from Downtown - Free"
          ],
          camping: {
            available: true,
            options: ["Regular Camping", "Glamping", "RV Spots"]
          }
        }
      }
    }
  }
];

export default function TemplatesPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Event Templates</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a template to preview how your event could look
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Link key={template.id} href={`/templates/${template.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video w-full bg-muted">
                {template.mockData.images[0] ? (
                  <img
                    src={template.mockData.images[0]}
                    alt={template.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">Preview Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 
