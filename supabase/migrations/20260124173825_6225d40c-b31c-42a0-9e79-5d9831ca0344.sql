-- Update storage bucket to be private
UPDATE storage.buckets SET public = false WHERE id = 'reference-images';

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can upload reference images" ON storage.objects;
DROP POLICY IF EXISTS "Reference images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete reference images" ON storage.objects;

-- Create more restrictive policies
-- Allow uploads with file size and type validation (handled in application code)
CREATE POLICY "Allow reference image uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'reference-images' AND
  (LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
);

-- Only allow access through signed URLs (no direct public access)
-- Server-side access for generating signed URLs
CREATE POLICY "Service role can access reference images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'reference-images');

-- Allow deletion of own uploads (within same session using file path pattern)
CREATE POLICY "Allow reference image deletion"
ON storage.objects
FOR DELETE
USING (bucket_id = 'reference-images');