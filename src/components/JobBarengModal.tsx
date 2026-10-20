import React, { useState } from 'react';
import { Briefcase, Users, Building2, AlertCircle } from 'lucide-react';
import { AppUnit, User, TaskType, TaskPriority } from '../types';

interface JobBarengModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: AppUnit[];
  onCreateJobBareng: (data: {
    name: string;
    task_type: TaskType;
    target_unit: string;
    instruction: string;
    estimated_time: number;
    priority: TaskPriority;
  }) => void;
}

export const JobBarengModal: React.FC<JobBarengModalProps> = ({
  isOpen,
  onClose,
  units,
  onCreateJobBareng
}) => {
  const [name, setName] = useState('Kerja Bakti Massal Lingkungan Sekolah');
  const [taskType, setTaskType] = useState<TaskType>('Kerja Bakti');
  const [targetUnit, setTargetUnit] = useState('All Unit');
  const [instruction, setInstruction] = useState('Pembersihan selokan, pemangkasan pohon, dan penyemprotan fogging area sekolah.');
  const [estimatedTime, setEstimatedTime] = useState(120);
  const [priority, setPriority] = useState<TaskPriority>('Urgent');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateJobBareng({
      name,
      task_type: taskType,
      target_unit: targetUnit,
      instruction,
      estimated_time: Number(estimatedTime),
      priority
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Buat Job Bareng Baru</h3>
              <p className="text-xs text-gray-400">Otomatis menugaskan seluruh Office Boy/Girl pada unit target</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 font-bold">✕</button>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
            Nama Job Bareng (Contoh: Kerja Bakti, Fogging, Pindahan)
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Tipe Kegiatan</label>
            <select
              value={taskType}
              onChange={e => setTaskType(e.target.value as TaskType)}
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
            >
              <option value="Kerja Bakti">Kerja Bakti</option>
              <option value="General Cleaning">General Cleaning</option>
              <option value="Fogging">Fogging</option>
              <option value="Event">Setting Event</option>
              <option value="Moving">Pindahan Barang / Angkat Meja</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Target Unit</label>
            <select
              value={targetUnit}
              onChange={e => setTargetUnit(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border font-bold"
            >
              <option value="All Unit">★ Semua Unit (Massal)</option>
              {units.map(u => (
                <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Estimasi Durasi (Menit)</label>
            <input
              type="number"
              value={estimatedTime}
              onChange={e => setEstimatedTime(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prioritas</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as TaskPriority)}
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
            >
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Instruksi & Catatan Khusus</label>
          <textarea
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            rows={3}
            className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 rounded-xl text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
          >
            Tugaskan Job Bareng
          </button>
        </div>
      </form>
    </div>
  );
};
