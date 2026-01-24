-- Create storage bucket for reference images
INSERT INTO storage.buckets (id, name, public)
VALUES ('reference-images', 'reference-images', true);

-- Allow anyone to upload reference images (public cake configurator)
CREATE POLICY "Anyone can upload reference images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'reference-images');

-- Allow anyone to view reference images
CREATE POLICY "Reference images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'reference-images');

-- Allow anyone to delete their uploaded images (within session)
CREATE POLICY "Anyone can delete reference images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'reference-images');