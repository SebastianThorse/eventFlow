import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createEvent } from '@/lib/events';
import { deductEventCredit } from '@/lib/user';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    // Validate input
    if (!body.title || !body.template_id) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Use admin client to check credits
    const adminClient = getSupabaseAdmin();
    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .select('event_credits')
      .eq('user_id', userId)
      .single<Pick<UserProfile, 'event_credits'>>();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      return new Response('Unable to verify credits. Please try again later.', {
        status: 500,
      });
    }

    if (profile.event_credits < 1) {
      return new Response(
        'Unable to create event: Insufficient credits. Please purchase more credits to continue.',
        { status: 402 }
      );
    }

    // Try to create the event first
    const event = await createEvent({
      title: body.title,
      ingress: body.ingress,
      body: body.body,
      from_date: body.from_date,
      to_date: body.to_date,
      has_time_slot: body.has_time_slot,
      time_slot_start: body.time_slot_start,
      time_slot_end: body.time_slot_end,
      location: body.location,
      template_id: body.template_id,
      user_id: userId,
      cover_image_url: body.cover_image_url,
      images: body.images,
      ticket_types: body.ticket_types,
      entrance: body.entrance,
      parking: body.parking,
      camping: body.camping,
      custom_styles: body.custom_styles,
    });

    // Only deduct credit after successful event creation
    const creditDeducted = await deductEventCredit(userId, event.id);
    if (!creditDeducted) {
      // If credit deduction fails, we should delete the event we just created
      // to maintain consistency
      try {
        await adminClient
          .from('events')
          .delete()
          .eq('id', event.id)
          .eq('user_id', userId);
      } catch (deleteError) {
        console.error('Error rolling back event creation:', deleteError);
      }

      return new Response('Failed to process event credit. Please try again.', {
        status: 500,
      });
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);

    // Provide more specific error messages
    if (error.message?.includes('credits')) {
      return new Response(
        'Insufficient credits. Please purchase more credits to continue.',
        {
          status: 402,
        }
      );
    }

    return new Response(
      'An error occurred while creating the event. Please try again later.',
      { status: 500 }
    );
  }
}
