import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Building2,
  Image,
  TrendingUp,
  Award,
  ShieldAlert,
  BarChart2,
  PieChart
} from 'lucide-react';
import { TaskLog, User, AppUnit } from '../types';

interface AdminDashboardProps {
  taskLogs: TaskLog[];
  users: User[];
  units: AppUnit[];
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  taskLogs,
  users,
  units,
  onSelectTab
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = taskLogs.filter(l => l.tanggal === today);

  const doneCount = todayLogs.filter(l => l.status === 'Done').length;
  const pendingCount = todayLogs.filter(l => l.status === 'Pending' || l.status === 'Progress').length;
  const lateCount = todayLogs.filter(l => l.late === 'Yes').length;
  const rejectedCount = todayLogs.filter(l => l.status === 'Rejected' || l.status === 'Rework').length;

  const totalObCount = users.filter(u => u.role === 'OfficeBoy' || u.role === 'OfficeGirl').length;
  const totalKoordCount = users.filter(u => u.role === 'Coordinator').length;
  const totalUnitCount = units.length;
  const totalPhotosCount = taskLogs.filter(l => l.before_photo || l.after_photo).length * 2;

  // Calculate On-Time Percentage
  const completedLogs = taskLogs.filter(l => l.status === 'Done');
  const onTimeLogs = completedLogs.filter(l => l.late === 'No');
  const onTimePercentage = completedLogs.length > 0 ? Math.round((onTimeLogs.length / completedLogs.length) * 100) : 100;

  // Work Types Distribution
  const workTypesCount: Record<string, number> = {};
  taskLogs.forEach(l => {
    workTypesCount[l.task_type] = (workTypesCount[l.task_type] || 0) + 1;
  });

  // Top Office Boy Calculations
  const obList = users.filter(u => u.role === 'OfficeBoy' || u.role === 'OfficeGirl');
  const topObs = obList.map(ob => {
    const obTasks = taskLogs.filter(l => l.user === ob.id);
    const obDone = obTasks.filter(l => l.status === 'Done').length;
    const obLate = obTasks.filter(l => l.late === 'Yes').length;
    const obScored = obTasks.filter(l => typeof l.score === 'number');
    const avgScore = obScored.length > 0 ? Math.round(obScored.reduce((a, b) => a + (b.score || 0), 0) / obScored.length) : 0;
    return {
      id: ob.id,
      nama: ob.nama,
      unit: ob.unit,
      photo: ob.photo,
      points: ob.points || 0,
      totalDone: obDone,
      late: obLate,
      avgScore
    };
  }).sort((a, b) => b.points - a.points).slice(0, 5);

  // Late Hour Heatmap Distribution (07:00 to 17:00)
  const hoursHeatmap = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(hour => {
    const count = taskLogs.filter(l => {
      if (l.late !== 'Yes' || !l.jam_selesai) return false;
      const h = parseInt(l.jam_selesai.split(':')[0], 10);
      return h === hour;
    }).length;
    return { hour: `${String(hour).padStart(2, '0')}:00`, count };
  });

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard Utama Facility Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Monitoring Real-time Kebersihan, Inspeksi, & Kinerja Personnel Sekolah Lazuardi
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSelectTab('master_task')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            + Buat Master Task
          </button>
          <button
            onClick={() => onSelectTab('inspection')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border transition"
          >
            Lihat Inspeksi
          </button>
        </div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Task Hari Ini */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Task Hari Ini
            </span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{todayLogs.length}</p>
          <p className="text-[10px] text-gray-400 mt-1">Total terjadwal hari ini</p>
        </div>

        {/* Task Done */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Task Done
            </span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{doneCount}</p>
          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            {todayLogs.length > 0 ? Math.round((doneCount / todayLogs.length) * 100) : 0}% Selesai
          </p>
        </div>

        {/* Task Pending */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Task Pending
            </span>
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</p>
          <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-1">Menunggu dikerjakan</p>
        </div>

        {/* Task Late */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Task Late
            </span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{lateCount}</p>
          <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-1">Melewati jam kerja</p>
        </div>

        {/* Tepat Waktu Gauge */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border">
          <div className="flex items-center justify-between text-blue-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Tepat Waktu
            </span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{onTimePercentage}%</p>
          <p className="text-[10px] text-gray-400 mt-1">Kepatuhan jam kerja</p>
        </div>
      </div>

      {/* Secondary Personnel & Resource Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Office Boy/Girl</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalObCount} Personnel</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Koordinator</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalKoordCount} Orang</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Unit Kerja</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalUnitCount} Unit</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Dokumen Foto</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalPhotosCount} Foto</p>
          </div>
        </div>
      </div>

      {/* Visual Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Completion Progress & Distribution */}
        <div className="glass-card p-5 rounded-2xl border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              Persentase Penyelesaian Pekerjaan
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-600 dark:text-emerald-400">Selesai (Approved / Done)</span>
                <span>{doneCount} / {todayLogs.length || 1}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${todayLogs.length > 0 ? (doneCount / todayLogs.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-600 dark:text-amber-400">Sedang Dikerjakan (Progress)</span>
                <span>{pendingCount}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${todayLogs.length > 0 ? (pendingCount / todayLogs.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-600 dark:text-rose-400">Ditolak / Rework (Rejected)</span>
                <span>{rejectedCount}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${todayLogs.length > 0 ? (rejectedCount / todayLogs.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Jenis Pekerjaan Distribution */}
        <div className="glass-card p-5 rounded-2xl border space-y-3">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-500" />
            Distribusi Jenis Pekerjaan
          </h3>
          <div className="space-y-2 pt-1">
            {Object.entries(workTypesCount).map(([type, count]) => {
              const total = taskLogs.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400 font-semibold">{count} Task</span>
                    <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Office Boy Leaderboard */}
        <div className="glass-card p-5 rounded-2xl border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Top Office Boy / Girl
            </h3>
            <button
              onClick={() => onSelectTab('performance')}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Lihat Ranking
            </button>
          </div>

          <div className="space-y-2.5">
            {topObs.map((ob, idx) => (
              <div key={ob.id} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                    idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <img src={ob.photo} alt={ob.nama} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{ob.nama}</p>
                    <p className="text-[10px] text-gray-400">{ob.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{ob.points} Poin</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Skor: {ob.avgScore}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Jam Terlambat */}
      <div className="glass-card p-5 rounded-2xl border space-y-3">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-500" />
          Heatmap Jam Terlambat (Peak Hours Delay Analysis)
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Analisis jam-jam di mana frekuensi keterlambatan pengumpulan task paling sering terjadi.
        </p>

        <div className="grid grid-cols-11 gap-2 pt-2">
          {hoursHeatmap.map(item => {
            const intensity = item.count === 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200' :
                              item.count <= 2 ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 border-amber-300' :
                              'bg-rose-500 text-white font-bold border-rose-600 animate-pulse';
            return (
              <div key={item.hour} className={`p-2 rounded-xl text-center border transition ${intensity}`}>
                <p className="text-[10px] opacity-80">{item.hour}</p>
                <p className="text-sm font-bold mt-1">{item.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
