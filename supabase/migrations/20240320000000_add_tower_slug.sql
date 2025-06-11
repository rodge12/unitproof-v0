-- Add tower_slug column
ALTER TABLE vacant_units ADD COLUMN tower_slug TEXT;

-- Create a function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing rows with generated slugs
UPDATE vacant_units
SET tower_slug = generate_slug(tower_name);

-- Create a unique index on tower_slug
CREATE UNIQUE INDEX idx_vacant_units_tower_slug ON vacant_units(tower_slug);

-- Add a trigger to automatically update tower_slug when tower_name changes
CREATE OR REPLACE FUNCTION update_tower_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tower_slug := generate_slug(NEW.tower_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tower_slug
  BEFORE INSERT OR UPDATE OF tower_name ON vacant_units
  FOR EACH ROW
  EXECUTE FUNCTION update_tower_slug(); 