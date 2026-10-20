import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Search, ShieldCheck } from 'lucide-react';
import { User, UserRole, UserPosition, UserStatus, AppUnit } from '../types';

interface UserManagementProps {
  users: User[];
  units: AppUnit[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onSoftDeleteUser: (id: string) => void;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  units,
  onAddUser,
  onUpdateUser,
  onSoftDeleteUser
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form State
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [role, setRole] = useState<UserRole>('OfficeBoy');
  const [position, setPosition] = useState<UserPosition>('Staff');
  const [unit, setUnit] = useState('SD');
  const [inspectionUnit, setInspectionUnit] = useState('SD');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

  const activeUsers = users.filter(u => u.status === 'Active');

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setNama('');
    setUsername('');
    setPassword('123');
    setRole('OfficeBoy');
    setPosition('Staff');
    setUnit('SD');
    setInspectionUnit('SD');
    setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUserId(u.id);
    setNama(u.nama);
    setUsername(u.username);
    setPassword(u.password || '123');
    setRole(u.role);
    setPosition(u.position);
    setUnit(u.unit);
    setInspectionUnit(u.inspection_unit);
    setPhoto(u.photo);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !username.trim()) return;

    if (editingUserId) {
      onUpdateUser(editingUserId, {
        nama,
        username,
        password,
        role,
        position,
        unit,
        inspection_unit: inspectionUnit,
        photo
      });
    } else {
      onAddUser({
        nama,
        username,
        password,
        role,
        position,
        unit,
        inspection_unit: inspectionUnit,
        photo,
        status: 'Active',
        points: 0
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            User Personnel Management (Sheet: Users)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pengelolaan Admin, Koordinator, Office Boy, & Office Girl beserta wewenang unit.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Personnel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeUsers.map(u => (
          <div key={u.id} className="glass-card glass-card-hover p-5 rounded-2xl border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={u.photo} alt={u.nama} className="w-12 h-12 rounded-2xl object-cover border" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    u.role === 'Admin' ? 'bg-purple-100 text-purple-600' :
                    u.role === 'Coordinator' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {u.role}
                  </span>
                  <span className="text-[10px] text-gray-400">{u.position}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">{u.nama}</h3>
                <p className="text-xs text-gray-500">
                  Unit: <span className="font-semibold">{u.unit}</span> | Inspeksi: <span className="font-semibold">{u.inspection_unit}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleOpenEdit(u)}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-indigo-600"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSoftDeleteUser(u.id)}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="glass-card w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                {editingUserId ? 'Edit User Personnel' : 'Tambah User Personnel Baru'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border font-bold"
                >
                  <option value="Admin">Admin</option>
                  <option value="Coordinator">Coordinator</option>
                  <option value="OfficeBoy">OfficeBoy</option>
                  <option value="OfficeGirl">OfficeGirl</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Jabatan / Posisi</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value as UserPosition)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                >
                  <option value="Leader">Leader</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Unit Penugasan</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Wewenang Inspeksi Unit</label>
                <select
                  value={inspectionUnit}
                  onChange={e => setInspectionUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border font-bold text-indigo-600"
                >
                  <option value="ALL">ALL (Seluruh Unit)</option>
                  {units.map(u => (
                    <option key={u.id} value={u.code}>{u.code}</option>
                  ))}
                </select>
              </div>
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Simpan User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
