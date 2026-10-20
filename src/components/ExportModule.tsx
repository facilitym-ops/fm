import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Download, Filter, Building2, Calendar } from 'lucide-react';
import { TaskLog, User, AppUnit } from '../types';
import { exportTasksToExcel, exportTasksToCsv, exportTasksToPdf, exportPerformanceToExcel } from '../services/exportService';

interface ExportModuleProps {
  taskLogs: TaskLog[];
  users: User[];
  units: AppUnit[];
  schoolName: string;
}

export const ExportModule: React.FC<ExportModuleProps> = ({
  taskLogs,
  users,
  units,
  schoolName
}) => {
  const [selectedUnit, setSelectedUnit] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const filteredLogs = taskLogs.filter(l => {
    if (selectedUnit !== 'Semua' && l.unit !== selectedUnit) return false;
    if (selectedStatus !== 'Semua' && l.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Pusat Export Laporan Data (PDF, Excel, CSV)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Unduh dokumen laporan rekapitulasi pekerjaan harian, kinerja personnel, & bukti inspeksi.
        </p>
      </div>

      {/* Filter Panel */}
      <div className="glass-card p-5 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Filter Unit Kerja</label>
          <select
            value={selectedUnit}
            onChange={e => setSelectedUnit(e.target.value)}
            className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
          >
            <option value="Semua">Semua Unit Kerja</option>
            {units.map(u => (
              <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Filter Status Task</label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
          >
            <option value="Semua">Semua Status</option>
            <option value="Done">Done (Selesai)</option>
            <option value="Pending">Pending</option>
            <option value="Late">Late (Terlambat)</option>
            <option value="Rejected">Rejected (Ditolak)</option>
          </select>
        </div>
      </div>

      {/* Export Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Export */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl border space-y-4 flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 w-fit mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Export PDF Document</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Dokumen resmi format lanskap lengkap dengan header sekolah, tabel task, & tanda tangan.
            </p>
          </div>

          <button
            onClick={() => exportTasksToPdf(filteredLogs, schoolName)}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan PDF ({filteredLogs.length} Task)</span>
          </button>
        </div>

        {/* Excel Export */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl border space-y-4 flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 w-fit mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Export Excel (.XLSX)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              File spreadsheet terstruktur lengkap dengan formula durasi, kolom foto, & skor mutu.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => exportTasksToExcel(filteredLogs)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Excel Task Logs</span>
            </button>

            <button
              onClick={() => exportPerformanceToExcel(users, taskLogs)}
              className="w-full py-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Unduh Excel Rekap Kinerja OB</span>
            </button>
          </div>
        </div>

        {/* CSV Export */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl border space-y-4 flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 w-fit mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Export Raw CSV Data</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Format CSV UTF-8 ringan untuk integrasi sistem eksternal & pengolahan data mentah.
            </p>
          </div>

          <button
            onClick={() => exportTasksToCsv(filteredLogs)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV Raw Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
