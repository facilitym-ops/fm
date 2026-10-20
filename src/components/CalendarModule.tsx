import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { TaskLog } from '../types';

interface CalendarModuleProps {
  taskLogs: TaskLog[];
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({ taskLogs }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`;
    const dayTasks = taskLogs.filter(l => l.tanggal === dateStr);
    return { dayNum, dateStr, dayTasks };
  });

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Kalender Pekerjaan (Calendar View)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Jadwal kegiatan pembersihan harian, mingguan, &Job Bareng Juli 2026.
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'daily' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Harian
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'weekly' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Mingguan
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Bulanan
          </button>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 border-b pb-2">
          <span>Minggu</span>
          <span>Senin</span>
          <span>Selasa</span>
          <span>Rabu</span>
          <span>Kamis</span>
          <span>Jumat</span>
          <span>Sabtu</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map(item => (
            <div
              key={item.dateStr}
              className={`p-2 min-h-20 rounded-xl border flex flex-col justify-between transition ${
                item.dateStr === '2026-07-31'
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 font-bold'
                  : 'bg-gray-50/50 dark:bg-gray-800/30'
              }`}
            >
              <span className="text-xs font-bold text-gray-900 dark:text-white">{item.dayNum}</span>
              <div className="space-y-1 mt-1">
                {item.dayTasks.slice(0, 2).map(t => (
                  <div
                    key={t.log_id}
                    className="p-1 rounded text-[9px] truncate bg-indigo-600 text-white font-medium"
                    title={t.task_name}
                  >
                    {t.task_name}
                  </div>
                ))}
                {item.dayTasks.length > 2 && (
                  <span className="text-[9px] text-gray-400 font-bold block">
                    +{item.dayTasks.length - 2} Task Lain
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
