-- Create transactions table
CREATE TABLE public.credit_transactions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id text NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    amount integer NOT NULL,
    type text NOT NULL CHECK (type IN ('credit', 'debit')),
    description text,
    event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create index for faster lookups
CREATE INDEX credit_transactions_user_id_idx ON public.credit_transactions(user_id);
CREATE INDEX credit_transactions_created_at_idx ON public.credit_transactions(created_at);

-- Update the modify_user_credits function to record transactions
CREATE OR REPLACE FUNCTION public.modify_user_credits(
    target_user_id text,
    credit_change integer,
    description text DEFAULT NULL,
    event_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_credits integer;
    transaction_type text;
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

        -- Determine transaction type
        transaction_type := CASE 
            WHEN credit_change > 0 THEN 'credit'
            ELSE 'debit'
        END;

        -- Record the transaction
        INSERT INTO credit_transactions (
            user_id,
            amount,
            type,
            description,
            event_id
        ) VALUES (
            target_user_id,
            ABS(credit_change),
            transaction_type,
            COALESCE(description, 
                CASE 
                    WHEN credit_change > 0 THEN 'Credits added'
                    ELSE 'Credits deducted for event creation'
                END
            ),
            event_id
        );

        RETURN true;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN false;
    END;
END;
$$;

-- Enable RLS on transactions table
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
    ON public.credit_transactions
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Add function to get user transactions
CREATE OR REPLACE FUNCTION public.get_user_transactions(p_user_id text)
RETURNS TABLE (
    id uuid,
    amount integer,
    type text,
    description text,
    event_id uuid,
    created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.amount,
        t.type,
        t.description,
        t.event_id,
        t.created_at
    FROM credit_transactions t
    WHERE t.user_id = p_user_id
    ORDER BY t.created_at DESC;
END;
$$; 
