import React, { useState } from 'react';
import {
  CheckSquare,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trophy,
  History,
  FileText,
  Star,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { TaskLog, User } from '../types';

interface OfficeBoyDashboardProps {
  currentUser: User;
  taskLogs: TaskLog[];
  onSubmitWork: (
    logId: string,
    data: {
      before_photo: string;
      after_photo: string;
      jam_mulai: string;
      jam_selesai: string;
      durasi: number;
    }
  ) => void;
  onOpenQrScanner: () => void;
}

export const OfficeBoyDashboard: React.FC<OfficeBoyDashboardProps> = ({
  currentUser,
  taskLogs,
  onSubmitWork,
  onOpenQrScanner
}) => {
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState<TaskLog | null>(null);
  const [beforePhoto, setBeforePhoto] = useState<string>('');
  const [afterPhoto, setAfterPhoto] = useState<string>('');
  const [jamMulai, setJamMulai] = useState<string>('07:30');
  const [jamSelesai, setJamSelesai] = useState<string>('08:15');

  // Filter tasks belonging to this OB/OG
  const myLogs = taskLogs.filter(l => l.user === currentUser.id);
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = myLogs.filter(l => l.tanggal === today);

  const pendingCount = todayLogs.filter(l => l.status === 'Pending' || l.status === 'Progress' || l.status === 'Rework').length;
  const doneCount = todayLogs.filter(l => l.status === 'Done' && l.approval === 'Approved').length;
  const lateCount = todayLogs.filter(l => l.late === 'Yes').length;

  const handleOpenSubmitModal = (task: TaskLog) => {
    setSelectedTaskForSubmit(task);
    setBeforePhoto(task.before_photo || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500');
    setAfterPhoto(task.after_photo || 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500');
    setJamMulai(task.jam_mulai || '07:30');
    setJamSelesai(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleConfirmSubmit = () => {
    if (!selectedTaskForSubmit) return;
    if (!beforePhoto || !afterPhoto) {
      alert('Wajib mengunggah Foto Before dan Foto After sebelum submit!');
      return;
    }

    onSubmitWork(selectedTaskForSubmit.log_id, {
      before_photo: beforePhoto,
      after_photo: afterPhoto,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      durasi: 45
    });

    setSelectedTaskForSubmit(null);
  };

  const handleSimulateFilePick = (setter: (val: string) => void) => {
    // Generate a clean photo simulation URL
    const samples = [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500'
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setter(picked);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card & Points Overview */}
      <div className="glass-card p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.photo}
            alt={currentUser.nama}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {currentUser.unit}
              </span>
              <span className="text-xs text-gray-500">{currentUser.role} Staff</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              Selamat Bertugas, {currentUser.nama}!
            </h2>
            <p className="text-xs text-gray-400">Pastikan foto Before & After terunggah tepat waktu sebelum jam kerja berakhir.</p>
          </div>
        </div>

        {/* Total Points Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white p-4 rounded-2xl shadow-md">
          <Trophy className="w-8 h-8 text-white shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-100">Perolehan Poin Kinerja</p>
            <p className="text-2xl font-black">{currentUser.points || 0} Poin</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Perlu Dikerjakan</p>
            <p className="text-xl font-bold text-amber-600">{pendingCount} Task</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Approved Selesai</p>
            <p className="text-xl font-bold text-emerald-600">{doneCount} Task</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Terlambat (Late)</p>
            <p className="text-xl font-bold text-rose-600">{lateCount} Task</p>
          </div>
        </div>

        <button
          onClick={onOpenQrScanner}
          className="glass-card p-4 rounded-xl border flex items-center justify-between hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600 text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white">QR Check-in</p>
              <p className="text-[10px] text-gray-400">Scan sebelum kerja</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Task List Hari Ini */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-indigo-500" />
          Daftar Pekerjaan Saya Hari Ini ({today})
        </h3>

        {todayLogs.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl border">
            <p className="text-sm text-gray-400">Belum ada task yang ditugaskan hari ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayLogs.map(task => {
              const isLate = task.late === 'Yes';
              const isRework = task.status === 'Rework' || task.status === 'Rejected';
              return (
                <div key={task.log_id} className="glass-card glass-card-hover p-5 rounded-2xl border space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                          {task.category}
                        </span>
                        {isLate && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-600 animate-pulse">
                            LATE
                          </span>
                        )}
                        {isRework && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-600">
                            PENDING REWORK
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{task.task_name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Unit: {task.unit} | Tipe: {task.task_type}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      task.approval === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      task.approval === 'Rejected' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {task.approval === 'Approved' ? `Approved (${task.score} Poin)` :
                       task.approval === 'Rejected' ? 'Rejected (Perlu Dibenahi)' : 'Proses / Waiting'}
                    </span>
                  </div>

                  {/* Inspection Note if Rejected */}
                  {task.inspection_note && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                      <p className="font-bold">Catatan Koordinator ({task.inspector_name}):</p>
                      <p className="mt-0.5">{task.inspection_note}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-gray-400">Jam Mulai: {task.jam_mulai || '-'}</span>
                    {task.approval !== 'Approved' && (
                      <button
                        onClick={() => handleOpenSubmitModal(task)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-sm flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{task.before_photo ? 'Update Foto & Submit' : 'Upload Foto & Submit'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUBMIT MODAL */}
      {selectedTaskForSubmit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Upload Foto Before & After Pekerjaan
              </h3>
              <button onClick={() => setSelectedTaskForSubmit(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Before Photo Box */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Foto BEFORE</p>
                {beforePhoto ? (
                  <img src={beforePhoto} alt="Before" className="w-full h-36 object-cover rounded-xl border" />
                ) : (
                  <div className="w-full h-36 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 border border-dashed">
                    Belum ada foto
                  </div>
                )}
                <button
                  onClick={() => handleSimulateFilePick(setBeforePhoto)}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ambil Foto Before</span>
                </button>
              </div>

              {/* After Photo Box */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Foto AFTER</p>
                {afterPhoto ? (
                  <img src={afterPhoto} alt="After" className="w-full h-36 object-cover rounded-xl border" />
                ) : (
                  <div className="w-full h-36 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 border border-dashed">
                    Belum ada foto
                  </div>
                )}
                <button
                  onClick={() => handleSimulateFilePick(setAfterPhoto)}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ambil Foto After</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setSelectedTaskForSubmit(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
