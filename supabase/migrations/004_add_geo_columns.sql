-- Add latitude and longitude to businesses for map display
alter table businesses
  add column if not exists latitude numeric(10, 6),
  add column if not exists longitude numeric(10, 6);
