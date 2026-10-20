import React, { useState } from 'react';
import { History, Search, Filter, Eye, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { TaskLog, InspectionHistoryItem } from '../types';

interface HistoryModuleProps {
  taskLogs: TaskLog[];
  inspectionHistory: InspectionHistoryItem[];
  searchTerm: string;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({
  taskLogs,
  inspectionHistory,
  searchTerm
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'task_logs' | 'inspections'>('task_logs');
  const [selectedTaskForTimeline, setSelectedTaskForTimeline] = useState<TaskLog | null>(null);

  const filteredLogs = taskLogs.filter(l => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.task_name.toLowerCase().includes(term) ||
      l.user_name.toLowerCase().includes(term) ||
      l.unit.toLowerCase().includes(term) ||
      l.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Histori & Audit Log Pekerjaan / Inspeksi
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Arsip lengkap riwayat seluruh pekerjaan, inspeksi, dan timeline status tanpa penghapusan permanen (Soft Delete).
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border">
          <button
            onClick={() => setActiveSubTab('task_logs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'task_logs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Histori Task ({filteredLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inspections')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'inspections' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Histori Inspeksi ({inspectionHistory.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'task_logs' ? (
        <div className="glass-card p-6 rounded-2xl border space-y-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Petugas</th>
                <th className="p-3">Nama Task</th>
                <th className="p-3">Status</th>
                <th className="p-3">Approval</th>
                <th className="p-3">Skor</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredLogs.map(l => (
                <tr key={l.log_id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{l.log_id}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{l.tanggal}</td>
                  <td className="p-3 font-semibold">{l.unit}</td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">{l.user_name}</td>
                  <td className="p-3">{l.task_name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.status === 'Done' ? 'bg-emerald-100 text-emerald-600' :
                      l.status === 'Late' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{l.approval}</td>
                  <td className="p-3 font-extrabold text-indigo-600">{l.score || '-'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedTaskForTimeline(l)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 text-indigo-600 rounded-lg font-semibold flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Timeline</span>
                    </button>
                  </td>
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
                <th className="p-3">Inspection ID</th>
                <th className="p-3">Tanggal & Waktu</th>
                <th className="p-3">Inspector</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Office Boy/Girl</th>
                <th className="p-3">Persetujuan</th>
                <th className="p-3">Skor Mutu</th>
                <th className="p-3">Catatan Inspeksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {inspectionHistory.map(insp => (
                <tr key={insp.inspection_id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                  <td className="p-3 font-bold text-purple-600">{insp.inspection_id}</td>
                  <td className="p-3 text-gray-600">{insp.tanggal} {insp.jam}</td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">{insp.inspector_name}</td>
                  <td className="p-3 font-semibold">{insp.unit}</td>
                  <td className="p-3">{insp.office_boy_name}</td>
                  <td className="p-3 font-bold text-emerald-600">{insp.approval}</td>
                  <td className="p-3 font-black text-indigo-600 text-sm">{insp.score}</td>
                  <td className="p-3 text-gray-500">{insp.catatan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TIMELINE DRAWER MODAL */}
      {selectedTaskForTimeline && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Timeline Riwayat Status Task ({selectedTaskForTimeline.log_id})
              </h3>
              <button onClick={() => setSelectedTaskForTimeline(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 relative pl-4 border-l-2 border-indigo-500 my-2">
              {selectedTaskForTimeline.timeline.map((item, idx) => (
                <div key={idx} className="relative pl-3">
                  <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950" />
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{item.status}</p>
                  <p className="text-[10px] text-gray-500">
                    Oleh: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.actor}</span> ({item.role}) • {item.timestamp}
                  </p>
                  {item.note && <p className="text-[11px] text-gray-400 mt-1 italic">"{item.note}"</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setSelectedTaskForTimeline(null)}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
              >
                Tutup Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
