
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_socketio import SocketIO
from transformers import AutoTokenizer, AutoModelForCausalLM
from core.station_manager import StationManager
from core.task_manager import TaskManager
from core.audit_logger import audit_logger
import os

# Optional memory hooks
save_interaction = lambda user, assistant: None
retrieve_recent_memories = lambda: []

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abd_alrhman_secret_key'
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

ALLOWED_ORIGIN = "https://abd-alrhman-frontend.vercel.app"

# Initialize managers
station_manager = StationManager()
task_manager = TaskManager(station_manager, socketio)

# Model lazy-load
model = None
tokenizer = None

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "POST,OPTIONS"
    return response

@app.route("/api", methods=["OPTIONS"])
def handle_options():
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "POST,OPTIONS"
    return response, 204

@app.route("/api", methods=["POST"])
def api():
    global model, tokenizer

    if model is None or tokenizer is None:
        print("🚀 Loading model to CUDA...")
        model_name = "Qwen/Qwen-7B-Chat"
        tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True).cuda()

    try:
        data = request.get_json()
        msg = data.get("message", "")
        if not msg:
            return jsonify({"error": "Empty message"}), 400

        memory_context = "\n".join(
            [f"user: {u}\nassistant: {a}" for u, a in reversed(retrieve_recent_memories())]
        )
        memory_lines = memory_context.strip().split("\n")[-2:]
        memory_context_trimmed = "\n".join(memory_lines)

        PERSONALITY = """You are Abd al-Rahman, an intelligent assistant who speaks and thinks like Mahmoud.
You are sharp, strategic, honest, and to-the-point. You avoid fluff.
You speak clearly in Arabic or English as needed, with warmth but precision.
You prefer concise and deep responses and always aim for meaningful output."""

        full_prompt = f"{PERSONALITY}\n{memory_context_trimmed}\nuser: {msg}\nassistant:"
        input_ids = tokenizer(full_prompt, return_tensors="pt").input_ids.cuda()
        output = model.generate(input_ids, max_new_tokens=200)
        response_text = tokenizer.decode(output[0], skip_special_tokens=True)
        answer = response_text.split("assistant:")[-1].strip()

        save_interaction(msg, answer)
        return jsonify({"response": answer})

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

# ========== STATION API ==========

@app.route("/api/station/<station_name>", methods=["POST"])
def call_station(station_name):
    data = request.json
    result = station_manager.execute_station(station_name, data)
    return jsonify(result)

# ========== TASK MANAGER API ==========

@app.route("/api/task/<station_name>", methods=["POST"])
def create_task(station_name):
    data = request.get_json()
    task_id = task_manager.add_task(station_name, data, created_by="api")
    return jsonify({"task_id": task_id}), 201

@app.route("/api/task/<task_id>", methods=["GET"])
def get_task(task_id):
    task = task_manager.get_task(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task)

@app.route("/api/tasks", methods=["GET"])
def list_tasks():
    return jsonify(task_manager.get_all_tasks())

# ========== AUDIT LOGGER API ==========

@app.route("/api/audit", methods=["GET"])
def get_audit_logs():
    logs = audit_logger.get_logs(limit=100)
    return jsonify([
        {
            "timestamp": row[0],
            "username": row[1],
            "action": row[2],
            "target": row[3],
            "status": row[4],
            "details": row[5],
        } for row in logs
    ])

# ========== WebSocket ==========

@socketio.on('connect')
def handle_connect():
    print("🧠 WebSocket client connected")
    for task in task_manager.get_all_tasks():
        socketio.emit('task_update', task)

# ========== RUN ==========

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)

