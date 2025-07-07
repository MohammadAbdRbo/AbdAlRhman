from tools.intent_analyzer import detect_intent

class Station:
    STATION_NAME = "intent"
    STATION_DESCRIPTION = "Detects user intent from text"
    VERSION = "1.0"

    def process(self, data):
        text = data.get("text")
        if not text:
            return {"status": "error", "message": "Missing 'text' in request data"}

        try:
            intent = detect_intent(text)
            return {"status": "success", "intent": intent}
        except Exception as e:
            return {"status": "error", "message": f"Failed to detect intent: {str(e)}"}

