import React, { useState } from 'react';
import { QrCode, Camera, CheckCircle2, Building2 } from 'lucide-react';
import { AppUnit, User } from '../types';

interface QrCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: AppUnit[];
  currentUser: User;
  onConfirmCheckIn: (unitCode: string) => void;
}

export const QrCheckInModal: React.FC<QrCheckInModalProps> = ({
  isOpen,
  onClose,
  units,
  currentUser,
  onConfirmCheckIn
}) => {
  const [selectedUnitCode, setSelectedUnitCode] = useState(currentUser.unit || 'SD');
  const [checkedInSuccess, setCheckedInSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setCheckedInSuccess(true);
    setTimeout(() => {
      onConfirmCheckIn(selectedUnitCode);
      setCheckedInSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-5 text-center">
        <div className="flex items-center justify-between border-b pb-3 text-left">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">QR Code Check-in Unit</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 font-bold text-lg">✕</button>
        </div>

        {checkedInSuccess ? (
          <div className="py-8 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-emerald-600">Check-in Berhasil!</h4>
            <p className="text-xs text-gray-500">
              Presensi kehadiran unit <span className="font-bold">{selectedUnitCode}</span> telah direkam.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pindai QR Code di lokasi unit sebelum memulai pengerjaan task harian.
            </p>

            {/* Visual Simulated Scanner Box */}
            <div className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-indigo-500 bg-gray-50 dark:bg-gray-800/80 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
              <QrCode className="w-20 h-20 text-indigo-600/80 dark:text-indigo-400/80 animate-pulse" />
              <div className="absolute inset-x-0 h-0.5 bg-indigo-500 animate-ping opacity-75" />
              <p className="text-[10px] text-gray-400 mt-2">Kamera Memindai Barcode Unit...</p>
            </div>

            {/* Unit Selector Simulation */}
            <div className="text-left space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Lokasi QR Unit Terdeteksi
              </label>
              <select
                value={selectedUnitCode}
                onChange={e => setSelectedUnitCode(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-100 dark:bg-gray-800 border font-bold"
              >
                {units.map(u => (
                  <option key={u.id} value={u.code}>
                    [QR-CODE-{u.code}] {u.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulateScan}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Konfirmasi Check-in Sekarang</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
