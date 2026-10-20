export type UserRole = 'Admin' | 'Coordinator' | 'OfficeBoy' | 'OfficeGirl';
export type UserPosition = 'Leader' | 'Staff';
export type UserStatus = 'Active' | 'Inactive' | 'Archived';

export interface User {
  id: string;
  nama: string;
  username: string;
  password?: string;
  role: UserRole;
  position: UserPosition;
  unit: string;
  inspection_unit: string; // e.g. "TK", "SD", "SMP", "Pelangi", "Direktorat", "Ar Razi", "Khaldun" or "ALL"
  photo: string;
  status: UserStatus;
  points?: number;
}

export type TaskCategory = 'Pre Readiness' | 'Clock Out' | 'Inspection' | 'Job Bareng';
export type TaskType = 
  | 'Cleaning' 
  | 'Maintenance' 
  | 'Inspection' 
  | 'Event' 
  | 'General Cleaning' 
  | 'Fogging' 
  | 'Kerja Bakti' 
  | 'Moving' 
  | 'Other';
export type TaskRecurrence = 'Daily' | 'Weekly' | 'Monthly';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface MasterTask {
  id: string;
  name: string;
  category: TaskCategory;
  task_type: TaskType;
  recurrence: TaskRecurrence;
  unit: string; // Specific unit or "All Unit"
  assignee: string; // Specific user ID, "ALL_OB", or "UNASSIGNED"
  instruction: string;
  photo_guide?: string;
  estimated_time: number; // in minutes
  priority: TaskPriority;
  status: 'Active' | 'Inactive' | 'Archived';
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'Pending' | 'Progress' | 'Done' | 'Late' | 'Rejected' | 'Rework';
export type ApprovalStatus = 'Waiting' | 'Approved' | 'Rejected';

export interface TaskTimelineItem {
  timestamp: string;
  status: string;
  actor: string;
  role: string;
  note?: string;
}

export interface TaskLog {
  log_id: string;
  task_id: string;
  task_name: string;
  category: TaskCategory;
  task_type: TaskType;
  tanggal: string; // YYYY-MM-DD
  jam_mulai?: string; // HH:mm
  jam_selesai?: string; // HH:mm
  durasi?: number; // in minutes
  unit: string;
  user: string; // User ID / name
  user_name: string;
  before_photo?: string;
  after_photo?: string;
  status: TaskStatus;
  late: 'Yes' | 'No';
  approval: ApprovalStatus;
  score?: number; // 100, 90, 80, 70, 60
  rework: number; // count of reworks
  inspector?: string;
  inspector_name?: string;
  inspection_note?: string;
  checklist?: InspectionChecklist;
  created_at: string;
  timeline: TaskTimelineItem[];
  qr_checked_in?: boolean;
}

export interface InspectionChecklist {
  bersih: boolean;
  rapi: boolean;
  tidak_berdebu: boolean;
  tidak_ada_sampah: boolean;
  tidak_bau: boolean;
  peralatan_kembali: boolean;
  foto_sesuai: boolean;
  area_aman: boolean;
}

export interface InspectionHistoryItem {
  inspection_id: string;
  task_id: string;
  task_name: string;
  tanggal: string;
  jam: string;
  inspector_id: string;
  inspector_name: string;
  inspector_role: string;
  unit: string;
  office_boy_id: string;
  office_boy_name: string;
  status_sebelum: TaskStatus;
  status_sesudah: TaskStatus;
  approval: 'Approved' | 'Rejected';
  score: number;
  checklist: InspectionChecklist;
  catatan: string;
  jumlah_rework: number;
  before_photo?: string;
  after_photo?: string;
  timestamp: string;
}

export interface AppUnit {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  assigned_coordinators: string[];
}

export interface AppSettings {
  pre_readiness_limit: string; // default "09:00"
  clock_out_limit: string; // default "16:00"
  google_drive_folder_id: string;
  web_app_url: string; // Apps Script Web App URL for live sync
  school_name: string;
  school_logo: string;
  auto_refresh_interval: number; // seconds, default 30
}

export interface ActivityLog {
  id: string;
  user: string;
  user_name: string;
  role: string;
  unit: string;
  aktivitas: string;
  waktu: string;
  ip?: string;
  device?: string;
}

export interface AuditLog {
  id: string;
  entity: string; // e.g. "User", "MasterTask", "TaskLog", "Settings"
  entity_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE';
  changed_by: string;
  old_value?: string;
  new_value?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  target_user_id?: string;
  target_role?: UserRole;
  target_unit?: string;
}
