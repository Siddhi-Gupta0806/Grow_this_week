import sqlite3
import json
import os
from typing import List, Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "growthisweek.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # User Profile Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY DEFAULT 1,
        city TEXT DEFAULT 'Mumbai',
        lat REAL DEFAULT 19.0760,
        lon REAL DEFAULT 72.8777,
        garden_type TEXT DEFAULT 'balcony',
        experience_level TEXT DEFAULT 'beginner',
        sunlight_hours TEXT DEFAULT '4-6 hours',
        pot_sizes TEXT DEFAULT '["10-inch","12-inch"]',
        organic_only INTEGER DEFAULT 1,
        language TEXT DEFAULT 'en'
    )
    """)

    # Ensure single profile row exists
    cursor.execute("SELECT COUNT(*) FROM user_profile")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO user_profile (id) VALUES (1)")

    # My Garden Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS my_garden (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_name TEXT NOT NULL,
        planted_date TEXT NOT NULL,
        location TEXT DEFAULT 'balcony',
        notes TEXT DEFAULT '',
        status TEXT DEFAULT 'active'
    )
    """)

    # Harvest Journal Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS harvest_journal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_name TEXT NOT NULL,
        harvest_date TEXT NOT NULL,
        weight_grams REAL NOT NULL,
        notes TEXT DEFAULT ''
    )
    """)

    # Local Memory Store (Fallback for Backboard)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memory_store (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT DEFAULT 'default_user',
        memory_key TEXT NOT NULL,
        memory_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # AI Call Telemetry Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_telemetry (
        id TEXT PRIMARY KEY,
        endpoint TEXT NOT NULL,
        model_used TEXT NOT NULL,
        latency_ms REAL NOT NULL,
        input_tokens INTEGER DEFAULT 0,
        output_tokens INTEGER DEFAULT 0,
        fallback_used INTEGER DEFAULT 0,
        status TEXT DEFAULT 'success',
        timestamp TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

# Initialize DB structure at module load
init_db()

# --- Profile Repository ---
def get_user_profile() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_profile WHERE id=1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "city": row["city"],
            "lat": row["lat"],
            "lon": row["lon"],
            "garden_type": row["garden_type"],
            "experience_level": row["experience_level"],
            "sunlight_hours": row["sunlight_hours"],
            "pot_sizes": json.loads(row["pot_sizes"] or '[]'),
            "organic_only": bool(row["organic_only"]),
            "language": row["language"]
        }
    return {}

def update_user_profile(profile_data: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE user_profile SET
        city = ?, lat = ?, lon = ?, garden_type = ?, experience_level = ?,
        sunlight_hours = ?, pot_sizes = ?, organic_only = ?, language = ?
    WHERE id = 1
    """, (
        profile_data.get("city", "Mumbai"),
        profile_data.get("lat", 19.0760),
        profile_data.get("lon", 72.8777),
        profile_data.get("garden_type", "balcony"),
        profile_data.get("experience_level", "beginner"),
        profile_data.get("sunlight_hours", "4-6 hours"),
        json.dumps(profile_data.get("pot_sizes", ["10-inch"])),
        1 if profile_data.get("organic_only", True) else 0,
        profile_data.get("language", "en")
    ))
    conn.commit()
    conn.close()

# --- Garden Repository ---
def list_garden_items() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM my_garden WHERE status='active' ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "plant_name": r["plant_name"],
            "planted_date": r["planted_date"],
            "location": r["location"],
            "notes": r["notes"]
        })
    return result

def add_garden_item(item: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO my_garden (plant_name, planted_date, location, notes)
    VALUES (?, ?, ?, ?)
    """, (item["plant_name"], item["planted_date"], item.get("location", "balcony"), item.get("notes", "")))
    conn.commit()
    item_id = cursor.lastrowid
    conn.close()
    return item_id

def delete_garden_item(item_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE my_garden SET status='deleted' WHERE id=?", (item_id,))
    conn.commit()
    conn.close()

# --- Harvest Journal Repository ---
def list_harvest_entries() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM harvest_journal ORDER BY harvest_date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [{
        "id": r["id"],
        "plant_name": r["plant_name"],
        "harvest_date": r["harvest_date"],
        "weight_grams": r["weight_grams"],
        "notes": r["notes"]
    } for r in rows]

def add_harvest_entry(entry: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO harvest_journal (plant_name, harvest_date, weight_grams, notes)
    VALUES (?, ?, ?, ?)
    """, (entry["plant_name"], entry["harvest_date"], entry["weight_grams"], entry.get("notes", "")))
    conn.commit()
    entry_id = cursor.lastrowid
    conn.close()
    return entry_id

# --- Telemetry Repository ---
def save_telemetry_log(log_data: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO ai_telemetry (id, endpoint, model_used, latency_ms, input_tokens, output_tokens, fallback_used, status, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        log_data["id"],
        log_data["endpoint"],
        log_data["model_used"],
        log_data["latency_ms"],
        log_data.get("input_tokens", 0),
        log_data.get("output_tokens", 0),
        1 if log_data.get("fallback_used", False) else 0,
        log_data.get("status", "success"),
        log_data["timestamp"]
    ))
    conn.commit()
    conn.close()

def get_telemetry_logs(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ai_telemetry ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [{
        "id": r["id"],
        "endpoint": r["endpoint"],
        "model_used": r["model_used"],
        "latency_ms": r["latency_ms"],
        "input_tokens": r["input_tokens"],
        "output_tokens": r["output_tokens"],
        "fallback_used": bool(r["fallback_used"]),
        "status": r["status"],
        "timestamp": r["timestamp"]
    } for r in rows]
