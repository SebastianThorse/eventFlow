-- Add public event viewing policy
CREATE POLICY "Anyone can view published events"
  ON public.events
  FOR SELECT
  USING (true); 
