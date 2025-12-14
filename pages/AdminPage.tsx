import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { User, SystemSettings, SystemLog } from '../types';
import { IconGraph, IconUsers, IconSettings, IconShield, IconLogo, IconBot, IconCrown, IconZap, IconBell, IconLock, IconMenu } from '../components/Icons';
import { firebaseService } from '../services/firebaseService';

export const AdminPage: React.FC = () => {
    const { user } = useAuth(); // User is always present now
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings' | 'ai-logs' | 'payments'>('dashboard');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [paymentLogs, setPaymentLogs] = useState<SystemLog[]>([]);
    const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, bannedUsers: 0 });
    const [settings, setSettings] = useState<SystemSettings>({ maintenanceMode: false, globalAlert: null, allowImageGen: true, allowRegistration: true });
    const [alertInput, setAlertInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const u = await adminService.getUsers();
            const s = await adminService.getSettings();
            const l = await adminService.getLogs();
            const p = await firebaseService.getPayments();
            const st = await adminService.getDashboardStats();
            
            setAllUsers(u);
            setSettings(s);
            setLogs(l);
            setPaymentLogs(p);
            setStats(st);
            setAlertInput(s.globalAlert || '');
            setIsLoading(false);
        };

        loadData();
    }, [activeTab]);

    // Polling for live logs
    useEffect(() => {
        if (activeTab === 'ai-logs' || activeTab === 'dashboard') {
            const interval = setInterval(async () => {
                const l = await adminService.getLogs();
                setLogs(l);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    const handleBan = async (userId: string) => {
        await adminService.toggleBan(userId);
        const u = await adminService.getUsers(); 
        setAllUsers(u);
    };

    const toggleMaintenance = async () => {
        const newSettings = await adminService.updateSettings({ maintenanceMode: !settings.maintenanceMode });
        setSettings(newSettings);
    };

    const saveAlert = async () => {
        const val = alertInput.trim() === '' ? null : alertInput;
        const newSettings = await adminService.updateSettings({ globalAlert: val });
        setSettings(newSettings);
        alert('Global alert updated!');
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // --- Components ---

    const DashboardTab = () => {
        return (
            <div className="space-y-6 animate-fade-in pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</h3>
                            </div>
                            <div className="bg-blue-900/30 p-3 rounded-lg text-blue-400">
                                <IconUsers className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Pro Subscribers</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{stats.proUsers}</h3>
                            </div>
                            <div className="bg-green-900/30 p-3 rounded-lg text-green-400">
                                <IconZap className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Revenue (Est)</p>
                                <h3 className="text-3xl font-bold text-white mt-2">${paymentLogs.length * 19}</h3>
                            </div>
                            <div className="bg-purple-900/30 p-3 rounded-lg text-purple-400">
                                <IconGraph className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Banned</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{stats.bannedUsers}</h3>
                            </div>
                            <div className="bg-red-900/30 p-3 rounded-lg text-red-400">
                                <IconShield className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulated Graph */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg overflow-x-auto">
                    <h3 className="text-lg font-bold text-white mb-6">User Growth (Last 7 Days)</h3>
                    <div className="flex items-end justify-between h-64 gap-2 px-2 min-w-[300px]">
                        {[40, 65, 50, 80, 75, 90, 100].map((h, i) => (
                            <div key={i} className="w-full bg-gray-700 rounded-t-md relative group hover:bg-green-500 transition-all duration-300" style={{ height: `${h}%` }}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {h * 10} Users
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium uppercase tracking-wider min-w-[300px]">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>
        );
    };

    const UsersTab = () => (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400 min-w-[600px]">
                    <thead className="bg-gray-900/50 text-gray-200 uppercase font-medium text-xs tracking-wider border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Tokens</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {allUsers.map(u => (
                            <tr key={u.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={u.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600" />
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{u.name}</span>
                                        <span className="text-xs opacity-70 truncate max-w-[150px]">{u.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {u.isBanned ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">Banned</span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">Active</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 capitalize text-white">
                                    {u.subscriptionPlan === 'lifetime' ? 
                                        <span className="text-purple-400 font-bold flex items-center gap-1"><IconZap className="w-3 h-3" /> Lifetime</span> : 
                                        u.subscriptionPlan}
                                </td>
                                <td className="px-6 py-4">
                                    {u.isPro ? <span className="text-yellow-500 font-medium">Unlimited</span> : u.tokens.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleBan(u.id)}
                                        className={`p-2 rounded-lg transition-colors ${u.isBanned ? 'bg-orange-900/20 text-orange-400 border border-orange-900/50' : 'bg-gray-700/50 text-gray-400 hover:text-white border border-gray-600'}`}
                                        title={u.isBanned ? "Unban User" : "Ban User"}
                                    >
                                        <IconShield className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const SettingsTab = () => (
        <div className="space-y-6 animate-fade-in pb-10">
             <div className="bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-red-900/20 rounded-lg"><IconLock className="w-5 h-5 text-red-400" /></div>
                    Site Controls
                </h3>
                <div className="flex items-center justify-between p-4 md:p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div>
                        <h4 className="text-white font-semibold text-lg">Maintenance Mode</h4>
                        <p className="text-sm text-gray-400 mt-1 max-w-lg">
                            Instantly lock the chat interface for all non-admin users.
                        </p>
                    </div>
                    <button 
                        onClick={toggleMaintenance}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'}`}
                    >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-yellow-900/20 rounded-lg"><IconBell className="w-5 h-5 text-yellow-400" /></div>
                    Global Notification
                </h3>
                <p className="text-sm text-gray-400 mb-6">Send a broadcast message to all users.</p>
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        value={alertInput}
                        onChange={(e) => setAlertInput(e.target.value)}
                        placeholder="e.g., Server maintenance scheduled..." 
                        className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-600 w-full"
                    />
                    <button 
                        onClick={saveAlert}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20 whitespace-nowrap"
                    >
                        Broadcast
                    </button>
                </div>
            </div>
        </div>
    );

    const AiLogsTab = () => (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in shadow-lg flex flex-col h-[500px] md:h-[600px]">
            <div className="p-4 md:p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/30">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <IconBot className="w-5 h-5 text-green-400" /> <span className="hidden sm:inline">AI System Logs</span><span className="sm:hidden">Logs</span>
                </h3>
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-950 text-gray-300 space-y-2">
                {logs.length === 0 && <div className="text-gray-500 p-4">No logs found.</div>}
                
                {logs.map((log, i) => (
                     <div key={i} className="flex gap-3 border-l-2 border-gray-800 pl-3 hover:bg-gray-900/50 p-1 rounded break-all sm:break-normal">
                        <span className="text-gray-500 text-xs w-16 sm:w-20 flex-shrink-0">
                           {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                        </span>
                        <div className="flex-1">
                            {log.type === 'INFO' ? (
                                <span className="text-green-400">INFO: {log.message}</span>
                            ) : log.type === 'ACTION' ? (
                                <span className="text-purple-400">ACT: {log.message}</span>
                            ) : log.type === 'AUTH' ? (
                                <span className="text-blue-400">AUTH: {log.message}</span>
                            ) : (
                                <span className="text-red-400">ERR: {log.message}</span>
                            )}
                        </div>
                     </div>
                ))}
            </div>
        </div>
    );

    const PaymentsTab = () => (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in shadow-lg">
            <div className="p-6 border-b border-gray-700 bg-gray-900/30">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <IconCrown className="w-5 h-5 text-yellow-400" /> Transactions
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400 min-w-[500px]">
                    <thead className="bg-gray-900/50 text-gray-200 uppercase font-medium text-xs tracking-wider border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {paymentLogs.length === 0 ? (
                             <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No transactions yet.</td></tr>
                        ) : (
                            paymentLogs.map((log, i) => (
                                <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">{new Date(log.timestamp || 0).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-white font-medium">{log.message}</td>
                                    <td className="px-6 py-4 text-green-400 font-mono">$19.00</td>
                                    <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">Paid</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-950 text-white font-sans relative">
            
            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={closeMobileMenu}></div>
            )}

            {/* Admin Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800 flex flex-col shadow-2xl
                transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <IconLogo className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Admin</span>
                    </div>
                    <button onClick={closeMobileMenu} className="lg:hidden text-gray-400 hover:text-white">
                        <IconPlus className="w-6 h-6 rotate-45" />
                    </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Menu</div>
                    {[
                        { id: 'dashboard', icon: IconGraph, label: 'Dashboard' },
                        { id: 'users', icon: IconUsers, label: 'Users' },
                        { id: 'payments', icon: IconCrown, label: 'Transactions' },
                        { id: 'ai-logs', icon: IconBot, label: 'AI Logs' },
                        { id: 'settings', icon: IconSettings, label: 'Settings' }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => { setActiveTab(item.id as any); closeMobileMenu(); }} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === item.id ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <item.icon className="w-5 h-5" /> {item.label}
                        </button>
                    ))}
                </nav>
                
                <div className="p-4 bg-gray-900 border-t border-gray-800">
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 border border-gray-700">
                        {user && <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-700" alt="" />}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-white truncate">{user?.name || 'Guest'}</p>
                            <p className="text-green-400 text-xs font-mono">ROOT_ACCESS</p>
                        </div>
                     </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-950 min-w-0">
                <header className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
                            <IconMenu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 hidden sm:inline">Pages /</span>
                            <h2 className="text-lg font-bold capitalize text-white">{activeTab.replace('-', ' ')}</h2>
                        </div>
                    </div>
                    <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700 whitespace-nowrap">
                        Exit <span className="hidden sm:inline">to App</span> &rarr;
                    </Link>
                </header>
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {isLoading ? <div className="text-white">Loading...</div> : (
                            <>
                                {activeTab === 'dashboard' && <DashboardTab />}
                                {activeTab === 'users' && <UsersTab />}
                                {activeTab === 'payments' && <PaymentsTab />}
                                {activeTab === 'settings' && <SettingsTab />}
                                {activeTab === 'ai-logs' && <AiLogsTab />}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper component for close icon (reusing IconPlus logic for consistency)
const IconPlus: React.FC<any> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);
