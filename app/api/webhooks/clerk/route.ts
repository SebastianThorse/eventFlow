import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUserProfile } from '@/lib/user';

export async function POST(req: Request) {
  console.log('📥 Clerk webhook received');

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('🔍 Headers:', { svix_id, svix_timestamp, svix_signature });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing Svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  console.log('📦 Webhook payload:', payload);
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ Missing CLERK_WEBHOOK_SECRET');
    return new Response('Error occurred -- missing webhook secret', {
      status: 500,
    });
  }

  console.log('🔐 Webhook secret exists:', !!webhookSecret);
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    console.log('✅ Webhook verified successfully');
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error occurred -- invalid signature', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('📣 Event type:', eventType);

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    try {
      const profile = await createUserProfile(id, primaryEmail);
      if (!profile) {
        console.error('Failed to create user profile for:', id);
        return new Response('Error creating user profile', { status: 500 });
      }
      return new Response('Profile created successfully', { status: 200 });
    } catch (error) {
      console.error('Error in user profile creation:', error);
      return new Response('Error creating user profile', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
