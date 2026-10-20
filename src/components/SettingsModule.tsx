import React, { useState } from 'react';
import {
  Settings,
  Clock,
  HardDrive,
  Link,
  Building2,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Flame,
  Database,
  Copy,
  Check,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import { AppSettings, User } from '../types';
import { firebaseConfig, testFirestoreConnection, seedInitialDataToFirestore } from '../services/firebase';

interface SettingsModuleProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onTestConnection: () => Promise<{ success: boolean; message: string }>;
  currentUser: User;
  firebaseStatus?: {
    connected: boolean;
    loading: boolean;
    projectId: string;
    error?: string;
  };
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onSaveSettings,
  onTestConnection,
  currentUser,
  firebaseStatus
}) => {
  const [preReadiness, setPreReadiness] = useState(settings.pre_readiness_limit || '09:00');
  const [clockOut, setClockOut] = useState(settings.clock_out_limit || '16:00');
  const [driveFolderId, setDriveFolderId] = useState(settings.google_drive_folder_id || '17_0Cldc-nCrrouWlfTjTo0iMa9mzH_iZz4M1u1Zy4bA');
  const [webAppUrl, setWebAppUrl] = useState(settings.web_app_url || '');
  const [schoolName, setSchoolName] = useState(settings.school_name || 'Lazuardi Global Compassionate School');
  const [schoolLogo, setSchoolLogo] = useState(settings.school_logo || '');
  const [autoRefresh, setAutoRefresh] = useState(settings.auto_refresh_interval || 30);

  // Apps Script Connection Test
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Firebase Firestore Connection Test
  const [testingFirebase, setTestingFirebase] = useState(false);
  const [firebaseTestResult, setFirebaseTestResult] = useState<{
    connected: boolean;
    message: string;
    details?: { usersCount: number; taskLogsCount: number; masterTasksCount: number };
  } | null>(null);

  // Firebase Seeding Action
  const [seedingFirebase, setSeedingFirebase] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  // Copy status
  const [copiedRules, setCopiedRules] = useState(false);

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Izinkan akses read & write untuk aplikasi Facility Management
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(sampleRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      pre_readiness_limit: preReadiness,
      clock_out_limit: clockOut,
      google_drive_folder_id: driveFolderId,
      web_app_url: webAppUrl,
      school_name: schoolName,
      school_logo: schoolLogo,
      auto_refresh_interval: Number(autoRefresh)
    });
    alert('Pengaturan sistem berhasil disimpan!');
  };

  const handleTestConn = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await onTestConnection();
    setTesting(false);
    setTestResult(res);
  };

  const handleTestFirebase = async () => {
    setTestingFirebase(true);
    setFirebaseTestResult(null);
    const res = await testFirestoreConnection();
    setTestingFirebase(false);
    setFirebaseTestResult(res);
  };

  const handleSeedFirebase = async (force = false) => {
    if (force && !confirm('Apakah Anda yakin ingin menimpa data di Firestore dengan data default awal?')) {
      return;
    }
    setSeedingFirebase(true);
    setSeedResult(null);
    const res = await seedInitialDataToFirestore(force);
    setSeedingFirebase(false);
    setSeedResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            Pengaturan Sistem & Database
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Konfigurasi koneksi Firebase Firestore, Google Drive, jam batas kerja, dan parameter aplikasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
            firebaseStatus?.connected
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Firebase: {firebaseConfig.projectId}</span>
          </span>
        </div>
      </div>

      {/* ========================================== */}
      {/* FIREBASE FIRESTORE DATABASE SECTION */}
      {/* ========================================== */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                Firebase Firestore Database
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Penyimpanan cloud real-time tersambung ke project <strong>{firebaseConfig.projectId}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestFirebase}
              disabled={testingFirebase}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingFirebase ? 'animate-spin' : ''}`} />
              <span>Uji Koneksi Firestore</span>
            </button>
            <button
              type="button"
              onClick={() => handleSeedFirebase(false)}
              disabled={seedingFirebase}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${seedingFirebase ? 'animate-spin' : ''}`} />
              <span>Sinkron / Inisialisasi Data ke Cloud</span>
            </button>
          </div>
        </div>

        {/* Test Connection Alert Box */}
        {firebaseTestResult && (
          <div className={`p-4 rounded-xl text-xs border flex items-start gap-3 ${
            firebaseTestResult.connected
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
          }`}>
            {firebaseTestResult.connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              <p className="font-bold">{firebaseTestResult.message}</p>
              {firebaseTestResult.details && (
                <p className="text-[11px] opacity-90">
                  Data Terbaca di Firestore: {firebaseTestResult.details.usersCount} Pengguna, {firebaseTestResult.details.masterTasksCount} Master Task, {firebaseTestResult.details.taskLogsCount} Log Tugas.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Seed Action Alert Box */}
        {seedResult && (
          <div className={`p-4 rounded-xl text-xs border flex items-start gap-3 ${
            seedResult.success
              ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
          }`}>
            {seedResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <p className="font-bold">{seedResult.message}</p>
          </div>
        )}

        {/* Firebase Config Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Project ID</span>
            <p className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100 truncate">{firebaseConfig.projectId}</p>
          </div>
          <div className="p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Auth Domain</span>
            <p className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100 truncate">{firebaseConfig.authDomain}</p>
          </div>
          <div className="p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Storage Bucket</span>
            <p className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100 truncate">{firebaseConfig.storageBucket}</p>
          </div>
          <div className="p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Messaging Sender ID</span>
            <p className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100">{firebaseConfig.messagingSenderId}</p>
          </div>
          <div className="p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60 sm:col-span-2">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Web App ID</span>
            <p className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100 truncate">{firebaseConfig.appId}</p>
          </div>
        </div>

        {/* Firestore Rules Tip & Recommendation */}
        <div className="p-4 bg-gray-50/70 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              Aturan Keamanan Firestore (Security Rules) di Firebase Console
            </span>
            <button
              type="button"
              onClick={handleCopyRules}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRules ? 'Tersalin!' : 'Salin Aturan'}</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Pastikan di Firebase Console &gt; <strong>Firestore Database</strong> &gt; tab <strong>Rules</strong> sudah mengizinkan baca & tulis:
          </p>
          <pre className="p-2.5 rounded-lg bg-gray-900 text-gray-100 text-[11px] font-mono overflow-x-auto">
            {sampleRules}
          </pre>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work Hours Settings */}
          <div className="glass-card p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Batas Jam Kerja & Auto Late
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Batas Jam Pre Readiness (Default: 09.00)
              </label>
              <input
                type="time"
                value={preReadiness}
                onChange={e => setPreReadiness(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border font-bold"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Pekerjaan kategori Pre Readiness yang selesai di atas jam ini otomatis berstatus LATE (merah).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Batas Jam Clock Out (Default: 16.00)
              </label>
              <input
                type="time"
                value={clockOut}
                onChange={e => setClockOut(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border font-bold"
              />
            </div>
          </div>

          {/* Google Drive & Web App Integration */}
          <div className="glass-card p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              Google Drive & Web App URL
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Folder ID Google Drive (Penyimpanan Foto)
              </label>
              <input
                type="text"
                value={driveFolderId}
                onChange={e => setDriveFolderId(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Google Apps Script Web App Executable URL
              </label>
              <input
                type="url"
                value={webAppUrl}
                onChange={e => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestConn}
                disabled={testing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>Uji Koneksi Backend Apps Script</span>
              </button>

              {testResult && (
                <div className={`mt-3 p-3 rounded-xl text-xs border ${
                  testResult.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  <p className="font-bold">{testResult.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Identity & Auto Refresh */}
        <div className="glass-card p-6 rounded-2xl border space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-500" />
            Identitas Lembaga & Auto Refresh
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Interval Auto-Refresh (Detik)</label>
              <input
                type="number"
                value={autoRefresh}
                onChange={e => setAutoRefresh(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-lg transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Pengaturan</span>
        </button>
      </form>
    </div>
  );
};
