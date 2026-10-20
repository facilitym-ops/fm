import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  writeBatch,
  Firestore
} from 'firebase/firestore';

import {
  User,
  MasterTask,
  TaskLog,
  AppUnit,
  AppSettings,
  ActivityLog,
  AuditLog,
  InspectionHistoryItem
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

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCLFxSj4FlK3a1NaJFcJil56uc4BfdOHXY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "facility-management-syst-edd61.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "facility-management-syst-edd61",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "facility-management-syst-edd61.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "956542325719",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:956542325719:web:884e3abe553bf919373192"
};

// Initialize Firebase App singleton
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with ignoreUndefinedProperties to handle optional TypeScript properties smoothly
export const db: Firestore = (() => {
  try {
    return initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true
    });
  } catch {
    return getFirestore(firebaseApp);
  }
})();

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  UNITS: 'units',
  MASTER_TASKS: 'master_tasks',
  TASK_LOGS: 'task_logs',
  INSPECTION_HISTORY: 'inspection_history',
  SETTINGS: 'settings',
  ACTIVITY_LOGS: 'activity_logs',
  AUDIT_LOGS: 'audit_logs'
} as const;

// Helper to sanitize object before writing (removes undefined if needed)
function sanitize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ==========================================
// REAL-TIME SUBSCRIBERS
// ==========================================

export function subscribeToUsers(
  onUpdate: (users: User[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, COLLECTIONS.USERS);
  return onSnapshot(
    q,
    snapshot => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data: User[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as User);
      });
      onUpdate(data);
    },
    err => {
      console.warn('Firestore users subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToUnits(
  onUpdate: (units: AppUnit[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, COLLECTIONS.UNITS);
  return onSnapshot(
    q,
    snapshot => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data: AppUnit[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as AppUnit);
      });
      onUpdate(data);
    },
    err => {
      console.warn('Firestore units subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToMasterTasks(
  onUpdate: (tasks: MasterTask[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, COLLECTIONS.MASTER_TASKS);
  return onSnapshot(
    q,
    snapshot => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data: MasterTask[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as MasterTask);
      });
      onUpdate(data);
    },
    err => {
      console.warn('Firestore master_tasks subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToTaskLogs(
  onUpdate: (logs: TaskLog[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, COLLECTIONS.TASK_LOGS);
  return onSnapshot(
    q,
    snapshot => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data: TaskLog[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as TaskLog);
      });
      onUpdate(data);
    },
    err => {
      console.warn('Firestore task_logs subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToInspectionHistory(
  onUpdate: (history: InspectionHistoryItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, COLLECTIONS.INSPECTION_HISTORY);
  return onSnapshot(
    q,
    snapshot => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data: InspectionHistoryItem[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as InspectionHistoryItem);
      });
      // Sort newest first
      data.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      onUpdate(data);
    },
    err => {
      console.warn('Firestore inspection_history subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToSettings(
  onUpdate: (settings: AppSettings) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
  return onSnapshot(
    docRef,
    docSnap => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as AppSettings);
      }
    },
    err => {
      console.warn('Firestore settings subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToActivityLogs(
  onUpdate: (logs: ActivityLog[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, COLLECTIONS.ACTIVITY_LOGS);
  return onSnapshot(
    q,
    snapshot => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data: ActivityLog[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as ActivityLog);
      });
      data.sort((a, b) => (b.waktu || '').localeCompare(a.waktu || ''));
      onUpdate(data.slice(0, 300));
    },
    err => {
      console.warn('Firestore activity_logs subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToAuditLogs(
  onUpdate: (logs: AuditLog[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, COLLECTIONS.AUDIT_LOGS);
  return onSnapshot(
    q,
    snapshot => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data: AuditLog[] = [];
      snapshot.forEach(docSnap => {
        data.push(docSnap.data() as AuditLog);
      });
      data.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      onUpdate(data.slice(0, 300));
    },
    err => {
      console.warn('Firestore audit_logs subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// ==========================================
// WRITE / CRUD OPERATIONS TO FIRESTORE
// ==========================================

export async function setFirestoreUser(user: User): Promise<void> {
  const docRef = doc(db, COLLECTIONS.USERS, user.id);
  await setDoc(docRef, sanitize(user), { merge: true });
}

export async function setFirestoreUnit(unit: AppUnit): Promise<void> {
  const docRef = doc(db, COLLECTIONS.UNITS, unit.id);
  await setDoc(docRef, sanitize(unit), { merge: true });
}

export async function setFirestoreMasterTask(task: MasterTask): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MASTER_TASKS, task.id);
  await setDoc(docRef, sanitize(task), { merge: true });
}

export async function setFirestoreTaskLog(log: TaskLog): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TASK_LOGS, log.log_id);
  await setDoc(docRef, sanitize(log), { merge: true });
}

export async function addFirestoreInspectionHistory(item: InspectionHistoryItem): Promise<void> {
  const docRef = doc(db, COLLECTIONS.INSPECTION_HISTORY, item.inspection_id);
  await setDoc(docRef, sanitize(item), { merge: true });
}

export async function setFirestoreSettings(settings: AppSettings): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
  await setDoc(docRef, sanitize(settings), { merge: true });
}

export async function addFirestoreActivityLog(activity: ActivityLog): Promise<void> {
  const docRef = doc(db, COLLECTIONS.ACTIVITY_LOGS, activity.id);
  await setDoc(docRef, sanitize(activity), { merge: true });
}

export async function addFirestoreAuditLog(audit: AuditLog): Promise<void> {
  const docRef = doc(db, COLLECTIONS.AUDIT_LOGS, audit.id);
  await setDoc(docRef, sanitize(audit), { merge: true });
}

export async function deleteFirestoreUser(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.USERS, id);
  await deleteDoc(docRef);
}

export async function deleteFirestoreUnit(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.UNITS, id);
  await deleteDoc(docRef);
}

export async function deleteFirestoreMasterTask(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MASTER_TASKS, id);
  await deleteDoc(docRef);
}

export async function deleteFirestoreTaskLog(logId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TASK_LOGS, logId);
  await deleteDoc(docRef);
}

export async function setFirestoreMultipleTaskLogs(logs: TaskLog[]): Promise<void> {
  const chunkSize = 400;
  for (let i = 0; i < logs.length; i += chunkSize) {
    const chunk = logs.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    chunk.forEach(log => {
      const ref = doc(db, COLLECTIONS.TASK_LOGS, log.log_id);
      batch.set(ref, sanitize(log), { merge: true });
    });
    await batch.commit();
  }
}

// Batch write helper for seeding initial mock data to Firestore
export async function seedInitialDataToFirestore(force = false): Promise<{
  success: boolean;
  message: string;
  stats?: {
    users: number;
    units: number;
    masterTasks: number;
    taskLogs: number;
    inspectionHistory: number;
  };
}> {
  try {
    // Check if users collection already has data
    if (!force) {
      const snap = await getDocs(collection(db, COLLECTIONS.USERS));
      if (!snap.empty) {
        return {
          success: true,
          message: `Database Firestore sudah memiliki ${snap.size} user dan data aktif. Migrasi tidak dijalankan ulang (gunakan force untuk menimpa).`
        };
      }
    }

    const batch = writeBatch(db);

    // 1. Users
    INITIAL_USERS.forEach(u => {
      const ref = doc(db, COLLECTIONS.USERS, u.id);
      batch.set(ref, sanitize(u));
    });

    // 2. Units
    INITIAL_UNITS.forEach(u => {
      const ref = doc(db, COLLECTIONS.UNITS, u.id);
      batch.set(ref, sanitize(u));
    });

    // 3. Settings
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'general');
    batch.set(settingsRef, sanitize(INITIAL_SETTINGS));

    // 4. Master Tasks
    INITIAL_MASTER_TASKS.forEach(t => {
      const ref = doc(db, COLLECTIONS.MASTER_TASKS, t.id);
      batch.set(ref, sanitize(t));
    });

    // 5. Task Logs
    INITIAL_TASK_LOGS.forEach(l => {
      const ref = doc(db, COLLECTIONS.TASK_LOGS, l.log_id);
      batch.set(ref, sanitize(l));
    });

    // 6. Inspection History
    INITIAL_INSPECTION_HISTORY.forEach(h => {
      const ref = doc(db, COLLECTIONS.INSPECTION_HISTORY, h.inspection_id);
      batch.set(ref, sanitize(h));
    });

    // Commit batch
    await batch.commit();

    return {
      success: true,
      message: 'Berhasil mengunggah dan menyinkronkan seluruh Master Data & Log ke Firestore Firebase!',
      stats: {
        users: INITIAL_USERS.length,
        units: INITIAL_UNITS.length,
        masterTasks: INITIAL_MASTER_TASKS.length,
        taskLogs: INITIAL_TASK_LOGS.length,
        inspectionHistory: INITIAL_INSPECTION_HISTORY.length
      }
    };
  } catch (error: any) {
    console.error('Error seeding data to Firestore:', error);
    const isPermissionError = error?.code === 'permission-denied' || error?.message?.includes('permissions');
    const helpfulMsg = isPermissionError
      ? 'Akses ditolak oleh Aturan Keamanan Firestore (Missing or insufficient permissions). Di Firebase Console > Firestore Database > tab "Rules", ubah aturan menjadi allow read, write: if true; lalu klik Publish.'
      : (error?.message || 'Unknown error');
    return {
      success: false,
      message: `Gagal menginisialisasi data ke Firebase Firestore: ${helpfulMsg}`
    };
  }
}

// Test Firebase connection
export async function testFirestoreConnection(): Promise<{
  connected: boolean;
  message: string;
  projectId: string;
  details?: {
    usersCount: number;
    taskLogsCount: number;
    masterTasksCount: number;
  };
}> {
  try {
    const userSnap = await getDocs(collection(db, COLLECTIONS.USERS));
    const taskSnap = await getDocs(collection(db, COLLECTIONS.TASK_LOGS));
    const masterSnap = await getDocs(collection(db, COLLECTIONS.MASTER_TASKS));

    return {
      connected: true,
      message: `Terhubung dengan sukses ke Firebase Project [${firebaseConfig.projectId}]!`,
      projectId: firebaseConfig.projectId,
      details: {
        usersCount: userSnap.size,
        taskLogsCount: taskSnap.size,
        masterTasksCount: masterSnap.size
      }
    };
  } catch (err: any) {
    console.error('Firebase test connection error:', err);
    const isPermission = err?.code === 'permission-denied' || err?.message?.includes('permissions');
    const msg = isPermission
      ? `Akses diblokir oleh Aturan Keamanan (Missing or insufficient permissions). Buka Firebase Console > Firestore Database > tab Rules, lalu set: allow read, write: if true; dan klik Publish.`
      : (err?.message || 'Pastikan Firestore Database telah dibuat di Firebase Console dan aturan keamanan (Security Rules) mengizinkan akses.');

    return {
      connected: false,
      message: `Koneksi Firestore ditolak: ${msg}`,
      projectId: firebaseConfig.projectId
    };
  }
}
