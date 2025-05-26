import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { updateEvent, getEventById, deleteEvent } from '@/lib/events';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type EventUpdate = Database['public']['Tables']['events']['Update'];

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const eventId = params.id;
    const event = await getEventById(eventId, userId);

    if (!event) {
      return new Response('Event not found', { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error getting event:', error);
    return new Response(error.message || 'Error getting event', {
      status: 500,
    });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    console.log('PUT /api/events/[id] - Starting update for event:', params.id);

    if (!userId) {
      console.log('PUT /api/events/[id] - Unauthorized: No user ID');
      return new Response('Unauthorized', { status: 401 });
    }

    const eventId = params.id;
    const body = await req.json();
    console.log('PUT /api/events/[id] - Request body:', body);

    // Validate input
    if (!body.title) {
      console.log('PUT /api/events/[id] - Missing required field: title');
      return new Response('Missing required fields', { status: 400 });
    }

    // Use admin client for the update
    const adminClient = getSupabaseAdmin();

    // Prepare update data
    const updateData = {
      title: body.title,
      ingress: body.ingress || null,
      body: body.body || null,
      from_date: body.from_date,
      to_date: body.to_date,
      has_time_slot: body.has_time_slot,
      time_slot_start: body.time_slot_start || null,
      time_slot_end: body.time_slot_end || null,
      location: body.location || null,
      cover_image_url: body.cover_image_url || null,
      images: body.images || [],
      ticket_types: body.ticket_types || [],
      entrance: body.entrance || [],
      parking: body.parking || [],
      camping: body.camping || [],
      template_id: body.template_id,
      updated_at: new Date().toISOString(),
    };

    // Update using RPC function
    const { data, error } = await adminClient.rpc('update_event', {
      p_event_id: eventId,
      p_user_id: userId,
      p_title: updateData.title,
      p_ingress: updateData.ingress,
      p_body: updateData.body,
      p_from_date: updateData.from_date,
      p_to_date: updateData.to_date,
      p_has_time_slot: updateData.has_time_slot,
      p_time_slot_start: updateData.time_slot_start,
      p_time_slot_end: updateData.time_slot_end,
      p_location: updateData.location,
      p_cover_image_url: updateData.cover_image_url,
      p_images: updateData.images,
      p_ticket_types: updateData.ticket_types,
      p_entrance: updateData.entrance,
      p_parking: updateData.parking,
      p_camping: updateData.camping,
      p_template_id: updateData.template_id,
    });

    if (error) {
      console.error('Error updating event:', error);
      if (error.message.includes('Event not found or not owned by user')) {
        return new Response('Event not found', { status: 404 });
      }
      return new Response('Failed to update event', { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/events/[id]:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const eventId = params.id;

    // Check if the event exists and belongs to the user
    const existingEvent = await getEventById(eventId, userId);

    if (!existingEvent) {
      return new Response('Event not found', { status: 404 });
    }

    // Delete the event
    await deleteEvent(eventId, userId);

    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return new Response(error.message || 'Error deleting event', {
      status: 500,
    });
  }
}
