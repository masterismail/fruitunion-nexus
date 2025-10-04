-- Assign admin role to mohammedismail523261@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('5e473783-931a-4207-912d-df436777bdce', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Create profiles for delivery partner (will be created on signup via trigger)
-- The mi523261@gmail.com user needs to sign up first, then we'll assign the delivery_partner role

-- For now, let's create a way to easily assign delivery_partner role after signup
-- This comment serves as a reminder that after mi523261@gmail.com signs up, 
-- we need to run an update to assign the delivery_partner role and create delivery_partners entry