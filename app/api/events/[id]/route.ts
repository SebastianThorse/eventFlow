import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { updateEvent, getEventById, deleteEvent } from '@/lib/events';

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

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const eventId = params.id;
    const body = await req.json();

    // Validate input
    if (!body.title) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Check if the event exists and belongs to the user
    const existingEvent = await getEventById(eventId, userId);

    if (!existingEvent) {
      return new Response('Event not found', { status: 404 });
    }

    // Update the event
    const event = await updateEvent(
      eventId,
      {
        title: body.title,
        ingress: body.ingress,
        body: body.body,
        from_date: body.from_date,
        to_date: body.to_date,
        has_time_slot: body.has_time_slot,
        time_slot_start: body.time_slot_start,
        time_slot_end: body.time_slot_end,
        location: body.location,
        cover_image_url: body.cover_image_url,
        images: body.images,
        ticket_types: body.ticket_types,
        entrance: body.entrance,
        parking: body.parking,
        camping: body.camping,
        custom_styles: body.custom_styles,
        template_id: body.template_id,
      },
      userId
    );

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error updating event:', error);
    return new Response(error.message || 'Error updating event', {
      status: 500,
    });
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
