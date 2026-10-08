-- Add missing columns to existing tables

-- Add description to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description text;

-- Add description to sops table
ALTER TABLE sops ADD COLUMN IF NOT EXISTS description text;

-- Rename target_email to contact_link in outreaches table (or add it as a new column since target_email exists)
ALTER TABLE outreaches ADD COLUMN IF NOT EXISTS contact_link text;

-- Add username to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;
