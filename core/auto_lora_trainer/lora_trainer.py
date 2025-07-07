import os
import json
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer, DataCollatorForLanguageModeling
from peft import LoraConfig, get_peft_model

MODEL_NAME = "Qwen/Qwen-7B"
DATASET_PATH = "core/auto_lora_trainer/fine_tune_dataset.jsonl"
OUTPUT_DIR = "core/auto_lora_trainer/lora_output"

def load_training_data(path):
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        data = [json.loads(line) for line in lines]

    prompts = []
    for item in data:
        prompts.append({
            "text": f"user: {item['instruction']}\nassistant: {item['output']}"
        })

    return Dataset.from_list(prompts)

def train():
    dataset = load_training_data(DATASET_PATH)

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        device_map="auto",
        torch_dtype="auto",  # يستخدم fp16 أو bf16 حسب المتاح
        trust_remote_code=True
    )

    lora_config = LoraConfig(
        r=8,
        lora_alpha=32,
        target_modules=["c_proj", "w1", "w2", "o_proj"],  # قد تحتاج تعديل حسب Qwen
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )
    model = get_peft_model(model, lora_config)

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        num_train_epochs=3,
        learning_rate=2e-4,
        logging_dir=os.path.join(OUTPUT_DIR, "logs"),
        save_strategy="epoch",
        save_total_limit=1,
        report_to="none"
    )

    data_collator = DataCollatorForLanguageModeling(tokenizer, mlm=False)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
        tokenizer=tokenizer,
        data_collator=data_collator
    )

    trainer.train()
    model.save_pretrained(OUTPUT_DIR)
    print(f"✅ LoRA adapter saved to {OUTPUT_DIR}")

if __name__ == "__main__":
    train()

