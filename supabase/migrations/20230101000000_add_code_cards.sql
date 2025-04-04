-- Add new columns to the cards table to support code cards
ALTER TABLE cards
ADD COLUMN question TEXT,
ADD COLUMN code TEXT,
ADD COLUMN expected_output TEXT;

-- Add a type column to distinguish between card types
ALTER TABLE cards
ADD COLUMN type TEXT DEFAULT 'text';

-- Update existing cards to have the 'text' type
UPDATE cards
SET type = 'text'
WHERE type IS NULL;

-- Create a function to automatically set the type based on the presence of fields
CREATE OR REPLACE FUNCTION set_card_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.front IS NOT NULL AND NEW.back IS NOT NULL THEN
    NEW.type := 'text';
  ELSIF NEW.question IS NOT NULL AND NEW.code IS NOT NULL THEN
    NEW.type := 'code';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set the card type
CREATE TRIGGER set_card_type_trigger
BEFORE INSERT OR UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION set_card_type(); 