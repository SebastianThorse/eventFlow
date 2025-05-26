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
  event: Partial<
    Omit<EventInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  >,
  userId: string
): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }

  return data;
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
