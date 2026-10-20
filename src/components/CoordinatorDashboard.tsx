import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ThumbsUp,
  RotateCcw,
  Star,
  Eye,
  CheckSquare,
  FileText
} from 'lucide-react';
import { TaskLog, User, InspectionChecklist } from '../types';

interface CoordinatorDashboardProps {
  currentUser: User;
  taskLogs: TaskLog[];
  onInspectTask: (
    logId: string,
    data: {
      approval: 'Approved' | 'Rejected';
      score: number;
      inspection_note: string;
      checklist: InspectionChecklist;
    }
  ) => void;
  onSubmitPersonalTask: (logId: string) => void;
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  currentUser,
  taskLogs,
  onInspectTask,
  onSubmitPersonalTask
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inspection' | 'my_tasks'>('inspection');
  const [selectedTaskForInspection, setSelectedTaskForInspection] = useState<TaskLog | null>(null);

  // Inspection Checklist Form State
  const [checklist, setChecklist] = useState<InspectionChecklist>({
    bersih: true,
    rapi: true,
    tidak_berdebu: true,
    tidak_ada_sampah: true,
    tidak_bau: true,
    peralatan_kembali: true,
    foto_sesuai: true,
    area_aman: true
  });
  const [score, setScore] = useState<number>(90);
  const [inspectionNote, setInspectionNote] = useState<string>('');

  // Filter tasks that the coordinator is authorized to inspect
  const myInspectionUnit = currentUser.inspection_unit || currentUser.unit;
  const isAuthorizedUnit = (unit: string) => {
    if (currentUser.role === 'Admin' || myInspectionUnit === 'ALL') return true;
    return unit === myInspectionUnit;
  };

  const unitTasks = taskLogs.filter(l => isAuthorizedUnit(l.unit));
  const pendingInspections = unitTasks.filter(l => l.status === 'Done' && l.approval === 'Waiting');
  const approvedTasks = unitTasks.filter(l => l.approval === 'Approved');
  const rejectedTasks = unitTasks.filter(l => l.approval === 'Rejected');
  const myPersonalTasks = taskLogs.filter(l => l.user === currentUser.id);

  const handleOpenInspectModal = (task: TaskLog) => {
    setSelectedTaskForInspection(task);
    setChecklist({
      bersih: true,
      rapi: true,
      tidak_berdebu: true,
      tidak_ada_sampah: true,
      tidak_bau: true,
      peralatan_kembali: true,
      foto_sesuai: true,
      area_aman: true
    });
    setScore(90);
    setInspectionNote('');
  };

  const handleConfirmInspection = (approval: 'Approved' | 'Rejected') => {
    if (!selectedTaskForInspection) return;
    if (approval === 'Rejected' && !inspectionNote.trim()) {
      alert('Wajib mengisikan Catatan Perbaikan apabila pekerjaan Di-Reject!');
      return;
    }

    onInspectTask(selectedTaskForInspection.log_id, {
      approval,
      score,
      inspection_note: inspectionNote,
      checklist
    });

    setSelectedTaskForInspection(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              Unit Inspeksi: {myInspectionUnit}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mt-1">
            Dashboard Koordinator Facility Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Fungsi ganda: Mengerjakan task pribadi & melakukan inspeksi mutu kebersihan unit {myInspectionUnit}.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border">
          <button
            onClick={() => setActiveSubTab('inspection')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'inspection'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Antrean Inspeksi ({pendingInspections.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('my_tasks')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'my_tasks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task Pribadi Saya ({myPersonalTasks.length})</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Menunggu Inspeksi</p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{pendingInspections.length} Task</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Task Disetujui</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{approvedTasks.length} Approved</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Task Rejected</p>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">{rejectedTasks.length} Rejected</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Rework</p>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400">
              {unitTasks.reduce((a, b) => a + (b.rework || 0), 0)} Kali
            </p>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: Inspection List */}
      {activeSubTab === 'inspection' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-indigo-500" />
              Daftar Task Menunggu Inspeksi (Unit {myInspectionUnit})
            </h3>
            <span className="text-xs text-gray-400">Hanya menampilkan task unit wewenang Koordinator</span>
          </div>

          {pendingInspections.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl border">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Semua Task Sudah Diinspeksi!</h4>
              <p className="text-xs text-gray-400 mt-1">
                Tidak ada pekerjaan OB/OG di unit {myInspectionUnit} yang menunggu persetujuan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingInspections.map(task => (
                <div key={task.log_id} className="glass-card glass-card-hover p-5 rounded-2xl border space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          {task.unit}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                          {task.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1.5">{task.task_name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Petugas: <span className="font-semibold text-gray-800 dark:text-gray-200">{task.user_name}</span>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Waiting Inspection
                    </span>
                  </div>

                  {/* Photos Preview */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 mb-1">FOTO BEFORE</p>
                      {task.before_photo ? (
                        <img
                          src={task.before_photo}
                          alt="Before"
                          className="w-full h-28 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-full h-28 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                          Belum ada foto
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 mb-1">FOTO AFTER</p>
                      {task.after_photo ? (
                        <img
                          src={task.after_photo}
                          alt="After"
                          className="w-full h-28 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-full h-28 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                          Belum ada foto
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-gray-400">Waktu Submit: {task.jam_selesai || '-'}</span>
                    <button
                      onClick={() => handleOpenInspectModal(task)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspeksi & Beri Nilai</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: My Personal Tasks */}
      {activeSubTab === 'my_tasks' && (
        <div className="glass-card p-6 rounded-2xl border space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-500" />
            Task Harian, Mingguan, & Bulanan Koordinator ({currentUser.nama})
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {myPersonalTasks.map(task => (
              <div key={task.log_id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-600">
                      {task.category}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{task.task_name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tanggal: {task.tanggal} | Status: {task.status}</p>
                </div>

                {task.status !== 'Done' ? (
                  <button
                    onClick={() => onSubmitPersonalTask(task.log_id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
                  >
                    Tandai Selesai
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-xs font-bold rounded-full">
                    ✓ Selesai
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSPECTION MODAL */}
      {selectedTaskForInspection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Form Inspeksi Mutu Kebersihan & Penilaian
                </h3>
                <p className="text-xs text-gray-500">
                  Task: {selectedTaskForInspection.task_name} ({selectedTaskForInspection.user_name})
                </p>
              </div>
              <button
                onClick={() => setSelectedTaskForInspection(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Checklist 8 Standard Items */}
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Checklist Standar Mutu Inspeksi (8 Poin)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'bersih', label: '1. Area Bersih Bebas Noda' },
                  { key: 'rapi', label: '2. Penataan Rapi & Teratur' },
                  { key: 'tidak_berdebu', label: '3. Tidak Berdebu' },
                  { key: 'tidak_ada_sampah', label: '4. Tidak Ada Sampah Berserakan' },
                  { key: 'tidak_bau', label: '5. Ruangan Tidak Bau / Harum' },
                  { key: 'peralatan_kembali', label: '6. Peralatan Kebersihan Dikembalikan' },
                  { key: 'foto_sesuai', label: '7. Foto Before/After Sesuai Lokasi' },
                  { key: 'area_aman', label: '8. Area Aman & Kunci Terpasang' }
                ].map(item => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border cursor-pointer hover:bg-indigo-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key as keyof InspectionChecklist]}
                      onChange={e =>
                        setChecklist({
                          ...checklist,
                          [item.key]: e.target.checked
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Score Selector */}
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Pilih Nilai / Skor Inspeksi
              </p>
              <div className="flex gap-2">
                {[100, 90, 80, 70, 60].map(s => (
                  <button
                    key={s}
                    onClick={() => setScore(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition border ${
                      score === s
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Catatan Inspeksi / Catatan Perbaikan (Wajib jika Reject)
              </label>
              <textarea
                value={inspectionNote}
                onChange={e => setInspectionNote(e.target.value)}
                placeholder="Tuliskan apresiasi atau bagian yang perlu dibersihkan ulang..."
                className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => handleConfirmInspection('Rejected')}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject & Minta Rework</span>
              </button>

              <button
                onClick={() => handleConfirmInspection('Approved')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Simpan Nilai</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
