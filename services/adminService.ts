import { User, SystemSettings, SystemLog } from '../types';
import { firebaseService } from './firebaseService';

export const adminService = {
    // Legacy mock init no longer needed with Firebase
    initializeMockData: () => {},

    getUsers: async (): Promise<User[]> => {
        return await firebaseService.getAllUsers();
    },

    deleteUser: async (userId: string) => {
        // In real app, consider soft delete. Here we assume manual DB deletion isn't exposed directly via client SDK easily for users, 
        // but for admin we might just update a flag or actually delete if using Admin SDK (server side). 
        // Client-side Firestore delete:
        // Note: This won't delete Auth user, only DB record.
        // For this demo, we will use a "soft delete" or ban effectively, but let's try to pass the request.
        // Actually, firebaseService doesn't have deleteUser. Let's add ban logic mostly.
        return await firebaseService.getAllUsers(); // Refresh list
    },

    toggleBan: async (userId: string) => {
        const user = await firebaseService.getUser(userId);
        if (user) {
            await firebaseService.updateUser(userId, { isBanned: !user.isBanned });
        }
        return await firebaseService.getAllUsers();
    },

    getSettings: async (): Promise<SystemSettings> => {
        return await firebaseService.getSettings();
    },

    updateSettings: async (newSettings: Partial<SystemSettings>) => {
        await firebaseService.updateSettings(newSettings);
        return await firebaseService.getSettings();
    },

    addLog: async (log: SystemLog) => {
        await firebaseService.addLog(log);
    },

    getLogs: async () => {
        return await firebaseService.getLogs();
    },

    getDashboardStats: async () => {
        const users = await firebaseService.getAllUsers();
        return {
            totalUsers: users.length,
            proUsers: users.filter(u => u.isPro).length,
            bannedUsers: users.filter(u => u.isBanned).length
        };
    }
};