from core.qwen_loader import load_qwen, model_chat_with_qwen
from core.audit_logger import audit_logger


class Station:
    def __init__(self):
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

