from peft import PeftModel, PeftConfig
from transformers import AutoTokenizer, AutoModelForCausalLM

LORA_PATH = "core/auto_lora_trainer/lora_output"
BASE_MODEL_NAME = "Qwen/Qwen-7B"

def load_model_with_lora():
    # Step 1: Load base model
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME, trust_remote_code=True)
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_NAME,
        device_map="auto",
        torch_dtype="auto",
        trust_remote_code=True
    )

    # Step 2: Load LoRA adapter
    config = PeftConfig.from_pretrained(LORA_PATH)
    model = PeftModel.from_pretrained(base_model, LORA_PATH)

    print("✅ Loaded LoRA adapter into base model successfully.")
    return model, tokenizer

