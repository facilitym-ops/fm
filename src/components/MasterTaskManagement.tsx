import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { MasterTask, User, AppUnit, TaskCategory, TaskType, TaskRecurrence, TaskPriority } from '../types';

interface MasterTaskManagementProps {
  masterTasks: MasterTask[];
  users: User[];
  units: AppUnit[];
  onAddMasterTask: (task: Omit<MasterTask, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateMasterTask: (id: string, updates: Partial<MasterTask>) => void;
  onDeleteMasterTask: (id: string) => void;
  currentUser: User;
}

export const MasterTaskManagement: React.FC<MasterTaskManagementProps> = ({
  masterTasks,
  users,
  units,
  onAddMasterTask,
  onUpdateMasterTask,
  onDeleteMasterTask,
  currentUser
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Pre Readiness');
  const [taskType, setTaskType] = useState<TaskType>('Cleaning');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('Daily');
  const [unit, setUnit] = useState('SD');
  const [assignee, setAssignee] = useState('ALL_OB');
  const [instruction, setInstruction] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  const activeMasterTasks = masterTasks.filter(t => t.status === 'Active');

  const handleOpenAdd = () => {
    setEditingTaskId(null);
    setName('');
    setCategory('Pre Readiness');
    setTaskType('Cleaning');
    setRecurrence('Daily');
    setUnit('SD');
    setAssignee('ALL_OB');
    setInstruction('');
    setEstimatedTime(30);
    setPriority('Medium');
    setShowModal(true);
  };

  const handleOpenEdit = (task: MasterTask) => {
    setEditingTaskId(task.id);
    setName(task.name);
    setCategory(task.category);
    setTaskType(task.task_type);
    setRecurrence(task.recurrence);
    setUnit(task.unit);
    setAssignee(task.assignee);
    setInstruction(task.instruction);
    setEstimatedTime(task.estimated_time);
    setPriority(task.priority);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTaskId) {
      onUpdateMasterTask(editingTaskId, {
        name,
        category,
        task_type: taskType,
        recurrence,
        unit,
        assignee,
        instruction,
        estimated_time: Number(estimatedTime),
        priority
      });
    } else {
      onAddMasterTask({
        name,
        category,
        task_type: taskType,
        recurrence,
        unit,
        assignee,
        instruction,
        estimated_time: Number(estimatedTime),
        priority,
        status: 'Active'
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Master Task Management (Sheet: MasterTasks)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pengelolaan direktori tugas standar harian, mingguan, & rutin sekolah.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Master Task</span>
        </button>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeMasterTasks.map(task => (
          <div key={task.id} className="glass-card glass-card-hover p-5 rounded-2xl border flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                  {task.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  task.priority === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {task.priority}
                </span>
              </div>

              <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-2">{task.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.instruction}</p>

              <div className="mt-3 text-[11px] space-y-1 text-gray-600 dark:text-gray-300">
                <p>• Unit: <span className="font-semibold">{task.unit}</span></p>
                <p>• Tipe: <span className="font-semibold">{task.task_type}</span> ({task.recurrence})</p>
                <p>• Estimasi: <span className="font-semibold">{task.estimated_time} Menit</span></p>
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-between text-xs">
              <span className="text-[10px] text-gray-400">{task.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(task)}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteMasterTask(task.id)}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="glass-card w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                {editingTaskId ? 'Edit Master Task' : 'Tambah Master Task Baru'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Task</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Pembersihan Lapangan & Sanitasi Toilet PAUD"
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as TaskCategory)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                >
                  <option value="Pre Readiness">Pre Readiness (Max 09:00)</option>
                  <option value="Clock Out">Clock Out (Max 16:00)</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Job Bareng">Job Bareng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Tipe Pekerjaan</label>
                <select
                  value={taskType}
                  onChange={e => setTaskType(e.target.value as TaskType)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                >
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Event">Event</option>
                  <option value="General Cleaning">General Cleaning</option>
                  <option value="Fogging">Fogging</option>
                  <option value="Kerja Bakti">Kerja Bakti</option>
                  <option value="Moving">Moving</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Unit Kerja</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                >
                  <option value="All Unit">All Unit</option>
                  {units.map(u => (
                    <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Estimasi Durasi (Menit)</label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={e => setEstimatedTime(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Instruksi Kerja</label>
              <textarea
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                rows={3}
                placeholder="Petunjuk detail pekerjaan..."
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
