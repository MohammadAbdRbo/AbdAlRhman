import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Image, Link, Save, Trash2, Copy, Check, Download, Eye, EyeOff,
  MessageCircle, CheckSquare, Radio, FileText, Menu, Plus, Search,
  Settings, Bell, User, Filter, Calendar, Clock, AlertCircle, 
  CheckCircle, XCircle, Play, Pause, MoreVertical, Star, Edit3,
  Zap, Shield, Activity, Database, Wifi, WifiOff, RefreshCw,
  Archive, Bookmark, Share2, Flag, Volume2, VolumeX, Moon, Sun
} from 'lucide-react';

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [savedChats, setSavedChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSavedChats, setShowSavedChats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const [stationFilter, setStationFilter] = useState('all');
  const [logFilter, setLogFilter] = useState('all');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: ''
  });
  
  const [newStation, setNewStation] = useState({
    name: '',
    location: '',
    type: 'development'
  });

  const [tasks, setTasks] = useState([
    { id: 1, title: 'UI Testing Review', status: 'in-progress', priority: 'high', assignee: 'John Smith', dueDate: '2025-07-10', description: 'Comprehensive testing of the new user interface components and interactions', starred: true },
    { id: 2, title: 'Database Migration', status: 'completed', priority: 'medium', assignee: 'Sarah Johnson', dueDate: '2025-07-08', description: 'Migrate legacy database schema to new optimized structure', starred: false },
    { id: 3, title: 'Performance Optimization', status: 'pending', priority: 'high', assignee: 'Mike Chen', dueDate: '2025-07-15', description: 'Optimize application loading times and reduce bundle size', starred: true },
    { id: 4, title: 'Technical Documentation', status: 'in-progress', priority: 'low', assignee: 'Emma Wilson', dueDate: '2025-07-12', description: 'Create comprehensive documentation for new features and APIs', starred: false },
    { id: 5, title: 'Security Audit', status: 'pending', priority: 'urgent', assignee: 'David Brown', dueDate: '2025-07-09', description: 'Conduct thorough security assessment and vulnerability testing', starred: true }
  ]);

  const [stations, setStations] = useState([
    { id: 1, name: 'Main Development Server', status: 'online', location: 'Floor 3, Room 301', users: 12, lastUpdate: '2025-07-07 16:30', type: 'development', cpu: 45, memory: 67, disk: 23 },
    { id: 2, name: 'Testing Environment', status: 'maintenance', location: 'Floor 2, Room 205', users: 3, lastUpdate: '2025-07-07 14:15', type: 'testing', cpu: 0, memory: 0, disk: 45 },
    { id: 3, name: 'Production Server', status: 'online', location: 'Data Center A', users: 89, lastUpdate: '2025-07-07 16:45', type: 'production', cpu: 78, memory: 82, disk: 56 },
    { id: 4, name: 'Design Workstation', status: 'offline', location: 'Floor 4, Room 402', users: 0, lastUpdate: '2025-07-07 12:00', type: 'design', cpu: 0, memory: 0, disk: 12 },
    { id: 5, name: 'Analytics Server', status: 'online', location: 'Data Center B', users: 24, lastUpdate: '2025-07-07 16:40', type: 'analytics', cpu: 34, memory: 58, disk: 78 }
  ]);

  const [logs, setLogs] = useState([
    { id: 1, type: 'info', message: 'User John Smith logged into the system', timestamp: '2025-07-07 16:45:32', source: 'Auth Service', severity: 'low' },
    { id: 2, type: 'error', message: 'Database connection timeout occurred', timestamp: '2025-07-07 16:43:15', source: 'Database', severity: 'high' },
    { id: 3, type: 'warning', message: 'Server memory usage reached 85%', timestamp: '2025-07-07 16:40:22', source: 'System Monitor', severity: 'medium' },
    { id: 4, type: 'success', message: 'Data backup completed successfully', timestamp: '2025-07-07 16:35:10', source: 'Backup Service', severity: 'low' },
    { id: 5, type: 'info', message: 'Software update v2.1.3 installed', timestamp: '2025-07-07 16:30:05', source: 'Update Manager', severity: 'low' },
    { id: 6, type: 'error', message: 'Failed to send notification email', timestamp: '2025-07-07 16:25:18', source: 'Email Service', severity: 'medium' },
    { id: 7, type: 'warning', message: 'SSL certificate expires in 7 days', timestamp: '2025-07-07 16:20:44', source: 'Security Monitor', severity: 'high' },
    { id: 8, type: 'success', message: 'New user registration: jane.doe@example.com', timestamp: '2025-07-07 16:15:22', source: 'User Service', severity: 'low' }
  ]);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const playSound = (type) => {
    if (!soundEnabled) return;
    console.log(`Playing ${type} sound`);
  };

  const saveCurrentChat = () => {
    if (messages.length === 0) return;
    
    const chatTitle = messages[0]?.content?.substring(0, 50) + '...' || 'New Chat';
    const newChat = {
      id: currentChatId || generateId(),
      title: chatTitle,
      messages: messages,
      timestamp: new Date().toISOString(),
      preview: messages[messages.length - 1]?.content?.substring(0, 100) + '...' || ''
    };

    setSavedChats(prev => {
      const existing = prev.find(chat => chat.id === newChat.id);
      if (existing) {
        return prev.map(chat => chat.id === newChat.id ? newChat : chat);
      }
      return [...prev, newChat];
    });
    
    setCurrentChatId(newChat.id);
    playSound('save');
  };

  const loadChat = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowSavedChats(false);
    playSound('load');
  };

  const deleteChat = (chatId) => {
    setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
    playSound('delete');
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setShowSavedChats(false);
    playSound('new');
  };

  const exportChat = () => {
    const chatData = {
      id: currentChatId,
      messages: messages,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${currentChatId || 'new'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('export');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() && !imagePreview) return;

    const userMessage = {
      id: generateId(),
      type: 'user',
      content: inputValue,
      image: imagePreview,
      timestamp: new Date().toISOString(),
      edited: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setImagePreview(null);
    setIsTyping(true);
    playSound('send');

    setTimeout(() => {
      const aiMessage = {
        id: generateId(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date().toISOString(),
        edited: false
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      playSound('receive');
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (input) => {
    const responses = [
      `Here's a comprehensive React component with advanced features:

\`\`\`javascript
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedDashboard = ({ data, onUpdate }) => {
  const [activeView, setActiveView] = useState('overview');
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = useCallback(() => {
    return data.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = Object.entries(filters).every(([key, value]) => 
        !value || item[key] === value
      );
      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters]);

  const handleViewChange = (view) => {
    setActiveView(view);
    onUpdate?.(view);
  };

  return (
    <div className="dashboard-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dashboard content */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdvancedDashboard;
\`\`\`

This component includes state management, filtering, and smooth animations.`,
      
      `Here's a modern CSS Grid layout with advanced styling:

\`\`\`css
.advanced-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::before {
  opacity: 1;
}

@media (max-width: 768px) {
  .advanced-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }
}
\`\`\`

This creates a responsive glassmorphism design with hover effects.`,

      `Here's a TypeScript interface for advanced data management:

\`\`\`typescript
interface APIResponse<T> {
  data: T;
  status: 'success' | 'error' | 'loading';
  message?: string;
  timestamp: string;
  metadata?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    preferences: {
      theme: 'light' | 'dark' | 'auto';
      notifications: {
        email: boolean;
        push: boolean;
        inApp: boolean;
      };
      language: string;
    };
  };
  permissions: Permission[];
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  conditions?: Record<string, any>;
}

class UserService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getUser(id: string): Promise<APIResponse<User>> {
    try {
      const response = await fetch(\`\${this.baseUrl}/users/\${id}\`);
      const data = await response.json();
      
      return {
        data,
        status: 'success',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        data: null,
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<APIResponse<User>> {
    // Implementation here
  }
}
\`\`\`

This provides a robust type-safe API structure with error handling.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const editMessage = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setIsEditing(messageId);
      setEditingText(message.content);
    }
  };

  const saveEdit = () => {
    setMessages(prev => prev.map(msg => 
      msg.id === isEditing 
        ? { ...msg, content: editingText, edited: true }
        : msg
    ));
    setIsEditing(null);
    setEditingText('');
    playSound('edit');
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditingText('');
  };

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    playSound('delete');
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(content);
    setTimeout(() => setCopiedMessageId(null), 2000);
    playSound('copy');
  };

  const shareMessage = (content) => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared Message',
        text: content
      });
    } else {
      copyMessage(content);
    }
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      starred: false
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: ''
    });
    setShowTaskModal(false);
    playSound('add');
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const statuses = ['pending', 'in-progress', 'completed'];
        const currentIndex = statuses.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...task, status: statuses[nextIndex] };
      }
      return task;
    }));
    playSound('update');
  };

  const toggleTaskStar = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, starred: !task.starred } : task
    ));
    playSound('star');
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    playSound('delete');
  };

  const addStation = () => {
    if (!newStation.name.trim()) return;
    
    const station = {
      id: Date.now(),
      ...newStation,
      status: 'offline',
      users: 0,
      lastUpdate: new Date().toISOString(),
      cpu: 0,
      memory: 0,
      disk: Math.floor(Math.random() * 50)
    };
    
    setStations(prev => [...prev, station]);
    setNewStation({
      name: '',
      location: '',
      type: 'development'
    });
    setShowStationModal(false);
    playSound('add');
  };

  const toggleStationStatus = (stationId) => {
    setStations(prev => prev.map(station => {
      if (station.id === stationId) {
        const statuses = ['offline', 'online', 'maintenance'];
        const currentIndex = statuses.indexOf(station.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];
        
        return { 
          ...station, 
          status: newStatus,
          users: newStatus === 'online' ? Math.floor(Math.random() * 50) + 1 : 0,
          cpu: newStatus === 'online' ? Math.floor(Math.random() * 90) : 0,
          memory: newStatus === 'online' ? Math.floor(Math.random() * 90) : 0,
          lastUpdate: new Date().toISOString()
        };
      }
      return station;
    }));
    playSound('update');
  };

  const deleteStation = (stationId) => {
    setStations(prev => prev.filter(station => station.id !== stationId));
    playSound('delete');
  };

  const refreshStations = () => {
    setStations(prev => prev.map(station => ({
      ...station,
      lastUpdate: new Date().toISOString(),
      cpu: station.status === 'online' ? Math.floor(Math.random() * 90) : 0,
      memory: station.status === 'online' ? Math.floor(Math.random() * 90) : 0,
      users: station.status === 'online' ? Math.floor(Math.random() * 50) + 1 : 0
    })));
    playSound('refresh');
  };

  const clearLogs = () => {
    setLogs([]);
    playSound('clear');
  };

  const exportLogs = () => {
    const logData = {
      logs: logs.filter(log => logFilter === 'all' || log.type === logFilter),
      exported: new Date().toISOString(),
      total: logs.length
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('export');
  };

  const renderMessage = (content) => {
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-4">
            <div className="bg-slate-800 text-white rounded-t-xl px-4 py-3 text-sm flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-blue-300 font-mono">{language || 'code'}</span>
              </div>
              <button
                onClick={() => copyMessage(code)}
                className="hover:bg-slate-700 p-2 rounded-lg transition-colors"
                title="Copy code"
              >
                {copiedMessageId === code ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 rounded-b-xl p-4 overflow-x-auto font-mono text-sm border border-slate-700">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStationStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const tabIcons = {
    chat: MessageCircle,
    tasks: CheckSquare,
    stations: Radio,
    logs: FileText
  };

  const tabLabels = {
    chat: 'Chat',
    tasks: 'Tasks',
    stations: 'Stations',
    logs: 'Logs'
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = taskFilter === 'all' || 
                         (taskFilter === 'starred' && task.starred) ||
                         task.status === taskFilter ||
                         task.priority === taskFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = stationFilter === 'all' || station.status === stationFilter || station.type === stationFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = logFilter === 'all' || log.type === logFilter || log.severity === logFilter;
    return matchesSearch && matchesFilter;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex h-full">
            {/* Chat Sidebar */}
            <div className={`${showSavedChats ? 'w-80' : 'w-16'} bg-white/80 backdrop-blur-lg border-r border-white/20 transition-all duration-300`}>
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className={`font-bold text-lg ${showSavedChats ? 'block' : 'hidden'}`}>
                    Saved Chats
                  </h2>
                  <button
                    onClick={() => setShowSavedChats(!showSavedChats)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {showSavedChats ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {showSavedChats && (
                <div className="p-4 space-y-3">
                  <button
                    onClick={startNewChat}
                    className="w-full text-left p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    New Chat
                  </button>
                  
                  {savedChats.map(chat => (
                    <div key={chat.id} className="group relative">
                      <div
                        onClick={() => loadChat(chat)}
                        className="w-full text-left p-4 bg-white/50 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white/70 transition-all transform hover:scale-105 shadow-sm"
                      >
                        <div className="font-medium truncate text-slate-800">{chat.title}</div>
                        <div className="text-xs text-slate-600 mt-1">{new Date(chat.timestamp).toLocaleString()}</div>
                        <div className="text-sm text-slate-700 mt-2">{chat.preview}</div>
                      </div>
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded-lg text-red-500"
                          title="Delete chat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportChat();
                          }}
                          className="p-1 hover:bg-blue-100 rounded-lg text-blue-500"
                          title="Export chat"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showSavedChats && (
                <div className="p-4 space-y-4">
                  <button
                    onClick={startNewChat}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                    title="New Chat"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowSavedChats(true)}
                    className="p-3 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/70 transition-all transform hover:scale-105 shadow-sm flex items-center justify-center"
                    title="Saved Chats"
                  >
                    <Bookmark className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={saveCurrentChat}
                    className="p-3 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/70 transition-all transform hover:scale-105 shadow-sm flex items-center justify-center"
                    title="Save Chat"
                  >
                    <Save className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {tabIcons[activeTab] && React.createElement(tabIcons[activeTab], { className: "w-5 h-5" })}
                  <h2 className="font-bold text-lg">{tabLabels[activeTab]}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    title={darkMode ? 'Light Mode' : 'Dark Mode'}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                    <MessageCircle className="w-12 h-12 mb-4" />
                    <h3 className="text-xl font-medium">No messages yet</h3>
                    <p className="mt-2">Start a new conversation by typing a message below</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl rounded-2xl p-4 ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white/80 backdrop-blur-sm text-slate-800'} shadow-sm`}
                      >
                        {message.image && (
                          <div className="mb-3">
                            <img
                              src={message.image}
                              alt="Uploaded content"
                              className="rounded-lg max-h-60 max-w-full"
                            />
                          </div>
                        )}
                        {isEditing === message.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full p-2 border rounded-lg"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-200 rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose">
                            {renderMessage(message.content)}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                            {message.edited && ' (edited)'}
                          </span>
                          <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                            {message.type === 'user' && (
                              <>
                                <button
                                  onClick={() => editMessage(message.id)}
                                  className="p-1 hover:bg-white/20 rounded"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteMessage(message.id)}
                                  className="p-1 hover:bg-white/20 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="p-1 hover:bg-white/20 rounded"
                              title="Copy"
                            >
                              {copiedMessageId === message.content ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => shareMessage(message.content)}
                              className="p-1 hover:bg-white/20 rounded"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/80 backdrop-blur-sm text-slate-800 rounded-2xl p-4 shadow-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/20">
                {imagePreview && (
                  <div className="relative mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-lg max-h-40"
                    />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    title="Attach Image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full p-3 pr-12 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="1"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() && !imagePreview}
                      className={`absolute right-2 bottom-2 p-2 rounded-xl ${!inputValue.trim() && !imagePreview ? 'text-slate-400' : 'text-blue-500 hover:bg-blue-100'}`}
                      title="Send"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="flex flex-col h-full">
            {/* Tasks Header */}
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                <h2 className="font-bold text-lg">Tasks</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  title="Add Task"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div className="relative">
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="appearance-none bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 pr-8 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Tasks</option>
                    <option value="starred">Starred</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tasks Search */}
            <div className="p-4 border-b border-white/20">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full p-3 pl-10 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <CheckSquare className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-medium">No tasks found</h3>
                  <p className="mt-2">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-1 p-1 rounded-lg border ${getTaskStatusColor(task.status)}`}
                          title="Toggle Status"
                        >
                          {task.status === 'completed' ? (
                            <Check className="w-4 h-4" />
                          ) : task.status === 'in-progress' ? (
                            <Activity className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <h3 className="font-medium text-slate-800">{task.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                              {task.assignee}
                            </span>
                            {task.dueDate && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleTaskStar(task.id)}
                          className="p-1 hover:bg-yellow-100 rounded-lg"
                          title={task.starred ? 'Unstar' : 'Star'}
                        >
                          <Star className={`w-4 h-4 ${task.starred ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 hover:bg-red-100 rounded-lg text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      case 'stations':
        return (
          <div className="flex flex-col h-full">
            {/* Stations Header */}
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                <h2 className="font-bold text-lg">Stations</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshStations}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowStationModal(true)}
                  className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  title="Add Station"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div className="relative">
                  <select
                    value={stationFilter}
                    onChange={(e) => setStationFilter(e.target.value)}
                    className="appearance-none bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 pr-8 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Stations</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="production">Production</option>
                    <option value="design">Design</option>
                    <option value="analytics">Analytics</option>
                  </select>
                  <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Stations Search */}
            <div className="p-4 border-b border-white/20">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search stations..."
                  className="w-full p-3 pl-10 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Stations List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredStations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <Radio className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-medium">No stations found</h3>
                  <p className="mt-2">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${getStationStatusColor(station.status)}`}></div>
                          {station.status === 'online' ? (
                            <Wifi className="w-4 h-4 mt-1 text-green-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 mt-1 text-red-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">{station.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{station.location}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                              {station.type}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {station.users} users
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              CPU: {station.cpu}%
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              Mem: {station.memory}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleStationStatus(station.id)}
                          className="p-1 hover:bg-blue-100 rounded-lg text-blue-500"
                          title="Toggle Status"
                        >
                          {station.status === 'online' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteStation(station.id)}
                          className="p-1 hover:bg-red-100 rounded-lg text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last updated: {new Date(station.lastUpdate).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      case 'logs':
        return (
          <div className="flex flex-col h-full">
            {/* Logs Header */}
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h2 className="font-bold text-lg">System Logs</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearLogs}
                  className="p-2 hover:bg-red-100 rounded-xl text-red-500 transition-colors"
                  title="Clear Logs"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={exportLogs}
                  className="p-2 hover:bg-blue-100 rounded-xl text-blue-500 transition-colors"
                  title="Export Logs"
                >
                  <Download className="w-5 h-5" />
                </button>
                <div className="relative">
                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="appearance-none bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 pr-8 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Logs</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="high">High Severity</option>
                    <option value="medium">Medium Severity</option>
                    <option value="low">Low Severity</option>
                  </select>
                  <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Logs Search */}
            <div className="p-4 border-b border-white/20">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full p-3 pl-10 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <FileText className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-medium">No logs found</h3>
                  <p className="mt-2">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                    <tr className="border-b border-white/20">
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Message</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/10">
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {getLogTypeIcon(log.type)}
                            <span className="ml-2 text-sm font-medium">{log.type}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-slate-800">{log.message}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="text-sm text-slate-600">{log.source}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="text-sm text-slate-600">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Main Navigation */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">Tech Console</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex border-b border-white/20">
          {Object.keys(tabIcons).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {React.createElement(tabIcons[tab], { className: "w-5 h-5" })}
              <span className="font-medium">{tabLabels[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Task</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 hover:bg-gray-200 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  placeholder="Task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Assignee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Station Modal */}
      {showStationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Station</h3>
              <button
                onClick={() => setShowStationModal(false)}
                className="p-1 hover:bg-gray-200 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newStation.name}
                  onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Station name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={newStation.location}
                  onChange={(e) => setNewStation({...newStation, location: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Physical location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newStation.type}
                  onChange={(e) => setNewStation({...newStation, type: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="development">Development</option>
                  <option value="testing">Testing</option>
                  <option value="production">Production</option>
                  <option value="design">Design</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowStationModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addStation}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Station
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
