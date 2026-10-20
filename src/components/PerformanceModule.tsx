import React, { useState } from 'react';
import { Trophy, Award, Medal, Star, TrendingUp, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';
import { User, TaskLog, AppUnit } from '../types';

interface PerformanceModuleProps {
  users: User[];
  taskLogs: TaskLog[];
  units: AppUnit[];
}

export const PerformanceModule: React.FC<PerformanceModuleProps> = ({
  users,
  taskLogs,
  units
}) => {
  const [activeTab, setActiveTab] = useState<'ob' | 'coordinator' | 'unit'>('ob');

  // OB / OG Performance Calculation
  const obList = users.filter(u => u.role === 'OfficeBoy' || u.role === 'OfficeGirl');
  const obPerformance = obList.map(ob => {
    const obTasks = taskLogs.filter(l => l.user === ob.id);
    const total = obTasks.length;
    const done = obTasks.filter(l => l.status === 'Done' && l.approval === 'Approved').length;
    const late = obTasks.filter(l => l.late === 'Yes').length;
    const reject = obTasks.filter(l => l.status === 'Rejected').length;
    const rework = obTasks.reduce((acc, curr) => acc + (curr.rework || 0), 0);
    const scored = obTasks.filter(l => typeof l.score === 'number');
    const avgScore = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + (b.score || 0), 0) / scored.length) : 0;
    const avgDuration = obTasks.filter(l => l.durasi).length > 0
      ? Math.round(obTasks.filter(l => l.durasi).reduce((a, b) => a + (b.durasi || 0), 0) / obTasks.filter(l => l.durasi).length)
      : 0;

    return {
      ...ob,
      total,
      done,
      late,
      reject,
      rework,
      avgScore,
      avgDuration
    };
  }).sort((a, b) => (b.points || 0) - (a.points || 0));

  // Coordinator Performance Calculation
  const coordList = users.filter(u => u.role === 'Coordinator');
  const coordPerformance = coordList.map(coord => {
    const coordInspections = taskLogs.filter(l => l.inspector === coord.id);
    const totalInspection = coordInspections.length;
    const approve = coordInspections.filter(l => l.approval === 'Approved').length;
    const reject = coordInspections.filter(l => l.approval === 'Rejected').length;
    const scored = coordInspections.filter(l => typeof l.score === 'number');
    const avgScore = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + (b.score || 0), 0) / scored.length) : 0;

    return {
      ...coord,
      totalInspection,
      approve,
      reject,
      avgScore
    };
  }).sort((a, b) => b.totalInspection - a.totalInspection);

  // Unit Performance Calculation
  const unitPerformance = units.map(unit => {
    const uTasks = taskLogs.filter(l => l.unit === unit.code);
    const total = uTasks.length;
    const late = uTasks.filter(l => l.late === 'Yes').length;
    const reject = uTasks.filter(l => l.status === 'Rejected').length;
    const scored = uTasks.filter(l => typeof l.score === 'number');
    const avgScore = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + (b.score || 0), 0) / scored.length) : 0;

    return {
      ...unit,
      total,
      late,
      reject,
      avgScore
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="space-y-6">
      {/* Title & Tab Bar */}
      <div className="glass-card p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Performance & Leaderboard KPI
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Penilaian objektif berbasis ketepatan waktu, skor mutu kebersihan, & jumlah inspeksi.
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border">
          <button
            onClick={() => setActiveTab('ob')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'ob' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Leaderboard OB/OG
          </button>
          <button
            onClick={() => setActiveTab('coordinator')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'coordinator' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Leaderboard Koordinator
          </button>
          <button
            onClick={() => setActiveTab('unit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'unit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Ranking Unit Kerja
          </button>
        </div>
      </div>

      {/* TAB 1: OB Leaderboard */}
      {activeTab === 'ob' && (
        <div className="glass-card p-6 rounded-2xl border space-y-4 overflow-x-auto">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Peringkat Office Boy & Office Girl Terbaik
          </h3>

          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Personnel</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Total Task</th>
                <th className="p-3">Done</th>
                <th className="p-3">Late</th>
                <th className="p-3">Reject</th>
                <th className="p-3">Rework</th>
                <th className="p-3">Avg Score</th>
                <th className="p-3 text-right">Poin KPI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {obPerformance.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                  <td className="p-3 font-extrabold">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-white text-[11px] ${
                      idx === 0 ? 'bg-amber-500 shadow-sm' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-700' : 'bg-gray-400'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <img src={item.photo} alt={item.nama} className="w-7 h-7 rounded-full object-cover" />
                    <span>{item.nama}</span>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300 font-medium">{item.unit}</td>
                  <td className="p-3 font-semibold">{item.total}</td>
                  <td className="p-3 text-emerald-600 font-bold">{item.done}</td>
                  <td className="p-3 text-rose-600 font-bold">{item.late}</td>
                  <td className="p-3 text-purple-600 font-bold">{item.reject}</td>
                  <td className="p-3">{item.rework}</td>
                  <td className="p-3 font-extrabold text-indigo-600">{item.avgScore} / 100</td>
                  <td className="p-3 font-black text-right text-amber-600 text-sm">{item.points} Poin</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Coordinator Leaderboard */}
      {activeTab === 'coordinator' && (
        <div className="glass-card p-6 rounded-2xl border space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-500" />
            Peringkat Keaktifan Inspeksi Koordinator
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coordPerformance.map((coord, idx) => (
              <div key={coord.id} className="glass-card p-5 rounded-2xl border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-indigo-600">#{idx + 1}</span>
                  <img src={coord.photo} alt={coord.nama} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{coord.nama}</h4>
                    <p className="text-xs text-gray-500">Unit Wewenang: {coord.inspection_unit}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-emerald-600">{coord.totalInspection} Inspeksi</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Approve: {coord.approve} | Reject: {coord.reject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Unit Performance */}
      {activeTab === 'unit' && (
        <div className="glass-card p-6 rounded-2xl border space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            Ranking Kebersihan Per Unit Kerja
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {unitPerformance.map((u, idx) => (
              <div key={u.id} className="glass-card p-4 rounded-2xl border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-600">RANK #{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600">{u.code}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{u.name}</h4>
                <div className="pt-2 border-t text-xs space-y-1 text-gray-500">
                  <p>• Total Task: <span className="font-bold text-gray-800 dark:text-gray-200">{u.total}</span></p>
                  <p>• Rata-rata Skor: <span className="font-extrabold text-emerald-600">{u.avgScore} / 100</span></p>
                  <p>• Total Late: <span className="font-bold text-rose-600">{u.late}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
