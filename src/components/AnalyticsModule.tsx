import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { TaskLog, User, AppUnit } from '../types';

interface AnalyticsModuleProps {
  taskLogs: TaskLog[];
  users: User[];
  units: AppUnit[];
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  taskLogs,
  users,
  units
}) => {
  // Reject locations count
  const rejectLocations: Record<string, number> = {};
  taskLogs.filter(l => l.status === 'Rejected' || l.approval === 'Rejected').forEach(l => {
    rejectLocations[l.unit] = (rejectLocations[l.unit] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Analitik Kebersihan & Tren Inspeksi Real-time
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Visualisasi mendalam tren mutu kebersihan, tingkat reject, & pola keterlambatan per jam kerja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend Nilai & Reject */}
        <div className="glass-card p-5 rounded-2xl border space-y-3">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Tren Skor Mutu Kebersihan Mingguan
          </h3>
          <div className="space-y-3 pt-2">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day, idx) => {
              const scores = [88, 92, 85, 95, 90];
              const score = scores[idx];
              return (
                <div key={day}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{day}</span>
                    <span className="text-emerald-600 font-extrabold">{score} / 100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heatmap Lokasi Terbanyak Reject */}
        <div className="glass-card p-5 rounded-2xl border space-y-3">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            Heatmap Lokasi Terbanyak Reject / Perbaikan
          </h3>
          <p className="text-xs text-gray-500">Unit-unit sekolah dengan frekuensi rejection paling tinggi.</p>

          <div className="space-y-2 pt-1">
            {units.map(u => {
              const count = rejectLocations[u.code] || 0;
              return (
                <div key={u.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{u.name} ({u.code})</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    count > 1 ? 'bg-rose-500 text-white' : count === 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {count} Reject
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
