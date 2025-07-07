from core.model import load_qwen, model_chat_with_qwen
from core.audit_logger import audit_logger
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel, PeftConfig
import os
import torch

BASE_MODEL_NAME = "Qwen/Qwen-7B"
LORA_PATH = "core/auto_lora_trainer/lora_output"

def load_qwen():
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME, trust_remote_code=True)

    try:
        if os.path.exists(os.path.join(LORA_PATH, "adapter_config.json")):
            print("📦 Loading Qwen-7B with LoRA adapter...")
            base_model = AutoModelForCausalLM.from_pretrained(
                BASE_MODEL_NAME,
                device_map="auto",
                torch_dtype=torch.float16,
                trust_remote_code=True
            )
            config = PeftConfig.from_pretrained(LORA_PATH)
            model = PeftModel.from_pretrained(base_model, LORA_PATH)
        else:
            raise FileNotFoundError("No LoRA adapter found.")

    except Exception as e:
        print(f"⚠️ Loading base Qwen-7B model only: {e}")
        model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_NAME,
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True
        )

    return model, tokenizer

class Station:
    def __init__(self):
        # Load the model and tokenizer once per instance
        self.model, self.tokenizer = load_qwen()

    def process(self, data):
        try:
            username = data.get("username", "unknown")
            task_data = data.get("task_data", {})
            prompt = task_data.get("prompt", "")

            if not prompt:
                return {
                    "status": "error",
                    "message": "No prompt provided"
                }

            # Generate response using high-level model function
            reply = model_chat_with_qwen(self.model, self.tokenizer, prompt)

            return {
                "status": "success",
                "response": reply
            }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

