from core.audit_logger import audit_logger

import os
import importlib.util
import inspect
import traceback
import logging
import json

logger = logging.getLogger("StationManager")


class StationManager:
    def __init__(self, stations_folder="tools"):
        self.stations = {}
        self.stations_folder = stations_folder
        self.load_all_stations()

    def load_all_stations(self):
        if not os.path.exists(self.stations_folder):
            logger.warning(f"📁 Stations folder does not exist: {self.stations_folder}")
            return

        for file in os.listdir(self.stations_folder):
            if file.endswith("_station.py"):
                station_name = file.replace("_station.py", "")
                try:
                    path = os.path.join(self.stations_folder, file)
                    spec = importlib.util.spec_from_file_location(f"{self.stations_folder}.{station_name}", path)
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)

                    for name, obj in inspect.getmembers(module):
                        if name == "Station" and inspect.isclass(obj):
                            self.stations[station_name] = obj
                            logger.info(f"🚀 Loaded station: {station_name}")
                            break
                except Exception as e:
                    logger.error(f"❌ Failed to load station {station_name}: {str(e)}")

    def execute_station(self, station_name, data):
        station_class = self.stations.get(station_name)
        if not station_class:
            return {
                "status": "error",
                "message": f"Station '{station_name}' not found"
            }

        try:
            username = data.get("username", "unknown")
            task_data = data.get("task_data", {})

            # Log execution start
            audit_logger.log_action(username, f"execute_{station_name}", task_data.get("target", ""), "started")

            instance = station_class()
            result = instance.process(data)

            # Log execution result
            audit_logger.log_action(
                username,
                f"execute_{station_name}",
                task_data.get("target", ""),
                result.get("status", "unknown"),
                json.dumps(result)
            )
            return result

        except Exception as e:
            audit_logger.log_action(
                username,
                f"execute_{station_name}",
                task_data.get("target", ""),
                "error",
                str(e)
            )
            return {
                "status": "error",
                "message": f"An error occurred while executing the station: {str(e)}",
                "traceback": traceback.format_exc()
            }

