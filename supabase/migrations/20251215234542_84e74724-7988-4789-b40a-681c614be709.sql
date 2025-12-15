-- Fix: Add RLS policy to prevent direct inserts to user_roles table
-- This blocks the privilege escalation vulnerability

CREATE POLICY "Deny direct role insertions" 
  ON public.user_roles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (false);

-- Create a secure function for first admin creation
-- This function is atomic and prevents race conditions
CREATE OR REPLACE FUNCTION public.create_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INT;
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Lock the table to prevent race conditions
  LOCK TABLE user_roles IN EXCLUSIVE MODE;
  
  -- Check if any admins exist
  SELECT COUNT(*) INTO admin_count FROM user_roles WHERE role = 'admin';
  
  IF admin_count > 0 THEN
    RETURN false; -- Admin already exists
  END IF;
  
  -- Insert admin role for current user
  INSERT INTO user_roles (user_id, role) VALUES (current_user_id, 'admin');
  
  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_first_admin() TO authenticated;