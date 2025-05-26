-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id text NOT NULL UNIQUE,
    email text,
    event_credits integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create events table
CREATE TABLE public.events (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    ingress text,
    body text,
    from_date timestamp with time zone,
    to_date timestamp with time zone,
    has_time_slot boolean DEFAULT false NOT NULL,
    time_slot_start time,
    time_slot_end time,
    location text,
    user_id text NOT NULL,
    template_id text NOT NULL,
    cover_image_url text,
    images text[] DEFAULT ARRAY[]::text[] NOT NULL,
    ticket_types jsonb[] DEFAULT ARRAY[]::jsonb[] NOT NULL,
    entrance text[] DEFAULT ARRAY[]::text[] NOT NULL,
    parking text[] DEFAULT ARRAY[]::text[] NOT NULL,
    camping text[] DEFAULT ARRAY[]::text[] NOT NULL,
    custom_styles jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT events_date_check CHECK (to_date >= from_date)
);

-- Create indexes
CREATE INDEX events_from_date_idx ON public.events (from_date);
CREATE INDEX events_to_date_idx ON public.events (to_date);
CREATE INDEX events_user_id_idx ON public.events (user_id);
CREATE INDEX events_slug_idx ON public.events (slug);

-- Create RPC function for profile creation
CREATE OR REPLACE FUNCTION public.create_user_profile(p_user_id text, p_email text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_profile_id uuid;
BEGIN
    -- Try to insert, if it fails due to unique constraint, do an update
    INSERT INTO public.user_profiles (user_id, email)
    VALUES (p_user_id, p_email)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        email = EXCLUDED.email,
        updated_at = now()
    RETURNING id INTO v_profile_id;
    
    RETURN v_profile_id;
END;
$$;

-- Create RPC function for modifying credits
CREATE OR REPLACE FUNCTION public.modify_user_credits(target_user_id text, credit_change integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.user_profiles
    SET event_credits = event_credits + credit_change,
        updated_at = now()
    WHERE user_id = target_user_id;
END;
$$;

-- Drop the existing update_event function if it exists
DROP FUNCTION IF EXISTS public.update_event;

-- Create a trigger function to handle updates
CREATE OR REPLACE FUNCTION public.handle_event_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set updated_at timestamp
  NEW.updated_at = now();
  
  -- Ensure arrays are not null
  NEW.images = COALESCE(NEW.images, ARRAY[]::text[]);
  NEW.ticket_types = COALESCE(NEW.ticket_types, ARRAY[]::jsonb[]);
  NEW.entrance = COALESCE(NEW.entrance, ARRAY[]::text[]);
  NEW.parking = COALESCE(NEW.parking, ARRAY[]::text[]);
  NEW.camping = COALESCE(NEW.camping, ARRAY[]::text[]);
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_event_update ON public.events;
CREATE TRIGGER on_event_update
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_event_update();

-- Create RPC function for updating events
CREATE OR REPLACE FUNCTION public.update_event(
  p_event_id uuid,
  p_user_id text,
  p_title text,
  p_ingress text DEFAULT NULL,
  p_body text DEFAULT NULL,
  p_from_date timestamp with time zone DEFAULT NULL,
  p_to_date timestamp with time zone DEFAULT NULL,
  p_has_time_slot boolean DEFAULT false,
  p_time_slot_start time DEFAULT NULL,
  p_time_slot_end time DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_cover_image_url text DEFAULT NULL,
  p_images text[] DEFAULT ARRAY[]::text[],
  p_ticket_types jsonb[] DEFAULT ARRAY[]::jsonb[],
  p_entrance text[] DEFAULT ARRAY[]::text[],
  p_parking text[] DEFAULT ARRAY[]::text[],
  p_camping text[] DEFAULT ARRAY[]::text[],
  p_template_id text DEFAULT NULL
)
RETURNS public.events
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event public.events;
BEGIN
  -- Update the event
  UPDATE public.events
  SET
    title = p_title,
    ingress = p_ingress,
    body = p_body,
    from_date = p_from_date,
    to_date = p_to_date,
    has_time_slot = p_has_time_slot,
    time_slot_start = p_time_slot_start,
    time_slot_end = p_time_slot_end,
    location = p_location,
    cover_image_url = p_cover_image_url,
    images = p_images,
    ticket_types = p_ticket_types,
    entrance = p_entrance,
    parking = p_parking,
    camping = p_camping,
    template_id = COALESCE(p_template_id, template_id)
  WHERE id = p_event_id AND user_id = p_user_id
  RETURNING * INTO v_event;

  IF v_event IS NULL THEN
    RAISE EXCEPTION 'Event not found or not owned by user';
  END IF;

  RETURN v_event;
END;
$$;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Create RLS policies for events
CREATE POLICY "Users can view their own events"
  ON public.events
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own events"
  ON public.events
  FOR DELETE
  USING (auth.uid()::text = user_id);

