-- Add explicit UPDATE and DELETE policies for user_roles table
-- Following principle of least privilege - only admins can manage roles

-- Policy: Admins can update user roles
CREATE POLICY "Admins can update user roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can delete user roles  
CREATE POLICY "Admins can delete user roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));