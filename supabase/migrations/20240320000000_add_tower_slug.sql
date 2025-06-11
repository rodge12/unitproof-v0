-- Add tower_slug column
ALTER TABLE vacant_units ADD COLUMN tower_slug TEXT;

-- Create a function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(name, '[&,]', ' and ', 'g'),
                '[^a-zA-Z0-9\s-]', '', 'g'
            ),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- First, update all rows with basic slugs
UPDATE vacant_units
SET tower_slug = generate_slug(tower_name);

-- Handle duplicates by adding a unique identifier
WITH duplicates AS (
    SELECT tower_slug, COUNT(*) as count
    FROM vacant_units
    GROUP BY tower_slug
    HAVING COUNT(*) > 1
)
UPDATE vacant_units vu
SET tower_slug = vu.tower_slug || '-' || ROW_NUMBER() OVER (
    PARTITION BY vu.tower_slug 
    ORDER BY vu.tower_name, vu.unit_no
)
FROM duplicates d
WHERE vu.tower_slug = d.tower_slug;

-- Make tower_slug NOT NULL after populating
ALTER TABLE vacant_units ALTER COLUMN tower_slug SET NOT NULL;

-- Create a unique index on tower_slug
CREATE UNIQUE INDEX idx_vacant_units_tower_slug ON vacant_units(tower_slug);

-- Create a trigger to automatically update tower_slug when tower_name changes
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