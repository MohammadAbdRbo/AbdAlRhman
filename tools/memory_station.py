from tools.memory_manager import save_interaction, retrieve_recent_memories

class Station:
    STATION_NAME = "memory"
    STATION_DESCRIPTION = "Handles dynamic memory operations"
    VERSION = "1.0"

    def process(self, data):
        action = data.get("action")

        if action == "save":
            user_input = data.get("user")
            assistant_reply = data.get("assistant")
            if not user_input or not assistant_reply:
                return {"status": "error", "message": "Missing 'user' or 'assistant' fields"}
            try:
                save_interaction(user_input, assistant_reply)
                return {"status": "success", "message": "Interaction saved"}
            except Exception as e:
                return {"status": "error", "message": f"Save failed: {str(e)}"}

        elif action == "load":
            try:
                memories = retrieve_recent_memories()
                return {"status": "success", "memories": memories}
            except Exception as e:
                return {"status": "error", "message": f"Load failed: {str(e)}"}

        else:
            return {"status": "error", "message": "Unsupported action"}

