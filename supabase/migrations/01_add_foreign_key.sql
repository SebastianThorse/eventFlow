-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_user_profile'
  ) THEN
    ALTER TABLE public.events
    ADD CONSTRAINT fk_user_profile
    FOREIGN KEY (user_id)
    REFERENCES public.user_profiles(user_id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add index if not exists (though we already have it in initial migration)
CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events(user_id); 
