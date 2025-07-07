import time
import os
from core.auto_lora_trainer.dataset_builder import build_dataset
from core.auto_lora_trainer.lora_trainer import train
from core.auto_lora_trainer.adapter_loader import load_model_with_lora

CHECK_INTERVAL = 300  # 5 دقائق بين كل فحص
LOADED_SAMPLES_FILE = "core/auto_lora_trainer/last_count.txt"

def get_last_count():
    if os.path.exists(LOADED_SAMPLES_FILE):
        with open(LOADED_SAMPLES_FILE, "r") as f:
            return int(f.read().strip())
    return 0

def save_last_count(count):
    with open(LOADED_SAMPLES_FILE, "w") as f:
        f.write(str(count))

def monitor_loop():
    print("🔁 Monitoring started...")
    while True:
        print("🔍 Checking for new data...")
        if build_dataset():  # إذا تم بناء dataset جديد
            print("📊 Starting fine-tuning...")
            train()

            print("🧠 Reloading LoRA into active model...")
            load_model_with_lora()

            print("✅ Fine-tune cycle complete.\n")
        else:
            print("ℹ️ Not enough new messages yet.\n")
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    monitor_loop()

