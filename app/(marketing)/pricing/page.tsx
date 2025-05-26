"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, Coins } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan');

  const handlePlanSelection = (planId: string) => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect=/pricing');
      return;
    }
    
    router.push(`/api/checkout?plan=${planId}`);
  };

  useEffect(() => {
    if (selectedPlan) {
      const element = document.getElementById(selectedPlan);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPlan]);

  return (
    <div className="py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Simple, transparent pricing
        </h1>
        <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-center">
          Choose the perfect plan for your event needs. No hidden fees, no monthly subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.id} 
            id={plan.id}
            className={`flex flex-col ${plan.featured ? 'border-primary shadow-lg' : ''}`}
          >
            {plan.featured && (
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                Most Popular
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between">
              <div>
                <div className="mb-4 flex items-baseline">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.id !== 'custom' && (
                    <span className="ml-1 text-muted-foreground">
                      for {plan.credits} {plan.credits === 1 ? 'credit' : 'credits'}
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              {plan.id === 'custom' ? (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  asChild
                >
                  <Link href="/contact">Contact sales</Link>
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant={plan.featured ? 'default' : 'outline'} 
                  onClick={() => handlePlanSelection(plan.id)}
                >
                  {isSignedIn ? 'Buy now' : 'Sign in to purchase'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-muted p-8">
        <h3 className="mb-4 text-xl font-bold">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h4 className="font-medium">{faq.question}</h4>
              <p className="mt-1 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for a single event',
    price: 9,
    credits: 1,
    featured: false,
    features: [
      'One event page',
      'Basic templates',
      'QR code generation',
      'PDF download',
      'Mobile optimized',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best value for multiple events',
    price: 20,
    credits: 3,
    featured: true,
    features: [
      'Three event pages',
      'All templates, including premium',
      'QR code generation',
      'PDF download',
      'Mobile optimized',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Ideal for businesses and organizations',
    price: 29,
    credits: 5,
    featured: false,
    features: [
      'Five event pages',
      'All templates, including premium',
      'QR code generation',
      'PDF download',
      'Mobile optimized',
      'Priority support',
      'Advanced analytics',
    ],
  },
];

const faqs = [
  {
    question: 'What is an event credit?',
    answer: 'An event credit allows you to create one event page. Once published, you can edit the page as much as you like without using additional credits.',
  },
  {
    question: 'Do I get any free credits?',
    answer: 'Yes! You get 1 free credit when you sign up, allowing you to create your first event page at no cost.',
  },
  {
    question: 'Do credits expire?',
    answer: 'No, your credits never expire. Use them whenever you need to create a new event.',
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Yes, you can purchase additional credits at any time without losing your existing credits.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and PayPal for payment processing through our secure Stripe integration.',
  },
];
