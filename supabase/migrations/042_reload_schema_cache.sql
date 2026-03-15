-- Migration 042: Force PostgREST schema cache reload
-- This ensures PostgREST picks up all column changes from previous migrations
-- (particularly the description_en column and removal of old InfoSylvita columns)

-- Notify PostgREST to reload its schema cache immediately
NOTIFY pgrst, 'reload schema';
