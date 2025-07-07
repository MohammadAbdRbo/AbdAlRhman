from tools.summarizer import summarize_page as summarize_url


class Station:
    STATION_NAME = "summarizer"
    STATION_DESCRIPTION = "Summarizes web page content"
    VERSION = "1.0"

    def process(self, data):
        url = data.get("url")

        if not url:
            return {
                "status": "error",
                "message": "Missing 'url' in request data"
            }

        try:
            summary = summarize_url(url)
            return {
                "status": "success",
                "summary": summary
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to summarize: {str(e)}"
            }

