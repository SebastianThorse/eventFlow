-- Drop existing function
DROP FUNCTION IF EXISTS public.modify_user_credits(text, integer);

-- Create new function with transaction and return value
CREATE OR REPLACE FUNCTION public.modify_user_credits(target_user_id text, credit_change integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_credits integer;
BEGIN
    -- Start a transaction
    BEGIN
        -- Lock the row and get current credits
        SELECT event_credits INTO current_credits
        FROM user_profiles
        WHERE user_id = target_user_id
        FOR UPDATE;

        -- Check if we have enough credits for deduction
        IF credit_change < 0 AND (current_credits + credit_change) < 0 THEN
            RETURN false;
        END IF;

        -- Update credits
        UPDATE user_profiles
        SET event_credits = event_credits + credit_change,
            updated_at = now()
        WHERE user_id = target_user_id;

        RETURN true;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN false;
    END;
END;
$$; 
