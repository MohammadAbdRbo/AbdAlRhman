import threading
import time
import uuid
import traceback

class TaskManager:
    def __init__(self, station_manager, socketio=None):
        self.station_manager = station_manager
        self.socketio = socketio
        self.tasks = {}
        self.task_queue = []
        self.lock = threading.Lock()
        self.worker_thread = threading.Thread(target=self._worker, daemon=True)
        self.worker_thread.start()

    def add_task(self, station, data, created_by="system"):
        task_id = f"task_{uuid.uuid4().hex[:8]}"
        task = {
            "id": task_id,
            "station": station,
            "data": data,
            "status": "pending",
            "created_by": created_by,
            "logs": [],
            "result": None,
            "created_at": time.time()
        }
        with self.lock:
            self.tasks[task_id] = task
            self.task_queue.append(task_id)
        return task_id

    def get_task(self, task_id):
        with self.lock:
            return self.tasks.get(task_id)

    def get_all_tasks(self):
        with self.lock:
            return list(self.tasks.values())

    def _worker(self):
        while True:
            task_id = None
            with self.lock:
                if self.task_queue:
                    task_id = self.task_queue.pop(0)

            if task_id:
                self._process_task(task_id)
            else:
                time.sleep(0.5)

    def _process_task(self, task_id):
        with self.lock:
            task = self.tasks.get(task_id)
            if not task:
                return
            task["status"] = "running"
            task["logs"].append("Started execution")

        try:
            result = self.station_manager.execute_station(task["station"], task["data"])
            with self.lock:
                task["result"] = result
                task["status"] = "completed" if result.get("status") == "success" else "error"
                task["logs"].append("Finished execution")

            # Optional: emit result to client via SocketIO
            if self.socketio:
                self.socketio.emit("task_update", {
                    "task_id": task_id,
                    "status": task["status"],
                    "result": task["result"]
                })

        except Exception as e:
            with self.lock:
                task["status"] = "error"
                task["logs"].append(f"Exception: {str(e)}")
                task["result"] = {
                    "status": "error",
                    "message": str(e),
                    "traceback": traceback.format_exc()
                }

            if self.socketio:
                self.socketio.emit("task_update", {
                    "task_id": task_id,
                    "status": "error",
                    "error": str(e)
                })

