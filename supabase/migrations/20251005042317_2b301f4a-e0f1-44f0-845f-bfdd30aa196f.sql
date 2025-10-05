-- Create delivery partner test account and assign role
-- First, we need to insert into auth.users, but since we can't directly access auth schema,
-- we'll create a function that the admin can call to create customer accounts

-- Create function to create customer account (username/password based)
CREATE OR REPLACE FUNCTION public.create_customer_account(
  p_username TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_phone TEXT DEFAULT NULL,
  p_subscription_plan TEXT DEFAULT 'basic'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_customer_id uuid;
BEGIN
  -- Create auth user with username as email (username@internal.local)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_username || '@internal.local',
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    json_build_object('full_name', p_full_name, 'username', p_username),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO v_user_id;

  -- Create profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (v_user_id, p_full_name, p_phone);

  -- Assign customer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'customer'::app_role);

  -- Create customer record
  INSERT INTO public.customers (
    user_id,
    subscription_plan,
    subscription_status,
    subscription_start_date,
    subscription_end_date,
    next_payment_date
  ) VALUES (
    v_user_id,
    p_subscription_plan,
    'inactive',
    now(),
    now() + interval '30 days',
    now() + interval '30 days'
  )
  RETURNING id INTO v_customer_id;

  RETURN v_user_id;
END;
$$;

-- Update RLS policies to allow admins to insert customers
DROP POLICY IF EXISTS "Admins can insert customers" ON public.customers;
CREATE POLICY "Admins can insert customers"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert delivery partners
DROP POLICY IF EXISTS "Admins can insert delivery partners" ON public.delivery_partners;
CREATE POLICY "Admins can insert delivery partners"
ON public.delivery_partners
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update delivery partners
DROP POLICY IF EXISTS "Admins can update delivery partners" ON public.delivery_partners;
CREATE POLICY "Admins can update delivery partners"
ON public.delivery_partners
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow delivery partners to view all customers
DROP POLICY IF EXISTS "Delivery partners can view all customers" ON public.customers;
CREATE POLICY "Delivery partners can view all customers"
ON public.customers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'delivery_partner'::app_role));

-- Add payment tracking columns to customers table
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS payment_history JSONB DEFAULT '[]'::jsonb;

-- Add comment for the delivery partner test account
COMMENT ON FUNCTION public.create_customer_account IS 'Admin function to create customer accounts with username/password. Test delivery partner: mohdismail.dev@gmail.com / 123456';