from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import re

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_qwen():
    model = AutoModelForCausalLM.from_pretrained(
        "Qwen/Qwen-7B-Chat",
        trust_remote_code=True,
        torch_dtype=torch.bfloat16
    ).to(device)

    tokenizer = AutoTokenizer.from_pretrained(
        "Qwen/Qwen-7B-Chat",
        trust_remote_code=True
    )
    return model, tokenizer

def model_chat_with_qwen(model, tokenizer, prompt):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=64,
        temperature=0.7,
        top_p=0.9,
        do_sample=True
    )
    full_output = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Try to extract the assistant's response
    match = re.search(r"<\|assistant\|>\s*(.*)", full_output, re.DOTALL)
    if match:
        return match.group(1).strip()

    return full_output.strip().split("\n")[-1]

