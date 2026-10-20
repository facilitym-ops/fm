import React, { useState } from 'react';
import {
  Search,
  Filter,
  QrCode,
  Bell,
  RefreshCw,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Flame,
  Database
} from 'lucide-react';
import { User, AppUnit, NotificationItem } from '../types';

interface TopNavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  selectedUnitFilter: string;
  setSelectedUnitFilter: (unit: string) => void;
  units: AppUnit[];
  currentUser: User;
  onOpenQrScanner: () => void;
  onOpenJobBarengModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  firebaseStatus?: {
    connected: boolean;
    loading: boolean;
    projectId: string;
    error?: string;
  };
  onOpenSettings?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDateFilter,
  setSelectedDateFilter,
  selectedUnitFilter,
  setSelectedUnitFilter,
  units,
  currentUser,
  onOpenQrScanner,
  onOpenJobBarengModal,
  onRefresh,
  isRefreshing,
  notifications,
  onMarkNotificationRead,
  firebaseStatus,
  onOpenSettings
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 glass-card border-b px-6 py-3 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Cari task, nama petugas, unit, atau status..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-gray-100/70 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Filters & Action Bar */}
      <div className="flex items-center gap-3">
        {/* Date Filter */}
        <div className="flex items-center gap-1.5 bg-gray-100/70 dark:bg-gray-800/70 px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-gray-700/60 text-xs">
          <CalendarIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedDateFilter}
            onChange={e => setSelectedDateFilter(e.target.value)}
            className="bg-transparent text-gray-800 dark:text-gray-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="Hari Ini" className="dark:bg-gray-800">Hari Ini</option>
            <option value="Kemarin" className="dark:bg-gray-800">Kemarin</option>
            <option value="Minggu Ini" className="dark:bg-gray-800">Minggu Ini</option>
            <option value="Bulan Ini" className="dark:bg-gray-800">Bulan Ini</option>
            <option value="Semua" className="dark:bg-gray-800">Semua Waktu</option>
          </select>
        </div>

        {/* Unit Filter */}
        <div className="flex items-center gap-1.5 bg-gray-100/70 dark:bg-gray-800/70 px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-gray-700/60 text-xs">
          <Building2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedUnitFilter}
            onChange={e => setSelectedUnitFilter(e.target.value)}
            className="bg-transparent text-gray-800 dark:text-gray-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="Semua" className="dark:bg-gray-800">Semua Unit</option>
            {units.map(u => (
              <option key={u.id} value={u.code} className="dark:bg-gray-800">
                {u.name} ({u.code})
              </option>
            ))}
          </select>
        </div>

        {/* Admin Quick Job Bareng Button */}
        {currentUser.role === 'Admin' && (
          <button
            onClick={onOpenJobBarengModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Job Bareng</span>
          </button>
        )}

        {/* QR Check-in Button */}
        <button
          onClick={onOpenQrScanner}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100/70 dark:bg-gray-800/70 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-medium border border-gray-200/60 dark:border-gray-700/60 transition"
          title="QR Code Check-in"
        >
          <QrCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">QR Check-in</span>
        </button>

        {/* Firebase Live Status Badge */}
        {firebaseStatus && (
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              firebaseStatus.connected
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : firebaseStatus.loading
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 animate-pulse'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
            }`}
            title={`Firebase Project: ${firebaseStatus.projectId} (${firebaseStatus.connected ? 'Terhubung' : 'Memeriksa / Offline'})`}
          >
            <Flame className={`w-3.5 h-3.5 ${firebaseStatus.connected ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
            <span className="hidden md:inline">
              {firebaseStatus.connected ? 'Firebase Aktif' : firebaseStatus.loading ? 'Menghubungkan...' : 'Firebase Offline'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                firebaseStatus.connected ? 'bg-emerald-500' : firebaseStatus.loading ? 'bg-amber-400 animate-ping' : 'bg-rose-500'
              }`}
            />
          </button>
        )}

        {/* Auto Refresh Trigger */}
        <button
          onClick={onRefresh}
          className={`p-2 rounded-xl bg-gray-100/70 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
            isRefreshing ? 'animate-spin text-indigo-600' : ''
          }`}
          title="Refresh Data (Auto-refresh 30s)"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-gray-100/70 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 py-3 z-50">
              <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Notifikasi Real-time</h3>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} Baru
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/50">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center py-6 text-gray-400">Tidak ada notifikasi baru.</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 text-xs cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {n.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : n.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        ) : (
                          <Bell className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{n.title}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-[11px] mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-gray-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
