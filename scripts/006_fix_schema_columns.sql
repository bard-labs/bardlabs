-- Add file_url column to sops if it doesn't exist
ALTER TABLE sops
ADD COLUMN IF NOT EXISTS file_url text;

-- Make email column in outreaches nullable
ALTER TABLE outreaches
ALTER COLUMN email DROP NOT NULL;
