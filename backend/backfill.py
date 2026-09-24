import sqlite3
import datetime
from ai_provider import get_ai_provider

def migrate_and_backfill():
    conn = sqlite3.connect("sql_app.db")
    cursor = conn.cursor()
    
    # Check existing columns
    cursor.execute("PRAGMA table_info(complaints)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if "ai_risk" in columns:
        try:
            cursor.execute("ALTER TABLE complaints RENAME COLUMN ai_risk TO riskLevel;")
            cursor.execute("ALTER TABLE complaints RENAME COLUMN ai_reason TO riskReason;")
            cursor.execute("ALTER TABLE complaints ADD COLUMN analyzedAt DATETIME;")
            conn.commit()
            print("Renamed ai_risk to riskLevel, added analyzedAt")
        except Exception as e:
            print("Error altering table:", e)
    
    # Backfill
    cursor.execute("SELECT id, title, description, riskLevel FROM complaints WHERE riskLevel IS NULL OR riskLevel = ''")
    rows = cursor.fetchall()
    
    if not rows:
        print("No complaints need backfilling.")
    else:
        ai = get_ai_provider()
        for row in rows:
            c_id, title, desc, _ = row
            print(f"Backfilling {c_id}...")
            try:
                triage = ai.triage_complaint(str(title) + " " + str(desc))
                risk = triage.get("risk_level", "FAILED")
                reason = triage.get("reason", "Analysis Failed")
                priority = triage.get("priority", "LOW")
                now = datetime.datetime.utcnow().isoformat()
                
                cursor.execute("""
                    UPDATE complaints 
                    SET riskLevel = ?, riskReason = ?, priority = ?, analyzedAt = ? 
                    WHERE id = ?
                """, (risk, reason, priority, now, c_id))
                print(f" -> {risk}")
            except Exception as e:
                print(f"Failed to backfill {c_id}: {e}")
                cursor.execute("""
                    UPDATE complaints 
                    SET riskLevel = 'FAILED', riskReason = 'Analysis Failed' 
                    WHERE id = ?
                """, (c_id,))
        conn.commit()
        print("Backfill complete.")

if __name__ == "__main__":
    migrate_and_backfill()
