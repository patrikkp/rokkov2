-- Add in-app notifications and claim deadline notice to user_settings
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS in_app_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS claim_days INTEGER NOT NULL DEFAULT 7;

COMMENT ON COLUMN user_settings.in_app_enabled IS 'Whether to show in-app notification banners';
COMMENT ON COLUMN user_settings.claim_days IS 'Days before claim deadline to send notification';
