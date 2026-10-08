-- Create storage bucket for SOPs
INSERT INTO storage.buckets (id, name, public)
VALUES ('sops', 'sops', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for SOPs bucket
CREATE POLICY "Users can upload their own SOPs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'sops' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own SOPs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'sops' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own SOPs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'sops' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own SOPs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'sops' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
