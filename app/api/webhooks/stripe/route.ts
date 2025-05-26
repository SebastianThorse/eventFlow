import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeApiKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeApiKey) {
    return new Response('Stripe API key is missing', { status: 500 });
  }

  if (!webhookSecret) {
    return new Response('Stripe webhook secret is missing', { status: 500 });
  }

  const stripe = new Stripe(stripeApiKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract the user ID and credits from metadata
    const userId = session.metadata?.userId;
    const creditsToAdd = parseInt(session.metadata?.credits || '0');

    if (!userId || !creditsToAdd) {
      console.error('Missing userId or credits in session metadata');
      return new Response('Missing user data', { status: 400 });
    }

    try {
      // Call our secure function to modify credits
      const { error } = await supabase.rpc('modify_user_credits', {
        target_user_id: userId,
        credit_change: creditsToAdd,
      });

      if (error) {
        console.error('Error updating user credits:', error);
        return new Response('Error updating user credits', { status: 500 });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error processing Stripe webhook:', error);
      return new Response('Error processing webhook', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
