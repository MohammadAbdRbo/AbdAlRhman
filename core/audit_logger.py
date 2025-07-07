import sqlite3
import os
from datetime import datetime

AUDIT_DB = os.path.join(os.path.dirname(__file__), "../audit.db")

class AuditLogger:
    def __init__(self, db_path=AUDIT_DB):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self._create_table()

    def _create_table(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                username TEXT,
                action TEXT,
                target TEXT,
                status TEXT,
                details TEXT
            )
        ''')
        self.conn.commit()

    def log_action(self, username, action, target, status, details=""):
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO audit_log (timestamp, username, action, target, status, details)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (datetime.now().isoformat(), username, action, target, status, details))
        self.conn.commit()

    def get_logs(self, limit=100):
        cursor = self.conn.cursor()
        cursor.execute('''
            SELECT timestamp, username, action, target, status, details
            FROM audit_log
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (limit,))
        return cursor.fetchall()

# Singleton instance
audit_logger = AuditLogger()

