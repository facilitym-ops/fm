import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Building2,
  ClipboardCheck,
  BarChart3,
  History,
  Trophy,
  Settings,
  FileSpreadsheet,
  Activity,
  ShieldCheck,
  Calendar,
  LogOut,
  Moon,
  Sun,
  UserCheck,
  Briefcase,
  Code
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onSwitchUserRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAppsScriptDoc: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onSwitchUserRole,
  darkMode,
  setDarkMode,
  onOpenAppsScriptDoc
}) => {
  const role = currentUser.role;

  // Define Menu Items per Role
  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'master_task', label: 'Master Task', icon: CheckSquare },
    { id: 'job_bareng', label: 'Job Bareng', icon: Briefcase },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'unit', label: 'Unit Kerja', icon: Building2 },
    { id: 'inspection', label: 'Inspection', icon: ClipboardCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Kalender Kerja', icon: Calendar },
    { id: 'history', label: 'History & Logs', icon: History },
    { id: 'performance', label: 'Performance & Leaderboard', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'export', label: 'Export Data', icon: FileSpreadsheet },
    { id: 'activity_log', label: 'Activity Log', icon: Activity },
    { id: 'audit_log', label: 'Audit Log', icon: ShieldCheck }
  ];

  const coordinatorMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my_tasks', label: 'Task Saya', icon: CheckSquare },
    { id: 'inspection', label: 'Inspection', icon: ClipboardCheck },
    { id: 'history', label: 'History', icon: History },
    { id: 'performance', label: 'Performance', icon: Trophy },
    { id: 'calendar', label: 'Kalender Kerja', icon: Calendar }
  ];

  const obMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks_today', label: 'Task Hari Ini', icon: CheckSquare },
    { id: 'history', label: 'History Saya', icon: History },
    { id: 'profile', label: 'Profile & Poin', icon: UserCheck }
  ];

  const menuItems = role === 'Admin' ? adminMenu : role === 'Coordinator' ? coordinatorMenu : obMenu;

  return (
    <aside className="w-64 glass-card border-r flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 transition-all duration-300">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-200/60 dark:border-gray-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            FM
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-gray-900 dark:text-white leading-tight">
              OB & OG Management
            </h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Lazuardi Facility</p>
          </div>
        </div>

        {/* User Switcher Quick Badge */}
        <div className="p-3 mx-3 my-3 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
          <p className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 tracking-wider mb-1">
            Mode Akses Saat Ini
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={currentUser.photo}
                alt={currentUser.nama}
                className="w-7 h-7 rounded-full object-cover border border-indigo-300 dark:border-indigo-700"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{currentUser.nama}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {currentUser.role} ({currentUser.unit})
                </p>
              </div>
            </div>
          </div>

          {/* Quick Switch Role Buttons for Testing */}
          <div className="mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/40 grid grid-cols-3 gap-1 text-[10px]">
            <button
              onClick={() => onSwitchUserRole('Admin')}
              className={`px-1.5 py-1 rounded font-medium transition ${
                role === 'Admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-indigo-100'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => onSwitchUserRole('Coordinator')}
              className={`px-1.5 py-1 rounded font-medium transition ${
                role === 'Coordinator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-indigo-100'
              }`}
            >
              Koord
            </button>
            <button
              onClick={() => onSwitchUserRole('OfficeBoy')}
              className={`px-1.5 py-1 rounded font-medium transition ${
                role === 'OfficeBoy' || role === 'OfficeGirl'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-indigo-100'
              }`}
            >
              OB/OG
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60 space-y-2">
        <button
          onClick={onOpenAppsScriptDoc}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
        >
          <Code className="w-4 h-4" />
          <span>Google Apps Script</span>
        </button>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <p className="text-[10px] text-gray-400">v2.4 Apps Script Sync</p>
        </div>
      </div>
    </aside>
  );
};
