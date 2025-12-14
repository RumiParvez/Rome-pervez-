import { User, ChatSession, SystemSettings, SystemLog } from '../types';

// Pure LocalStorage implementation - No Firebase dependencies
// This service mimics the async nature of a database but stores everything in the browser.

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getLocal = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch { return null; }
};

const setLocal = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { console.error("LocalStorage error", e); }
};

export const firebaseService = {
  // --- Users ---
  
  async getUser(uid: string): Promise<User | null> {
    await delay(20);
    return getLocal<User>(`user_${uid}`);
  },

  async createUser(user: User): Promise<void> {
    await delay(20);
    setLocal(`user_${user.id}`, user);
    
    // Add to 'all users' list for Admin Panel
    const users = getLocal<User[]>('openyhool_users') || [];
    if (!users.find(u => u.id === user.id)) {
        users.push(user);
        setLocal('openyhool_users', users);
    }
  },

  async updateUser(uid: string, data: Partial<User>): Promise<void> {
    await delay(20);
    const user = getLocal<User>(`user_${uid}`);
    if (user) {
        const updated = { ...user, ...data };
        setLocal(`user_${uid}`, updated);
        
        // Update in global list
        const users = getLocal<User[]>('openyhool_users') || [];
        const idx = users.findIndex(u => u.id === uid);
        if (idx !== -1) {
            users[idx] = updated;
            setLocal('openyhool_users', users);
        }
    }
  },

  async getAllUsers(): Promise<User[]> {
    await delay(20);
    let users = getLocal<User[]>('openyhool_users') || [];
    if (users.length === 0) {
        // Recover guest user if list is empty
        const guest = getLocal<User>('openyhool_guest_user');
        if (guest) users = [guest];
    }
    return users.sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));
  },

  // --- Chats ---

  async getUserChats(uid: string): Promise<ChatSession[]> {
    await delay(20);
    const sessions = getLocal<ChatSession[]>('openyhool_sessions') || [];
    return sessions.filter(s => s.userId === uid).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async saveChat(userId: string, session: ChatSession): Promise<void> {
    await delay(20);
    const sessions = getLocal<ChatSession[]>('openyhool_sessions') || [];
    const idx = sessions.findIndex(s => s.id === session.id);
    const data = { ...session, userId };
    
    if (idx >= 0) {
        sessions[idx] = data;
    } else {
        sessions.push(data);
    }

    try {
        setLocal('openyhool_sessions', sessions);
    } catch (e) {
        // Quota Management: If full, strip images from all chats
        const optimized = sessions.map(s => ({
            ...s,
            messages: s.messages.map(m => ({ ...m, image: undefined }))
        }));
        setLocal('openyhool_sessions', optimized);
    }
  },

  async deleteChat(chatId: string): Promise<void> {
    await delay(20);
    const sessions = getLocal<ChatSession[]>('openyhool_sessions') || [];
    setLocal('openyhool_sessions', sessions.filter(s => s.id !== chatId));
  },

  // --- System Logs & Payments ---

  async addLog(log: SystemLog): Promise<void> {
    // Fire and forget
    const logs = getLocal<SystemLog[]>('openyhool_logs') || [];
    logs.unshift({ ...log, timestamp: Date.now() });
    if (logs.length > 200) logs.length = 200; // Cap limit
    setLocal('openyhool_logs', logs);
  },

  async getLogs(limitCount = 50): Promise<SystemLog[]> {
    await delay(20);
    const logs = getLocal<SystemLog[]>('openyhool_logs') || [];
    return logs.slice(0, limitCount);
  },

  async getPayments(): Promise<SystemLog[]> {
    await delay(20);
    const logs = getLocal<SystemLog[]>('openyhool_logs') || [];
    return logs.filter(l => l.type === 'ACTION' && l.message.includes('subscribed'));
  },

  // --- Settings ---

  async getSettings(): Promise<SystemSettings> {
    await delay(20);
    return getLocal<SystemSettings>('openyhool_settings') || { 
        maintenanceMode: false, 
        globalAlert: null, 
        allowImageGen: true, 
        allowRegistration: true 
    };
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<void> {
    await delay(20);
    const current = await this.getSettings();
    setLocal('openyhool_settings', { ...current, ...settings });
  }
};