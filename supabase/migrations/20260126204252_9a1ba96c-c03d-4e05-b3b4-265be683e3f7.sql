-- Fix #1: Add admin-only policies for role management on user_roles table
-- This allows admins to manage roles while keeping the default-deny approach

-- Policy for admins to assign roles (INSERT)
CREATE POLICY "Only admins can assign roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy for admins to update roles (UPDATE)
CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy for admins to revoke roles (DELETE)
CREATE POLICY "Only admins can revoke roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix #3: Update the SELECT policy to explicitly require authentication
-- First drop the existing policy
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Recreate with explicit authentication requirement
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);