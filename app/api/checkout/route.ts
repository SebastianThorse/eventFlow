import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const PLANS = {
  starter: {
    name: 'Starter',
    price: 900, // $9.00
    credits: 1,
  },
  pro: {
    name: 'Pro',
    price: 2000, // $20.00
    credits: 3,
  },
  business: {
    name: 'Business',
    price: 2900, // $29.00
    credits: 5,
  },
};

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const planId = searchParams.get('plan');

  if (!planId || !PLANS[planId as keyof typeof PLANS]) {
    return new Response('Invalid plan selected', { status: 400 });
  }

  const plan = PLANS[planId as keyof typeof PLANS];
  const stripeApiKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeApiKey) {
    return new Response('Stripe API key is missing', { status: 500 });
  }

  const stripe = new Stripe(stripeApiKey);

  try {
    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Plan - ${plan.credits} Event ${
                plan.credits === 1 ? 'Credit' : 'Credits'
              }`,
              description: `Purchase ${plan.credits} event ${
                plan.credits === 1 ? 'credit' : 'credits'
              } for Eventify`,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/profile?success=true`,
      cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        credits: plan.credits.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response('Error creating checkout session', { status: 500 });
  }
}
