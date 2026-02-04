-- Fix #1: Update profiles RLS policies to explicitly require authentication
-- This ensures anonymous users cannot access profiles table

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Recreate with explicit authentication requirement
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate with explicit authentication requirement
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Drop existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate with explicit authentication requirement
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix #2: Update cake_orders SELECT policy to explicitly require admin authentication
-- The admin-only policies already use has_role() but adding explicit TO authenticated makes it clearer

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Admins can view all orders" ON public.cake_orders;

-- Recreate with explicit authentication requirement
CREATE POLICY "Admins can view all orders"
  ON public.cake_orders
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Drop existing UPDATE policy
DROP POLICY IF EXISTS "Admins can update orders" ON public.cake_orders;

-- Recreate with explicit authentication requirement
CREATE POLICY "Admins can update orders"
  ON public.cake_orders
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Drop existing DELETE policy
DROP POLICY IF EXISTS "Admins can delete orders" ON public.cake_orders;

-- Recreate with explicit authentication requirement
CREATE POLICY "Admins can delete orders"
  ON public.cake_orders
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));