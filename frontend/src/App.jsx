import React, { useState, useEffect } from "react";
import { MessageCircle, CheckSquare, Radio, FileText, Send, Play, RefreshCw } from "lucide-react";

const API_BASE = "https://abdalrhman.duckdns.org/api";

// Chat Page Component
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "User",
      message: newMessage,
      time: new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setNewMessage("");

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      const data = await res.json();
      const botMessage = {
        id: Date.now() + 1,
        sender: "System",
        message: data.response || data.error || "No response",
        time: new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "System",
          message: "Connection error",
          time: new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f9fafb" }}>
      <div style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
          <MessageCircle style={{ width: "20px", height: "20px" }} />
          Chat
        </h2>
      </div>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.sender === "User" ? "flex-end" : "flex-start",
              marginBottom: "16px"
            }}
          >
            <div
              style={{
                maxWidth: "300px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: msg.sender === "User" ? "#2563eb" : "white",
                color: msg.sender === "User" ? "white" : "#1f2937",
                border: msg.sender === "User" ? "none" : "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <p style={{ fontSize: "14px", margin: 0, marginBottom: "4px" }}>{msg.message}</p>
              <p style={{ fontSize: "12px", margin: 0, opacity: 0.7 }}>{msg.time}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              backgroundColor: "white",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              padding: "12px 16px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <RefreshCw style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "14px" }}>System is typing...</span>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ padding: "24px", backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px"
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
          <button
            onClick={handleSendMessage}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
          >
            <Send style={{ width: "16px", height: "16px" }} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Tasks Page
const TasksPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(API_BASE + "/tasks")
      .then((res) => res.json())
      .then(setTasks)
      .catch(() => setTasks([]));
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "running":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "pending":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "failed":
        return { backgroundColor: "#fecaca", color: "#991b1b" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100%" }}>
      <div style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
          <CheckSquare style={{ width: "20px", height: "20px" }} />
          Tasks
        </h2>
      </div>
      
      <div style={{ padding: "24px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ID
                </th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Station
                </th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Status
                </th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Progress
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "white" }}>
              {tasks.map((task, index) => (
                <tr key={task.id} style={{ borderTop: index > 0 ? "1px solid #e5e7eb" : "none" }}>
                  <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>
                    {task.id}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1f2937" }}>
                    {task.station}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      ...getStatusStyle(task.status),
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      borderRadius: "9999px",
                      display: "inline-block"
                    }}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1f2937" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: "9999px", height: "8px", marginRight: "8px" }}>
                        <div
                          style={{
                            backgroundColor: "#2563eb",
                            height: "8px",
                            borderRadius: "9999px",
                            width: `${task.progress}%`,
                            transition: "width 0.3s ease"
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>{task.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stations Page
const StationsPage = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch(API_BASE + "/stations")
      .then((res) => res.json())
      .then(setStations)
      .catch(() => setStations([]));
  }, []);

  const triggerStation = async (name) => {
    await fetch(API_BASE + "/station/" + name, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "manual_trigger" }),
    });
  };

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100%" }}>
      <div style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
          <Radio style={{ width: "20px", height: "20px" }} />
          Stations
        </h2>
      </div>
      
      <div style={{ padding: "24px" }}>
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {stations.map((station) => (
            <div key={station.name} style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#1f2937", margin: 0 }}>{station.name}</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
                    {station.description || "No description available"}
                  </p>
                </div>
                <button
                  onClick={() => triggerStation(station.name)}
                  style={{
                    marginLeft: "16px",
                    backgroundColor: "#059669",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#047857"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#059669"}
                >
                  <Play style={{ width: "16px", height: "16px" }} />
                  Trigger
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Audit Logs Page
const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(API_BASE + "/audit")
      .then((res) => res.json())
      .then(setLogs)
      .catch(() => setLogs([]));
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "failed":
      case "error":
        return { backgroundColor: "#fecaca", color: "#991b1b" };
      case "warning":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100%" }}>
      <div style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
          <FileText style={{ width: "20px", height: "20px" }} />
          Audit Logs
        </h2>
      </div>
      
      <div style={{ padding: "24px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Time
                </th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  User
                </th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Action
                </th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "white" }}>
              {logs.map((log, index) => (
                <tr key={log.timestamp} style={{ borderTop: index > 0 ? "1px solid #e5e7eb" : "none" }}>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1f2937" }}>
                    {log.timestamp}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1f2937" }}>
                    {log.username}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1f2937" }}>
                    {log.action}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      ...getStatusStyle(log.status),
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      borderRadius: "9999px",
                      display: "inline-block"
                    }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// App Root
const App = () => {
  const [page, setPage] = useState("chat");

  const renderPage = () => {
    switch (page) {
      case "chat":
        return <ChatPage />;
      case "tasks":
        return <TasksPage />;
      case "stations":
        return <StationsPage />;
      case "logs":
        return <AuditLogsPage />;
      default:
        return <ChatPage />;
    }
  };

  const navItems = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "stations", label: "Stations", icon: Radio },
    { id: "logs", label: "Logs", icon: FileText },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f3f4f6" }}>
      <header style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", margin: 0 }}>Abd Al Rhman</h1>
            <nav style={{ display: "flex", gap: "8px" }}>
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPage(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    backgroundColor: page === id ? "#2563eb" : "transparent",
                    color: page === id ? "white" : "#6b7280"
                  }}
                  onMouseOver={(e) => {
                    if (page !== id) {
                      e.target.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (page !== id) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon style={{ width: "16px", height: "16px" }} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main style={{ flex: 1, overflow: "hidden" }}>{renderPage()}</main>
    </div>
  );
};

export default App;
