import json

def slugify(text):
    return (
        text.lower()
        .replace("&", "and")
        .replace(",", "")
        .replace(".", "")
        .replace("(", "")
        .replace(")", "")
        .replace("/", "-")
        .replace("’", "")
        .replace("'", "")
        .replace("’s", "")
        .replace("  ", " ")
        .strip()
        .replace(" ", "-")
    )

# Path to your JSON file
json_path = "public/data/vacant-units.json"

# Load the file
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Add slug to each record
for unit in data:
    tower_name = unit.get("Tower Name", "")
    unit["tower_slug"] = slugify(tower_name)

# Save updated file
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Slugs added to vacant-units.json")