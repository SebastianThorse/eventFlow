import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  CalendarHeart, 
  CreditCard, 
  Globe, 
  Clock, 
  Smartphone, 
  ChevronRight 
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent" />
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Create beautiful event pages in minutes
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Eventify makes it easy to create stunning event pages that delight your guests. No design skills required.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/templates">See Templates</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/7147720/pexels-photo-7147720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Event page preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything you need to create the perfect event page
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Beautiful templates, customizable designs, and powerful features to make your event stand out.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CalendarHeart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Beautiful Templates</h3>
              <p className="text-center text-muted-foreground">
                Choose from a variety of professionally designed templates.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Create in Minutes</h3>
              <p className="text-center text-muted-foreground">
                Our intuitive editor makes building your page quick and easy.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Custom URL</h3>
              <p className="text-center text-muted-foreground">
                Get a unique and memorable URL for your event page.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Simple Pricing</h3>
              <p className="text-center text-muted-foreground">
                Pay per event with no monthly fees or hidden costs.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <rect width="5" height="5" x="3" y="3" rx="1" />
                  <rect width="5" height="5" x="16" y="3" rx="1" />
                  <rect width="5" height="5" x="3" y="16" rx="1" />
                  <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                  <path d="M21 21v.01" />
                  <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                  <path d="M3 12h.01" />
                  <path d="M12 3h.01" />
                  <path d="M12 16v.01" />
                  <path d="M16 12h1" />
                  <path d="M21 12v.01" />
                  <path d="M12 21v-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">QR Code Generation</h3>
              <p className="text-center text-muted-foreground">
                Create QR codes for easy sharing at physical locations.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Mobile Optimized</h3>
              <p className="text-center text-muted-foreground">
                Pages look great on all devices, from desktops to smartphones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Loved by event planners
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Join thousands of satisfied users who use Eventify for their events.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col justify-between space-y-4 rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="space-y-2">
                  <p className="text-muted-foreground">{testimonial.quote}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted">
                    {/* Placeholder for avatar */}
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {testimonial.author[0]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground md:text-4xl/tight">
                Ready to create your event?
              </h2>
              <p className="max-w-[900px] text-primary-foreground/80 md:text-xl/relaxed">
                Get started with Eventify today and create stunning event pages in minutes.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full min-[400px]:w-auto" 
                asChild
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full min-[400px]:w-auto bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10" 
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const testimonials = [
  {
    quote: "Eventify made creating my wedding website so easy! Our guests loved it and the QR code feature was perfect for our invitations.",
    author: "Sarah Johnson",
    role: "Bride",
  },
  {
    quote: "As a conference organizer, I needed something professional but easy to use. Eventify delivered exactly what I needed.",
    author: "Michael Chen",
    role: "Event Manager",
  },
  {
    quote: "The templates are beautiful and customizing them is incredibly simple. I've used Eventify for multiple charity events now.",
    author: "Emma Rodriguez",
    role: "Non-profit Coordinator",
  },
];