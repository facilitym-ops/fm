import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { AdminDashboard } from './components/AdminDashboard';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { OfficeBoyDashboard } from './components/OfficeBoyDashboard';
import { MasterTaskManagement } from './components/MasterTaskManagement';
import { JobBarengModal } from './components/JobBarengModal';
import { UserManagement } from './components/UserManagement';
import { PerformanceModule } from './components/PerformanceModule';
import { AnalyticsModule } from './components/AnalyticsModule';
import { HistoryModule } from './components/HistoryModule';
import { CalendarModule } from './components/CalendarModule';
import { SettingsModule } from './components/SettingsModule';
import { LogsModule } from './components/LogsModule';
import { ExportModule } from './components/ExportModule';
import { QrCheckInModal } from './components/QrCheckInModal';
import { AppsScriptDocModal } from './components/AppsScriptDocModal';

import {
  User,
  UserRole,
  MasterTask,
  TaskLog,
  AppUnit,
  AppSettings,
  ActivityLog,
  AuditLog,
  InspectionHistoryItem,
  NotificationItem,
  InspectionChecklist
} from './types';

import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  addUser,
  updateUser,
  softDeleteUser,
  getUnits,
  addUnit,
  updateUnit,
  getMasterTasks,
  addMasterTask,
  updateMasterTask,
  softDeleteMasterTask,
  getTaskLogs,
  submitTaskWork,
  inspectTaskWork,
  createJobBareng,
  getInspectionHistory,
  getSettings,
  saveSettings,
  getActivityLogs,
  getAuditLogs,
  syncWithGoogleAppsScript,
  saveUsers,
  saveUnits,
  saveMasterTasks,
  saveTaskLogs,
  logActivity
} from './services/storage';

import {
  firebaseConfig,
  subscribeToUsers,
  subscribeToUnits,
  subscribeToMasterTasks,
  subscribeToTaskLogs,
  subscribeToInspectionHistory,
  subscribeToSettings,
  subscribeToActivityLogs,
  subscribeToAuditLogs,
  testFirestoreConnection,
  seedInitialDataToFirestore
} from './services/firebase';

export default function App() {
  const [currentUser, setLocalCurrentUser] = useState<User>(() => getCurrentUser() || getUsers()[0]);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Data States
  const [users, setUsers] = useState<User[]>(getUsers);
  const [units, setUnits] = useState<AppUnit[]>(getUnits);
  const [masterTasks, setMasterTasks] = useState<MasterTask[]>(getMasterTasks);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>(getTaskLogs);
  const [inspectionHistory, setInspectionHistory] = useState<InspectionHistoryItem[]>(getInspectionHistory);
  const [settings, setSettings] = useState<AppSettings>(getSettings);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(getActivityLogs);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getAuditLogs);

  // Firebase State
  const [firebaseStatus, setFirebaseStatus] = useState<{
    connected: boolean;
    loading: boolean;
    projectId: string;
    error?: string;
  }>({
    connected: false,
    loading: true,
    projectId: firebaseConfig.projectId
  });

  // Connect & Real-time Listeners for Firebase Firestore
  useEffect(() => {
    let isMounted = true;

    // Test initial Firestore connection
    testFirestoreConnection()
      .then(res => {
        if (!isMounted) return;
        setFirebaseStatus({
          connected: res.connected,
          loading: false,
          projectId: res.projectId,
          error: res.connected ? undefined : res.message
        });
        if (res.connected) {
          addNotification(
            'Firebase Terhubung',
            `Database Firestore aktif di project [${res.projectId}]. Sinkronisasi real-time berjalan.`,
            'success'
          );

          // If database is empty, automatically seed initial master tasks, units, and users
          if (res.details && res.details.usersCount === 0) {
            seedInitialDataToFirestore(false).then(seedRes => {
              if (seedRes.success) {
                addNotification(
                  'Inisialisasi Firestore Selesai',
                  'Seluruh Master Data awal telah berhasil diunggah dan disimpan ke Firestore.',
                  'info'
                );
              }
            }).catch(e => console.warn('Auto-seed notice:', e));
          }
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setFirebaseStatus({
          connected: false,
          loading: false,
          projectId: firebaseConfig.projectId,
          error: err?.message
        });
      });

    // Real-time listener for users
    const unsubUsers = subscribeToUsers(remoteUsers => {
      if (remoteUsers.length > 0) {
        setUsers(remoteUsers);
        saveUsers(remoteUsers);
      }
    });

    // Real-time listener for units
    const unsubUnits = subscribeToUnits(remoteUnits => {
      if (remoteUnits.length > 0) {
        setUnits(remoteUnits);
        saveUnits(remoteUnits);
      }
    });

    // Real-time listener for master tasks
    const unsubMasterTasks = subscribeToMasterTasks(remoteTasks => {
      if (remoteTasks.length > 0) {
        setMasterTasks(remoteTasks);
        saveMasterTasks(remoteTasks);
      }
    });

    // Real-time listener for task logs
    const unsubTaskLogs = subscribeToTaskLogs(remoteLogs => {
      if (remoteLogs.length > 0) {
        setTaskLogs(remoteLogs);
        saveTaskLogs(remoteLogs);
      }
    });

    // Real-time listener for inspection history
    const unsubInspection = subscribeToInspectionHistory(remoteHistory => {
      if (remoteHistory.length > 0) {
        setInspectionHistory(remoteHistory);
      }
    });

    // Real-time listener for settings
    const unsubSettings = subscribeToSettings(remoteSettings => {
      if (remoteSettings) {
        setSettings(remoteSettings);
      }
    });

    // Real-time listener for activity logs
    const unsubActivity = subscribeToActivityLogs(remoteActivity => {
      if (remoteActivity.length > 0) {
        setActivityLogs(remoteActivity);
      }
    });

    // Real-time listener for audit logs
    const unsubAudit = subscribeToAuditLogs(remoteAudit => {
      if (remoteAudit.length > 0) {
        setAuditLogs(remoteAudit);
      }
    });

    return () => {
      isMounted = false;
      unsubUsers();
      unsubUnits();
      unsubMasterTasks();
      unsubTaskLogs();
      unsubInspection();
      unsubSettings();
      unsubActivity();
      unsubAudit();
    };
  }, []);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Hari Ini');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('Semua');

  // Modals & Polling State
  const [showQrModal, setShowQrModal] = useState(false);
  const [showJobBarengModal, setShowJobBarengModal] = useState(false);
  const [showAppsScriptDoc, setShowAppsScriptDoc] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-01',
      title: 'Task Baru Diterima',
      message: 'Pembersihan Kaca & Sapu Lapangan Utama SD telah ditugaskan.',
      type: 'info',
      timestamp: '07:15',
      read: false
    },
    {
      id: 'NOTIF-02',
      title: 'Inspeksi Disetujui (Approved)',
      message: 'Task Sanitasi Paud & TK disetujui dengan Skor 90 oleh Hendra Wijaya.',
      type: 'success',
      timestamp: '08:25',
      read: false
    }
  ]);

  // Apply Dark Mode Class to HTML Root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 30-Second Auto Refresh Polling
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData(true);
    }, (settings.auto_refresh_interval || 30) * 1000);
    return () => clearInterval(interval);
  }, [settings.auto_refresh_interval]);

  const refreshData = (silent = false) => {
    if (!silent) setIsRefreshing(true);
    setTaskLogs(getTaskLogs());
    setUsers(getUsers());
    setUnits(getUnits());
    setMasterTasks(getMasterTasks());
    setInspectionHistory(getInspectionHistory());
    setActivityLogs(getActivityLogs());
    setAuditLogs(getAuditLogs());
    if (!silent) {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Switch User Role Quick Tester
  const handleSwitchUserRole = (role: UserRole) => {
    const found = users.find(u => u.role === role) || users[0];
    setLocalCurrentUser(found);
    setCurrentUser(found);
    addNotification('Akses Diubah', `Anda sekarang masuk sebagai ${found.nama} (${role})`, 'info');
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Submit Work Action
  const handleSubmitWork = (
    logId: string,
    data: {
      before_photo: string;
      after_photo: string;
      jam_mulai: string;
      jam_selesai: string;
      durasi: number;
    }
  ) => {
    const updated = submitTaskWork(logId, data, currentUser);
    if (updated) {
      refreshData(true);
      confetti({ particleCount: 50, spread: 60 });
      addNotification('Pekerjaan Disubmit', `Task ${updated.task_name} berhasil dikirim untuk inspeksi!`, 'success');
    }
  };

  // Inspect Task Action
  const handleInspectTask = (
    logId: string,
    data: {
      approval: 'Approved' | 'Rejected';
      score: number;
      inspection_note: string;
      checklist: InspectionChecklist;
    }
  ) => {
    const updated = inspectTaskWork(logId, data, currentUser);
    if (updated) {
      refreshData(true);
      if (data.approval === 'Approved') {
        confetti({ particleCount: 80, spread: 80 });
        addNotification('Inspeksi Approved', `Task ${updated.task_name} telah disetujui dengan skor ${data.score}!`, 'success');
      } else {
        addNotification('Task Rejected', `Task ${updated.task_name} ditolak. Diharuskan melakukan rework!`, 'error');
      }
    }
  };

  // Create Job Bareng Action
  const handleCreateJobBareng = (data: {
    name: string;
    task_type: MasterTask['task_type'];
    target_unit: string;
    instruction: string;
    estimated_time: number;
    priority: MasterTask['priority'];
  }) => {
    createJobBareng(data, currentUser);
    refreshData(true);
    addNotification('Job Bareng Ditugaskan', `Job Bareng "${data.name}" berhasil dibuat untuk ${data.target_unit}!`, 'success');
  };

  // Master Task CRUD
  const handleAddMasterTask = (task: Omit<MasterTask, 'id' | 'created_at' | 'updated_at'>) => {
    addMasterTask(task, currentUser.nama);
    refreshData(true);
    addNotification('Master Task Dibuat', `Task ${task.name} berhasil ditambahkan.`, 'success');
  };

  const handleUpdateMasterTask = (id: string, updates: Partial<MasterTask>) => {
    updateMasterTask(id, updates, currentUser.nama);
    refreshData(true);
  };

  const handleDeleteMasterTask = (id: string) => {
    softDeleteMasterTask(id, currentUser.nama);
    refreshData(true);
  };

  // User CRUD
  const handleAddUser = (user: Omit<User, 'id'>) => {
    addUser(user, currentUser.nama);
    refreshData(true);
    addNotification('User Dibuat', `Personnel ${user.nama} berhasil ditambahkan.`, 'success');
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    updateUser(id, updates, currentUser.nama);
    refreshData(true);
  };

  const handleSoftDeleteUser = (id: string) => {
    softDeleteUser(id, currentUser.nama);
    refreshData(true);
  };

  // QR Check-in Action
  const handleConfirmQrCheckIn = (unitCode: string) => {
    // 1. Log Activity & Audit
    logActivity(
      currentUser.nama,
      currentUser.role,
      unitCode,
      `Presensi Mandiri QR Code Berhasil di Unit: ${unitCode}`
    );

    // 2. Mark today's tasks for this user & unit with qr_checked_in: true
    const today = new Date().toISOString().split('T')[0];
    const updatedLogs = taskLogs.map(log => {
      if (log.user === currentUser.id && log.tanggal === today && (log.unit === unitCode || unitCode === 'ALL')) {
        return { ...log, qr_checked_in: true };
      }
      return log;
    });

    saveTaskLogs(updatedLogs);
    setTaskLogs(updatedLogs);
    addNotification('QR Presensi Berhasil', `Check-in lokasi unit ${unitCode} berhasil dicatat & disinkronkan ke Firestore.`, 'success');
  };

  // Settings Save
  const handleSaveSettings = (newSettings: AppSettings) => {
    saveSettings(newSettings, currentUser.nama);
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchUserRole={handleSwitchUserRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAppsScriptDoc={() => setShowAppsScriptDoc(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar Header */}
        <TopNavbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          selectedUnitFilter={selectedUnitFilter}
          setSelectedUnitFilter={setSelectedUnitFilter}
          units={units}
          currentUser={currentUser}
          onOpenQrScanner={() => setShowQrModal(true)}
          onOpenJobBarengModal={() => setShowJobBarengModal(true)}
          onRefresh={() => refreshData(false)}
          isRefreshing={isRefreshing}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          firebaseStatus={firebaseStatus}
          onOpenSettings={() => setCurrentTab('settings')}
        />

        {/* Dynamic Page Views */}
        <main className="p-6 flex-1 space-y-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            currentUser.role === 'Admin' ? (
              <AdminDashboard
                taskLogs={taskLogs}
                users={users}
                units={units}
                onSelectTab={setCurrentTab}
              />
            ) : currentUser.role === 'Coordinator' ? (
              <CoordinatorDashboard
                currentUser={currentUser}
                taskLogs={taskLogs}
                onInspectTask={handleInspectTask}
                onSubmitPersonalTask={logId => {
                  submitTaskWork(logId, {
                    before_photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
                    after_photo: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500',
                    jam_mulai: '07:30',
                    jam_selesai: '08:15',
                    durasi: 45
                  }, currentUser);
                  refreshData(true);
                }}
              />
            ) : (
              <OfficeBoyDashboard
                currentUser={currentUser}
                taskLogs={taskLogs}
                onSubmitWork={handleSubmitWork}
                onOpenQrScanner={() => setShowQrModal(true)}
              />
            )
          )}

          {(currentTab === 'tasks_today' || currentTab === 'my_tasks') && (
            <OfficeBoyDashboard
              currentUser={currentUser}
              taskLogs={taskLogs}
              onSubmitWork={handleSubmitWork}
              onOpenQrScanner={() => setShowQrModal(true)}
            />
          )}

          {currentTab === 'master_task' && (
            <MasterTaskManagement
              masterTasks={masterTasks}
              users={users}
              units={units}
              onAddMasterTask={handleAddMasterTask}
              onUpdateMasterTask={handleUpdateMasterTask}
              onDeleteMasterTask={handleDeleteMasterTask}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'users' && (
            <UserManagement
              users={users}
              units={units}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onSoftDeleteUser={handleSoftDeleteUser}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'inspection' && (
            <CoordinatorDashboard
              currentUser={currentUser}
              taskLogs={taskLogs}
              onInspectTask={handleInspectTask}
              onSubmitPersonalTask={() => {}}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsModule
              taskLogs={taskLogs}
              users={users}
              units={units}
            />
          )}

          {currentTab === 'performance' && (
            <PerformanceModule
              users={users}
              taskLogs={taskLogs}
              units={units}
            />
          )}

          {currentTab === 'history' && (
            <HistoryModule
              taskLogs={taskLogs}
              inspectionHistory={inspectionHistory}
              searchTerm={searchTerm}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarModule taskLogs={taskLogs} />
          )}

          {currentTab === 'settings' && (
            <SettingsModule
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onTestConnection={syncWithGoogleAppsScript}
              currentUser={currentUser}
              firebaseStatus={firebaseStatus}
            />
          )}

          {currentTab === 'export' && (
            <ExportModule
              taskLogs={taskLogs}
              users={users}
              units={units}
              schoolName={settings.school_name}
            />
          )}

          {currentTab === 'activity_log' && (
            <LogsModule activityLogs={activityLogs} auditLogs={auditLogs} />
          )}

          {currentTab === 'audit_log' && (
            <LogsModule activityLogs={activityLogs} auditLogs={auditLogs} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <QrCheckInModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        units={units}
        currentUser={currentUser}
        onConfirmCheckIn={handleConfirmQrCheckIn}
      />

      <JobBarengModal
        isOpen={showJobBarengModal}
        onClose={() => setShowJobBarengModal(false)}
        units={units}
        onCreateJobBareng={handleCreateJobBareng}
      />

      <AppsScriptDocModal
        isOpen={showAppsScriptDoc}
        onClose={() => setShowAppsScriptDoc(false)}
        spreadsheetId={settings.google_drive_folder_id}
      />
    </div>
  );
}
