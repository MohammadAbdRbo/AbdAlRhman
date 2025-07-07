from tools.time_context import extract_time_context

class Station:
    STATION_NAME = "time"
    STATION_DESCRIPTION = "Extracts time context from text"
    VERSION = "1.0"

    def process(self, data):
        text = data.get("text")
        if not text:
            return {"status": "error", "message": "Missing 'text' in request data"}

        try:
            time_info = extract_time_context(text)
            return {"status": "success", "time_context": time_info}
        except Exception as e:
            return {"status": "error", "message": f"Failed to extract time context: {str(e)}"}

