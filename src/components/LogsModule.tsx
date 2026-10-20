import React, { useState } from 'react';
import { Activity, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { ActivityLog, AuditLog } from '../types';

interface LogsModuleProps {
  activityLogs: ActivityLog[];
  auditLogs: AuditLog[];
}

export const LogsModule: React.FC<LogsModuleProps> = ({ activityLogs, auditLogs }) => {
  const [activeSubTab, setActiveSubTab] = useState<'activity' | 'audit'>('activity');

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Activity & Audit Logs (Perekaman Aktivitas)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Rekam jejak seluruh aksi login, perbaikan, soft delete, approval, dan perubahan nilai lama ke nilai baru.
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border">
          <button
            onClick={() => setActiveSubTab('activity')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'activity' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Activity Logs ({activityLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'activity' ? (
        <div className="glass-card p-6 rounded-2xl border space-y-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Pengguna</th>
                <th className="p-3">Role</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Aktivitas</th>
                <th className="p-3">IP / Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {activityLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                  <td className="p-3 font-mono text-gray-500">{log.waktu}</td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">{log.user_name}</td>
                  <td className="p-3 font-semibold text-indigo-600">{log.role}</td>
                  <td className="p-3 font-medium">{log.unit}</td>
                  <td className="p-3">{log.aktivitas}</td>
                  <td className="p-3 text-[10px] text-gray-400">{log.ip} ({log.device})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl border space-y-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Entitas Data</th>
                <th className="p-3">Aksi</th>
                <th className="p-3">Diubah Oleh</th>
                <th className="p-3">Nilai Lama</th>
                <th className="p-3">Nilai Baru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {auditLogs.map(audit => (
                <tr key={audit.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                  <td className="p-3 font-mono text-gray-500">{audit.timestamp}</td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">{audit.entity} ({audit.entity_id})</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                      {audit.action}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{audit.changed_by}</td>
                  <td className="p-3 font-mono text-[10px] text-rose-600 max-w-xs truncate">{audit.old_value || '-'}</td>
                  <td className="p-3 font-mono text-[10px] text-emerald-600 max-w-xs truncate">{audit.new_value || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
