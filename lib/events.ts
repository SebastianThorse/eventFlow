import { supabase, getSupabaseAdmin } from './supabase';
import { nanoid } from 'nanoid';
import type { Database } from '@/types/supabase';

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];

export async function getUserEvents(userId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user events:', error);
    throw new Error('Failed to fetch events');
  }

  return data || [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // PGRST116 means no rows returned
      return null;
    }

    console.error('Error fetching event by slug:', error);
    throw new Error('Failed to fetch event');
  }

  return data;
}

export async function getEventById(
  id: string,
  userId: string
): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    console.error('Error fetching event by ID:', error);
    throw new Error('Failed to fetch event');
  }

  return data;
}

export async function createEvent(
  event: Omit<EventInsert, 'id' | 'slug' | 'created_at' | 'updated_at'>,
  deductCredit = true
): Promise<Event> {
  // Generate a unique slug
  const slug = `${nanoid(8)}-${event.title
    .toLowerCase()
    .replace(/\s+/g, '-')}`.substring(0, 50);

  const newEvent: EventInsert = {
    ...event,
    slug,
  };

  // Use admin client to bypass RLS
  const adminClient = getSupabaseAdmin();
  const { data, error } = await adminClient
    .from('events')
    .insert([newEvent])
    .select('*')
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }

  if (!data) {
    throw new Error('Failed to create event: No data returned');
  }

  return data;
}

export async function updateEvent(
  id: string,
  event: Partial<Database['public']['Tables']['events']['Update']>,
  userId: string
): Promise<Event> {
  // Use admin client for the update
  const adminClient = getSupabaseAdmin();

  // First verify the event exists and belongs to the user
  const { data: existingEvent, error: fetchError } = await adminClient
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError || !existingEvent) {
    console.error('Error fetching event:', fetchError);
    throw new Error('Event not found');
  }

  // Prepare update data
  const updateData = {
    title: event.title || existingEvent.title,
    ingress: event.ingress ?? existingEvent.ingress,
    body: event.body ?? existingEvent.body,
    from_date: event.from_date || existingEvent.from_date,
    to_date: event.to_date || existingEvent.to_date,
    has_time_slot: event.has_time_slot ?? existingEvent.has_time_slot,
    time_slot_start: event.time_slot_start ?? existingEvent.time_slot_start,
    time_slot_end: event.time_slot_end ?? existingEvent.time_slot_end,
    location: event.location ?? existingEvent.location,
    cover_image_url: event.cover_image_url ?? existingEvent.cover_image_url,
    images: event.images || existingEvent.images,
    ticket_types: event.ticket_types || existingEvent.ticket_types,
    entrance: event.entrance || existingEvent.entrance,
    parking: event.parking || existingEvent.parking,
    camping: event.camping || existingEvent.camping,
    template_id: event.template_id || existingEvent.template_id,
    updated_at: new Date().toISOString(),
  };

  // Now perform the update using raw SQL
  const { data, error } = await adminClient.rpc('update_event', {
    p_event_id: id,
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
    throw new Error('Failed to update event');
  }

  if (!data) {
    throw new Error('No data returned after update');
  }

  return data as Event;
}

export async function deleteEvent(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}
