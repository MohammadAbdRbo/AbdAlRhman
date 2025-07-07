import sqlite3
import json
import os

DATASET_PATH = "core/auto_lora_trainer/fine_tune_dataset.jsonl"
DB_PATH = "memory.db"

def extract_conversations(limit=500):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.execute("SELECT user, assistant FROM memory ORDER BY id DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    
    samples = []
    for user_msg, assistant_reply in rows:
        if user_msg and assistant_reply:
            samples.append({
                "instruction": user_msg.strip(),
                "input": "",
                "output": assistant_reply.strip()
            })
    return samples

def save_dataset(samples):
    os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
    with open(DATASET_PATH, "w", encoding="utf-8") as f:
        for item in samples:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")
    print(f"✅ Saved {len(samples)} samples to {DATASET_PATH}")

def build_dataset():
    samples = extract_conversations(limit=500)
    if len(samples) >= 50:
        save_dataset(samples)
        return True
    else:
        print(f"ℹ️ Not enough samples to fine-tune ({len(samples)} found).")
        return False

if __name__ == "__main__":
    build_dataset()

