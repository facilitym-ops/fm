import {
  User,
  MasterTask,
  TaskLog,
  AppUnit,
  AppSettings,
  ActivityLog,
  AuditLog,
  InspectionHistoryItem,
  InspectionChecklist,
  TaskStatus,
  ApprovalStatus
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_UNITS,
  INITIAL_SETTINGS,
  INITIAL_MASTER_TASKS,
  INITIAL_TASK_LOGS,
  INITIAL_INSPECTION_HISTORY,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

import {
  setFirestoreUser,
  setFirestoreUnit,
  setFirestoreMasterTask,
  setFirestoreTaskLog,
  addFirestoreInspectionHistory,
  setFirestoreSettings,
  addFirestoreActivityLog,
  addFirestoreAuditLog,
  setFirestoreMultipleTaskLogs
} from './firebase';

const KEYS = {
  USERS: 'ob_og_users_v2',
  UNITS: 'ob_og_units_v2',
  SETTINGS: 'ob_og_settings_v2',
  MASTER_TASKS: 'ob_og_master_tasks_v2',
  TASK_LOGS: 'ob_og_task_logs_v2',
  INSPECTION_HISTORY: 'ob_og_inspection_history_v2',
  ACTIVITY_LOGS: 'ob_og_activity_logs_v2',
  AUDIT_LOGS: 'ob_og_audit_logs_v2',
  CURRENT_USER: 'ob_og_current_user_v2'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
}

// Current User State
export function getCurrentUser(): User | null {
  const user = getLocal<User | null>(KEYS.CURRENT_USER, null);
  if (!user) {
    // Default to Admin Budi Santoso for initial view
    const users = getUsers();
    const admin = users.find(u => u.role === 'Admin') || users[0];
    setCurrentUser(admin);
    return admin;
  }
  return user;
}

export function setCurrentUser(user: User | null): void {
  setLocal(KEYS.CURRENT_USER, user);
}

// Users Management
export function getUsers(): User[] {
  return getLocal<User[]>(KEYS.USERS, INITIAL_USERS);
}

export function saveUsers(users: User[]): void {
  setLocal(KEYS.USERS, users);
}

export function addUser(user: Omit<User, 'id'>, actorName: string): User {
  const users = getUsers();
  const id = `USR-${String(users.length + 1).padStart(3, '0')}`;
  const newUser: User = { ...user, id, points: user.points || 0 };
  users.push(newUser);
  saveUsers(users);
  
  // Sync to Firestore
  setFirestoreUser(newUser).catch(err => console.warn('Firestore sync user error:', err));

  logActivity(actorName, 'Admin', user.unit, `Membuat user baru: ${user.nama} (${user.role})`);
  logAudit('User', id, 'CREATE', actorName, undefined, JSON.stringify(newUser));
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>, actorName: string): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  const oldVal = { ...users[index] };
  const updated = { ...users[index], ...updates };
  users[index] = updated;
  saveUsers(users);

  // Sync to Firestore
  setFirestoreUser(updated).catch(err => console.warn('Firestore sync user error:', err));

  logActivity(actorName, 'Admin', updated.unit, `Mengubah data user: ${updated.nama}`);
  logAudit('User', id, 'UPDATE', actorName, JSON.stringify(oldVal), JSON.stringify(updated));
  return updated;
}

export function softDeleteUser(id: string, actorName: string): boolean {
  const users = getUsers();
  const target = users.find(u => u.id === id);
  if (!target) return false;

  const oldVal = { ...target };
  target.status = 'Inactive';
  saveUsers(users);

  // Sync to Firestore
  setFirestoreUser(target).catch(err => console.warn('Firestore sync user error:', err));

  logActivity(actorName, 'Admin', target.unit, `Soft Delete / Deaktivasi user: ${target.nama}`);
  logAudit('User', id, 'SOFT_DELETE', actorName, JSON.stringify(oldVal), JSON.stringify(target));
  return true;
}

// Units Management
export function getUnits(): AppUnit[] {
  return getLocal<AppUnit[]>(KEYS.UNITS, INITIAL_UNITS);
}

export function saveUnits(units: AppUnit[]): void {
  setLocal(KEYS.UNITS, units);
}

export function addUnit(unit: Omit<AppUnit, 'id'>, actorName: string): AppUnit {
  const units = getUnits();
  const id = `U-${String(units.length + 1).padStart(3, '0')}`;
  const newUnit: AppUnit = { ...unit, id };
  units.push(newUnit);
  saveUnits(units);

  // Sync to Firestore
  setFirestoreUnit(newUnit).catch(err => console.warn('Firestore sync unit error:', err));

  logActivity(actorName, 'Admin', unit.code, `Membuat unit baru: ${unit.name}`);
  logAudit('Unit', id, 'CREATE', actorName, undefined, JSON.stringify(newUnit));
  return newUnit;
}

export function updateUnit(id: string, updates: Partial<AppUnit>, actorName: string): AppUnit | null {
  const units = getUnits();
  const idx = units.findIndex(u => u.id === id);
  if (idx === -1) return null;

  const oldVal = { ...units[idx] };
  const updated = { ...units[idx], ...updates };
  units[idx] = updated;
  saveUnits(units);

  // Sync to Firestore
  setFirestoreUnit(updated).catch(err => console.warn('Firestore sync unit error:', err));

  logActivity(actorName, 'Admin', updated.code, `Mengubah unit: ${updated.name}`);
  logAudit('Unit', id, 'UPDATE', actorName, JSON.stringify(oldVal), JSON.stringify(updated));
  return updated;
}

// Master Tasks Management
export function getMasterTasks(): MasterTask[] {
  return getLocal<MasterTask[]>(KEYS.MASTER_TASKS, INITIAL_MASTER_TASKS);
}

export function saveMasterTasks(tasks: MasterTask[]): void {
  setLocal(KEYS.MASTER_TASKS, tasks);
}

export function addMasterTask(task: Omit<MasterTask, 'id' | 'created_at' | 'updated_at'>, actorName: string): MasterTask {
  const tasks = getMasterTasks();
  const id = `TSK-${String(tasks.length + 101).padStart(3, '0')}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const newTask: MasterTask = {
    ...task,
    id,
    created_at: now,
    updated_at: now
  };
  tasks.push(newTask);
  saveMasterTasks(tasks);

  // Sync to Firestore
  setFirestoreMasterTask(newTask).catch(err => console.warn('Firestore sync master task error:', err));

  logActivity(actorName, 'Admin', task.unit, `Membuat Master Task: ${task.name}`);
  logAudit('MasterTask', id, 'CREATE', actorName, undefined, JSON.stringify(newTask));

  // Automatically generate task log for today if active
  generateTaskLogsFromMaster([newTask]);

  return newTask;
}

export function updateMasterTask(id: string, updates: Partial<MasterTask>, actorName: string): MasterTask | null {
  const tasks = getMasterTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;

  const oldVal = { ...tasks[idx] };
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const updated = { ...tasks[idx], ...updates, updated_at: now };
  tasks[idx] = updated;
  saveMasterTasks(tasks);

  // Sync to Firestore
  setFirestoreMasterTask(updated).catch(err => console.warn('Firestore sync master task error:', err));

  logActivity(actorName, 'Admin', updated.unit, `Mengubah Master Task: ${updated.name}`);
  logAudit('MasterTask', id, 'UPDATE', actorName, JSON.stringify(oldVal), JSON.stringify(updated));
  return updated;
}

export function softDeleteMasterTask(id: string, actorName: string): boolean {
  const tasks = getMasterTasks();
  const target = tasks.find(t => t.id === id);
  if (!target) return false;

  const oldVal = { ...target };
  target.status = 'Inactive';
  saveMasterTasks(tasks);

  // Sync to Firestore
  setFirestoreMasterTask(target).catch(err => console.warn('Firestore sync master task error:', err));

  logActivity(actorName, 'Admin', target.unit, `Soft Delete Master Task: ${target.name}`);
  logAudit('MasterTask', id, 'SOFT_DELETE', actorName, JSON.stringify(oldVal), JSON.stringify(target));
  return true;
}

// Task Logs Management
export function getTaskLogs(): TaskLog[] {
  const logs = getLocal<TaskLog[]>(KEYS.TASK_LOGS, INITIAL_TASK_LOGS);
  return checkAndMarkAutoLate(logs);
}

export function saveTaskLogs(logs: TaskLog[], syncFirestore = true): void {
  setLocal(KEYS.TASK_LOGS, logs);
  if (syncFirestore) {
    setFirestoreMultipleTaskLogs(logs).catch(err => console.warn('Firestore bulk sync error:', err));
  }
}

// Auto Late Checker
export function checkAndMarkAutoLate(logs: TaskLog[]): TaskLog[] {
  const settings = getSettings();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  let modified = false;

  const updatedLogs = logs.map(log => {
    // If completed or already late, no change needed
    if (log.status === 'Done' || log.status === 'Rejected' || log.status === 'Rework') {
      return log;
    }

    let isLate = false;
    if (log.category === 'Pre Readiness' && currentTime > settings.pre_readiness_limit) {
      isLate = true;
    } else if (log.category === 'Clock Out' && currentTime > settings.clock_out_limit) {
      isLate = true;
    }

    if (isLate && log.late !== 'Yes') {
      modified = true;
      return {
        ...log,
        late: 'Yes' as const,
        status: log.status === 'Pending' ? 'Late' as const : log.status
      };
    }
    return log;
  });

  if (modified) {
    saveTaskLogs(updatedLogs);
  }
  return updatedLogs;
}

// Generate Today's Task Logs from Master Tasks if missing
export function generateTaskLogsFromMaster(masterList?: MasterTask[]): void {
  const masters = masterList || getMasterTasks();
  const logs = getLocal<TaskLog[]>(KEYS.TASK_LOGS, INITIAL_TASK_LOGS);
  const users = getUsers();
  const today = new Date().toISOString().split('T')[0];

  let addedCount = 0;

  masters.forEach(master => {
    if (master.status !== 'Active') return;

    // Determine assignees
    let targetUsers: User[] = [];
    if (master.assignee === 'ALL_OB') {
      targetUsers = users.filter(u => 
        (u.role === 'OfficeBoy' || u.role === 'OfficeGirl') &&
        u.status === 'Active' &&
        (master.unit === 'All Unit' || u.unit === master.unit)
      );
    } else if (master.assignee && master.assignee !== 'UNASSIGNED') {
      const u = users.find(usr => usr.id === master.assignee);
      if (u) targetUsers.push(u);
    } else {
      // Find OBs in the master task's unit
      targetUsers = users.filter(u => 
        (u.role === 'OfficeBoy' || u.role === 'OfficeGirl') &&
        u.status === 'Active' &&
        u.unit === master.unit
      );
    }

    targetUsers.forEach(u => {
      const exists = logs.some(l => l.task_id === master.id && l.tanggal === today && l.user === u.id);
      if (!exists) {
        addedCount++;
        const logId = `LOG-${today.replace(/-/g, '')}-${String(logs.length + addedCount).padStart(2, '0')}`;
        const newLog: TaskLog = {
          log_id: logId,
          task_id: master.id,
          task_name: master.name,
          category: master.category,
          task_type: master.task_type,
          tanggal: today,
          unit: u.unit,
          user: u.id,
          user_name: u.nama,
          status: 'Pending',
          late: 'No',
          approval: 'Waiting',
          rework: 0,
          created_at: `${today} 07:00`,
          timeline: [
            {
              timestamp: '07:00',
              status: 'Task Dibuat Otomatis',
              actor: 'System',
              role: 'System'
            }
          ]
        };
        logs.push(newLog);
      }
    });
  });

  if (addedCount > 0) {
    saveTaskLogs(logs);
  }
}

// Submit Work (Before & After Photo, Checklist, Notes)
export function submitTaskWork(
  logId: string,
  data: {
    before_photo: string;
    after_photo: string;
    jam_mulai: string;
    jam_selesai: string;
    durasi: number;
    checklist?: InspectionChecklist;
  },
  actor: User
): TaskLog | null {
  const logs = getTaskLogs();
  const idx = logs.findIndex(l => l.log_id === logId);
  if (idx === -1) return null;

  const oldVal = { ...logs[idx] };
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updated: TaskLog = {
    ...logs[idx],
    before_photo: data.before_photo,
    after_photo: data.after_photo,
    jam_mulai: data.jam_mulai || logs[idx].jam_mulai || nowStr,
    jam_selesai: data.jam_selesai || nowStr,
    durasi: data.durasi,
    status: 'Done',
    approval: 'Waiting',
    timeline: [
      ...logs[idx].timeline,
      {
        timestamp: nowStr,
        status: logs[idx].rework > 0 ? 'Submit Ulang (Rework)' : 'Submit Pekerjaan Selesai',
        actor: actor.nama,
        role: actor.role,
        note: 'Foto Before/After telah diunggah.'
      }
    ]
  };

  logs[idx] = updated;
  saveTaskLogs(logs);

  // Sync to Firestore
  setFirestoreTaskLog(updated).catch(err => console.warn('Firestore sync task log error:', err));

  logActivity(actor.nama, actor.role, actor.unit, `Submit pekerjaan: ${updated.task_name} (${updated.log_id})`);
  logAudit('TaskLog', logId, 'UPDATE', actor.nama, JSON.stringify(oldVal), JSON.stringify(updated));

  return updated;
}

// Inspect & Grade Task (Approve / Reject)
export function inspectTaskWork(
  logId: string,
  data: {
    approval: 'Approved' | 'Rejected';
    score: number;
    inspection_note: string;
    checklist: InspectionChecklist;
  },
  inspector: User
): TaskLog | null {
  const logs = getTaskLogs();
  const idx = logs.findIndex(l => l.log_id === logId);
  if (idx === -1) return null;

  const oldVal = { ...logs[idx] };
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isApproved = data.approval === 'Approved';

  const updated: TaskLog = {
    ...logs[idx],
    approval: data.approval,
    score: data.score,
    inspection_note: data.inspection_note,
    checklist: data.checklist,
    inspector: inspector.id,
    inspector_name: inspector.nama,
    status: isApproved ? 'Done' : 'Rejected',
    rework: isApproved ? logs[idx].rework : logs[idx].rework + 1,
    timeline: [
      ...logs[idx].timeline,
      {
        timestamp: nowStr,
        status: isApproved ? 'Approved oleh Inspector' : 'Rejected - Pending Rework',
        actor: inspector.nama,
        role: inspector.role,
        note: `Skor: ${data.score}. ${data.inspection_note || ''}`
      }
    ]
  };

  logs[idx] = updated;
  saveTaskLogs(logs);

  // Sync task log to Firestore
  setFirestoreTaskLog(updated).catch(err => console.warn('Firestore sync task log error:', err));

  // If approved, add points to OB
  if (isApproved) {
    const users = getUsers();
    const ob = users.find(u => u.id === updated.user);
    if (ob) {
      const addedPoints = data.score;
      ob.points = (ob.points || 0) + addedPoints;
      saveUsers(users);
      setFirestoreUser(ob).catch(err => console.warn('Firestore sync user points error:', err));
    }
  }

  // Record Inspection History Item
  const inspectionItem: InspectionHistoryItem = {
    inspection_id: `INSP-${Date.now().toString().slice(-6)}`,
    task_id: updated.task_id,
    task_name: updated.task_name,
    tanggal: updated.tanggal,
    jam: nowStr,
    inspector_id: inspector.id,
    inspector_name: inspector.nama,
    inspector_role: inspector.role,
    unit: updated.unit,
    office_boy_id: updated.user,
    office_boy_name: updated.user_name,
    status_sebelum: oldVal.status,
    status_sesudah: updated.status,
    approval: data.approval,
    score: data.score,
    checklist: data.checklist,
    catatan: data.inspection_note,
    jumlah_rework: updated.rework,
    before_photo: updated.before_photo,
    after_photo: updated.after_photo,
    timestamp: `${updated.tanggal} ${nowStr}`
  };
  addInspectionHistory(inspectionItem);

  logActivity(
    inspector.nama,
    inspector.role,
    inspector.unit,
    `${data.approval === 'Approved' ? 'Approve' : 'Reject'} task: ${updated.task_name} milik ${updated.user_name} (Nilai: ${data.score})`
  );
  logAudit('TaskLog', logId, 'UPDATE', inspector.nama, JSON.stringify(oldVal), JSON.stringify(updated));

  return updated;
}

// Create Job Bareng across All Units or Selected Units
export function createJobBareng(
  data: {
    name: string;
    task_type: MasterTask['task_type'];
    target_unit: string; // "All Unit" or specific unit code
    instruction: string;
    estimated_time: number;
    priority: MasterTask['priority'];
  },
  admin: User
): void {
  // Add to Master Tasks
  const master = addMasterTask(
    {
      name: `[Job Bareng] ${data.name}`,
      category: 'Job Bareng',
      task_type: data.task_type,
      recurrence: 'Daily',
      unit: data.target_unit,
      assignee: 'ALL_OB',
      instruction: data.instruction,
      estimated_time: data.estimated_time,
      priority: data.priority,
      status: 'Active'
    },
    admin.nama
  );

  logActivity(admin.nama, 'Admin', data.target_unit, `Membuat Job Bareng Massal: ${data.name}`);
}

// Inspection History
export function getInspectionHistory(): InspectionHistoryItem[] {
  return getLocal<InspectionHistoryItem[]>(KEYS.INSPECTION_HISTORY, INITIAL_INSPECTION_HISTORY);
}

export function addInspectionHistory(item: InspectionHistoryItem): void {
  const history = getInspectionHistory();
  history.unshift(item);
  setLocal(KEYS.INSPECTION_HISTORY, history);

  // Sync to Firestore
  addFirestoreInspectionHistory(item).catch(err => console.warn('Firestore sync inspection error:', err));
}

// Settings
export function getSettings(): AppSettings {
  return getLocal<AppSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function saveSettings(settings: AppSettings, actorName: string): void {
  const oldVal = getSettings();
  setLocal(KEYS.SETTINGS, settings);

  // Sync to Firestore
  setFirestoreSettings(settings).catch(err => console.warn('Firestore sync settings error:', err));

  logActivity(actorName, 'Admin', 'Pusat', 'Mengubah Pengaturan Sistem & Batas Jam Kerja');
  logAudit('Settings', 'GLOBAL_SETTINGS', 'UPDATE', actorName, JSON.stringify(oldVal), JSON.stringify(settings));
}

// Activity Logs
export function getActivityLogs(): ActivityLog[] {
  return getLocal<ActivityLog[]>(KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
}

export function logActivity(user_name: string, role: string, unit: string, aktivitas: string): void {
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    id: `ACT-${Date.now().toString().slice(-6)}`,
    user: user_name,
    user_name,
    role,
    unit,
    aktivitas,
    waktu: new Date().toISOString().replace('T', ' ').slice(0, 19),
    ip: '182.253.12.98',
    device: 'Web Client / Apps Script'
  };
  logs.unshift(newLog);
  setLocal(KEYS.ACTIVITY_LOGS, logs.slice(0, 500)); // limit to 500

  // Sync to Firestore
  addFirestoreActivityLog(newLog).catch(err => console.warn('Firestore sync activity error:', err));
}

// Audit Logs
export function getAuditLogs(): AuditLog[] {
  return getLocal<AuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
}

export function logAudit(
  entity: string,
  entity_id: string,
  action: AuditLog['action'],
  changed_by: string,
  old_value?: string,
  new_value?: string
): void {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: `AUD-${Date.now().toString().slice(-6)}`,
    entity,
    entity_id,
    action,
    changed_by,
    old_value,
    new_value,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };
  logs.unshift(newLog);
  setLocal(KEYS.AUDIT_LOGS, logs.slice(0, 500));

  // Sync to Firestore
  addFirestoreAuditLog(newLog).catch(err => console.warn('Firestore sync audit error:', err));
}

// Sync with Remote Google Apps Script Web App Endpoint if provided
export async function syncWithGoogleAppsScript(): Promise<{ success: boolean; message: string }> {
  const settings = getSettings();
  if (!settings.web_app_url || settings.web_app_url.includes('EXAMPLE')) {
    return {
      success: true,
      message: 'Mode Lokal & Spreadsheet Simulation Aktif. Google Apps Script Endpoint belum dikonfigurasi.'
    };
  }

  try {
    const res = await fetch(`${settings.web_app_url}?action=ping`, { mode: 'cors' });
    const data = await res.json();
    if (data && data.status === 'success') {
      return { success: true, message: 'Berhasil terhubung ke Google Apps Script Web App Backend!' };
    }
    return { success: false, message: 'Google Apps Script merespons tetapi format data tidak dikenal.' };
  } catch (e) {
    return {
      success: false,
      message: 'Gagal terhubung ke URL Google Apps Script Web App. Pastikan Deployment diset ke Anyone.'
    };
  }
}
