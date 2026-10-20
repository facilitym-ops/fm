import { User, MasterTask, TaskLog, AppUnit, AppSettings, ActivityLog, AuditLog, InspectionHistoryItem } from '../types';

export const INITIAL_USERS: User[] = [
  // Admin
  {
    id: 'USR-001',
    nama: 'Budi Santoso',
    username: 'admin',
    password: '123',
    role: 'Admin',
    position: 'Leader',
    unit: 'Pusat',
    inspection_unit: 'ALL',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'Active',
    points: 1200
  },

  // Coordinators
  {
    id: 'USR-002',
    nama: 'Ahmad Dahlan',
    username: 'koord_arrazi',
    password: '123',
    role: 'Coordinator',
    position: 'Leader',
    unit: 'Ar Razi',
    inspection_unit: 'Ar Razi',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'Active',
    points: 950
  },
  {
    id: 'USR-003',
    nama: 'Siti Rahma',
    username: 'koord_khaldun',
    password: '123',
    role: 'Coordinator',
    position: 'Leader',
    unit: 'Khaldun',
    inspection_unit: 'Khaldun',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    status: 'Active',
    points: 980
  },
  {
    id: 'USR-004',
    nama: 'Hendra Wijaya',
    username: 'koord_tk_sd',
    password: '123',
    role: 'Coordinator',
    position: 'Leader',
    unit: 'SD',
    inspection_unit: 'SD',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'Active',
    points: 910
  },
  {
    id: 'USR-005',
    nama: 'Nurul Huda',
    username: 'koord_smp',
    password: '123',
    role: 'Coordinator',
    position: 'Leader',
    unit: 'SMP',
    inspection_unit: 'SMP',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    status: 'Active',
    points: 890
  },

  // Pelangi - 1 OB
  {
    id: 'OB-001',
    nama: 'Rian Febrian',
    username: 'ob_pelangi',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'Pelangi',
    inspection_unit: 'Pelangi',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    status: 'Active',
    points: 780
  },

  // TK - 2 OB
  {
    id: 'OB-002',
    nama: 'Dedi Kurniawan',
    username: 'ob_tk1',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'TK',
    inspection_unit: 'TK',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    status: 'Active',
    points: 820
  },
  {
    id: 'OG-001',
    nama: 'Dewi Lestari',
    username: 'og_tk2',
    password: '123',
    role: 'OfficeGirl',
    position: 'Staff',
    unit: 'TK',
    inspection_unit: 'TK',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    status: 'Active',
    points: 850
  },

  // SD - 5 OB/OG
  {
    id: 'OB-003',
    nama: 'Agus Setiawan',
    username: 'ob_sd1',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'SD',
    inspection_unit: 'SD',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    status: 'Active',
    points: 920
  },
  {
    id: 'OB-004',
    nama: 'Bambang Pamungkas',
    username: 'ob_sd2',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'SD',
    inspection_unit: 'SD',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    status: 'Active',
    points: 870
  },
  {
    id: 'OG-002',
    nama: 'Siti Maryam',
    username: 'og_sd3',
    password: '123',
    role: 'OfficeGirl',
    position: 'Staff',
    unit: 'SD',
    inspection_unit: 'SD',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
    status: 'Active',
    points: 890
  },
  {
    id: 'OB-005',
    nama: 'Candra Gunawan',
    username: 'ob_sd4',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'SD',
    inspection_unit: 'SD',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    status: 'Active',
    points: 790
  },
  {
    id: 'OB-006',
    nama: 'Eko Prasetyo',
    username: 'ob_sd5',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'SD',
    inspection_unit: 'SD',
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    status: 'Active',
    points: 840
  },

  // SMP - 3 OB
  {
    id: 'OB-007',
    nama: 'Fajar Nugraha',
    username: 'ob_smp1',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'SMP',
    inspection_unit: 'SMP',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    status: 'Active',
    points: 880
  },
  {
    id: 'OB-008',
    nama: 'Giri Utama',
    username: 'ob_smp2',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'SMP',
    inspection_unit: 'SMP',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    status: 'Active',
    points: 830
  },
  {
    id: 'OG-003',
    nama: 'Ika Putri',
    username: 'og_smp3',
    password: '123',
    role: 'OfficeGirl',
    position: 'Staff',
    unit: 'SMP',
    inspection_unit: 'SMP',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'Active',
    points: 900
  },

  // Direktorat - 1 OB
  {
    id: 'OB-009',
    nama: 'Joni Supriadi',
    username: 'ob_direktorat',
    password: '123',
    role: 'OfficeBoy',
    position: 'Staff',
    unit: 'Direktorat',
    inspection_unit: 'Direktorat',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'Active',
    points: 940
  }
];

export const INITIAL_UNITS: AppUnit[] = [
  { id: 'U-001', code: 'Pusat', name: 'Gedung Pusat Facility Management', description: 'Kantor Pusat FM & Logistik', status: 'Active', assigned_coordinators: ['USR-001'] },
  { id: 'U-002', code: 'Pelangi', name: 'Unit Lazuardi Pelangi', description: 'Gedung Paud & TK Pelangi', status: 'Active', assigned_coordinators: ['USR-001'] },
  { id: 'U-003', code: 'TK', name: 'Unit Taman Kanak-Kanak', description: 'Area Kelas & Playground TK', status: 'Active', assigned_coordinators: ['USR-004'] },
  { id: 'U-004', code: 'SD', name: 'Unit Sekolah Dasar', description: 'Gedung Utama SD Lazuardi', status: 'Active', assigned_coordinators: ['USR-004'] },
  { id: 'U-005', code: 'SMP', name: 'Unit Sekolah Menengah Pertama', description: 'Gedung SMP & Lab', status: 'Active', assigned_coordinators: ['USR-005'] },
  { id: 'U-006', code: 'Direktorat', name: 'Gedung Direktorat / Yayasan', description: 'Kantor Yayasan & Direksi', status: 'Active', assigned_coordinators: ['USR-001'] },
  { id: 'U-007', code: 'Ar Razi', name: 'Gedung Ar Razi', description: 'Gedung Pembelajaran Ar Razi', status: 'Active', assigned_coordinators: ['USR-002'] },
  { id: 'U-008', code: 'Khaldun', name: 'Gedung Khaldun', description: 'Gedung Laboratorium & Perpustakaan Khaldun', status: 'Active', assigned_coordinators: ['USR-003'] }
];

export const INITIAL_SETTINGS: AppSettings = {
  pre_readiness_limit: '09:00',
  clock_out_limit: '16:00',
  google_drive_folder_id: '17_0Cldc-nCrrouWlfTjTo0iMa9mzH_iZz4M1u1Zy4bA',
  web_app_url: 'https://script.google.com/macros/s/AKfycbx_EXAMPLE_WEB_APP_URL/exec',
  school_name: 'Lazuardi Global Compassionate School',
  school_logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100',
  auto_refresh_interval: 30
};

export const INITIAL_MASTER_TASKS: MasterTask[] = [
  {
    id: 'TSK-101',
    name: 'Pembersihan Kaca & Sapu Lapangan Utama',
    category: 'Pre Readiness',
    task_type: 'Cleaning',
    recurrence: 'Daily',
    unit: 'SD',
    assignee: 'OB-003',
    instruction: 'Sapu koridor kelas 1-3, bersihkan debu meja & papan tulis, pastikan tempat sampah kosong sebelum jam 07.00.',
    photo_guide: 'Ambil foto koridor sebelum dan sesudah disapu.',
    estimated_time: 45,
    priority: 'High',
    status: 'Active',
    created_at: '2026-07-01 07:00',
    updated_at: '2026-07-01 07:00'
  },
  {
    id: 'TSK-102',
    name: 'Sanitasi Kamar Mandi Paud & TK',
    category: 'Pre Readiness',
    task_type: 'Cleaning',
    recurrence: 'Daily',
    unit: 'TK',
    assignee: 'OG-001',
    instruction: 'Sikat lantai kamar mandi, ganti kaporit / wipol, pastikan sabun cuci tangan terisi penuh.',
    photo_guide: 'Foto lantai sebelum & sesudah disikat, serta sabun yang terisi.',
    estimated_time: 30,
    priority: 'High',
    status: 'Active',
    created_at: '2026-07-01 07:00',
    updated_at: '2026-07-01 07:00'
  },
  {
    id: 'TSK-103',
    name: 'Pengecekan AC & Pelapisan Kaca Gedung Direktorat',
    category: 'Clock Out',
    task_type: 'Maintenance',
    recurrence: 'Daily',
    unit: 'Direktorat',
    assignee: 'OB-009',
    instruction: 'Matikan seluruh AC ruangan direksi, matikan lampu utama, kumpulkan sampah harian, dan kunci pintu rapat.',
    photo_guide: 'Foto remote AC kondisi Off dan kunci pintu.',
    estimated_time: 40,
    priority: 'Medium',
    status: 'Active',
    created_at: '2026-07-01 07:00',
    updated_at: '2026-07-01 07:00'
  },
  {
    id: 'TSK-104',
    name: 'Inspeksi Kebersihan Gedung Ar Razi',
    category: 'Inspection',
    task_type: 'Inspection',
    recurrence: 'Daily',
    unit: 'Ar Razi',
    assignee: 'USR-002',
    instruction: 'Lakukan checklist 8 item kebersihan ruangan kelas Ar Razi dan ruang rapat.',
    photo_guide: 'Foto sudut ruangan yang diinspeksi.',
    estimated_time: 30,
    priority: 'High',
    status: 'Active',
    created_at: '2026-07-01 07:00',
    updated_at: '2026-07-01 07:00'
  },
  {
    id: 'TSK-105',
    name: 'Kerja Bakti Massal & Fogging Lingkungan Sekolah',
    category: 'Job Bareng',
    task_type: 'Kerja Bakti',
    recurrence: 'Weekly',
    unit: 'All Unit',
    assignee: 'ALL_OB',
    instruction: 'Kerja bakti pembersihan selokan, potong rumput liar, dan penyemprotan fogging area outdoor seluruh sekolah.',
    photo_guide: 'Foto kelompok OB saat bekerja dan kondisi selokan bersih.',
    estimated_time: 120,
    priority: 'Urgent',
    status: 'Active',
    created_at: '2026-07-15 08:00',
    updated_at: '2026-07-15 08:00'
  }
];

export const INITIAL_TASK_LOGS: TaskLog[] = [
  {
    log_id: 'LOG-20260731-01',
    task_id: 'TSK-101',
    task_name: 'Pembersihan Kaca & Sapu Lapangan Utama',
    category: 'Pre Readiness',
    task_type: 'Cleaning',
    tanggal: '2026-07-31',
    jam_mulai: '07:15',
    jam_selesai: '08:00',
    durasi: 45,
    unit: 'SD',
    user: 'OB-003',
    user_name: 'Agus Setiawan',
    before_photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    after_photo: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400',
    status: 'Done',
    late: 'No',
    approval: 'Approved',
    score: 90,
    rework: 0,
    inspector: 'USR-004',
    inspector_name: 'Hendra Wijaya',
    inspection_note: 'Pekerjaan sangat bersih dan rapi. Sapu koridor tuntas tepat waktu.',
    checklist: {
      bersih: true,
      rapi: true,
      tidak_berdebu: true,
      tidak_ada_sampah: true,
      tidak_bau: true,
      peralatan_kembali: true,
      foto_sesuai: true,
      area_aman: true
    },
    created_at: '2026-07-31 07:15',
    timeline: [
      { timestamp: '07:15', status: 'Task Dibuat & Dikerjakan', actor: 'Agus Setiawan', role: 'OfficeBoy' },
      { timestamp: '08:00', status: 'Submit Pekerjaan', actor: 'Agus Setiawan', role: 'OfficeBoy', note: 'Foto Before/After lengkap' },
      { timestamp: '08:25', status: 'Approved', actor: 'Hendra Wijaya', role: 'Coordinator', note: 'Skor 90 - Sangat Baik' }
    ]
  },
  {
    log_id: 'LOG-20260731-02',
    task_id: 'TSK-102',
    task_name: 'Sanitasi Kamar Mandi Paud & TK',
    category: 'Pre Readiness',
    task_type: 'Cleaning',
    tanggal: '2026-07-31',
    jam_mulai: '08:10',
    jam_selesai: '09:20',
    durasi: 70,
    unit: 'TK',
    user: 'OG-001',
    user_name: 'Dewi Lestari',
    before_photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    after_photo: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400',
    status: 'Late',
    late: 'Yes',
    approval: 'Approved',
    score: 80,
    rework: 0,
    inspector: 'USR-004',
    inspector_name: 'Hendra Wijaya',
    inspection_note: 'Selesai lewat dari jam 09.00 (jam 09.20). Hasil bersih namun perlu lebih cepat.',
    checklist: {
      bersih: true,
      rapi: true,
      tidak_berdebu: true,
      tidak_ada_sampah: true,
      tidak_bau: true,
      peralatan_kembali: true,
      foto_sesuai: true,
      area_aman: true
    },
    created_at: '2026-07-31 08:10',
    timeline: [
      { timestamp: '08:10', status: 'Task Dikerjakan', actor: 'Dewi Lestari', role: 'OfficeGirl' },
      { timestamp: '09:20', status: 'Submit (Terlambat)', actor: 'Dewi Lestari', role: 'OfficeGirl', note: 'Pekerjaan selesai 09.20' },
      { timestamp: '09:35', status: 'Approved (Late)', actor: 'Hendra Wijaya', role: 'Coordinator', note: 'Catatan waktu disorot' }
    ]
  },
  {
    log_id: 'LOG-20260731-03',
    task_id: 'TSK-105',
    task_name: 'Kerja Bakti Massal & Fogging Lingkungan Sekolah',
    category: 'Job Bareng',
    task_type: 'Kerja Bakti',
    tanggal: '2026-07-31',
    jam_mulai: '08:30',
    jam_selesai: undefined,
    durasi: undefined,
    unit: 'SMP',
    user: 'OB-007',
    user_name: 'Fajar Nugraha',
    before_photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    after_photo: undefined,
    status: 'Progress',
    late: 'No',
    approval: 'Waiting',
    rework: 0,
    created_at: '2026-07-31 08:30',
    timeline: [
      { timestamp: '08:30', status: 'Check-in QR & Mulai Job Bareng', actor: 'Fajar Nugraha', role: 'OfficeBoy' }
    ]
  },
  {
    log_id: 'LOG-20260731-04',
    task_id: 'TSK-103',
    task_name: 'Pengecekan AC & Pelapisan Kaca Gedung Direktorat',
    category: 'Clock Out',
    task_type: 'Maintenance',
    tanggal: '2026-07-31',
    jam_mulai: '13:00',
    jam_selesai: '14:15',
    durasi: 75,
    unit: 'Direktorat',
    user: 'OB-009',
    user_name: 'Joni Supriadi',
    before_photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    after_photo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    status: 'Rejected',
    late: 'No',
    approval: 'Rejected',
    score: 60,
    rework: 1,
    inspector: 'USR-001',
    inspector_name: 'Budi Santoso',
    inspection_note: 'Foto AC belum dimatikan sepenuhnya dan jendela belum dikunci. Mohon perbaiki segera!',
    checklist: {
      bersih: true,
      rapi: false,
      tidak_berdebu: true,
      tidak_ada_sampah: true,
      tidak_bau: true,
      peralatan_kembali: true,
      foto_sesuai: false,
      area_aman: false
    },
    created_at: '2026-07-31 13:00',
    timeline: [
      { timestamp: '13:00', status: 'Task Dikerjakan', actor: 'Joni Supriadi', role: 'OfficeBoy' },
      { timestamp: '14:15', status: 'Submit Pekerjaan', actor: 'Joni Supriadi', role: 'OfficeBoy' },
      { timestamp: '14:40', status: 'Rejected', actor: 'Budi Santoso', role: 'Admin', note: 'Harus rework kunci jendela & AC' }
    ]
  }
];

export const INITIAL_INSPECTION_HISTORY: InspectionHistoryItem[] = [
  {
    inspection_id: 'INSP-901',
    task_id: 'TSK-101',
    task_name: 'Pembersihan Kaca & Sapu Lapangan Utama',
    tanggal: '2026-07-31',
    jam: '08:25',
    inspector_id: 'USR-004',
    inspector_name: 'Hendra Wijaya',
    inspector_role: 'Coordinator',
    unit: 'SD',
    office_boy_id: 'OB-003',
    office_boy_name: 'Agus Setiawan',
    status_sebelum: 'Done',
    status_sesudah: 'Done',
    approval: 'Approved',
    score: 90,
    checklist: {
      bersih: true,
      rapi: true,
      tidak_berdebu: true,
      tidak_ada_sampah: true,
      tidak_bau: true,
      peralatan_kembali: true,
      foto_sesuai: true,
      area_aman: true
    },
    catatan: 'Area sangat bersih dan teratur.',
    jumlah_rework: 0,
    before_photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    after_photo: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400',
    timestamp: '2026-07-31 08:25'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'ACT-001',
    user: 'USR-001',
    user_name: 'Budi Santoso',
    role: 'Admin',
    unit: 'Pusat',
    aktivitas: 'Login Ke Sistem FM Management Dashboard',
    waktu: '2026-07-31 07:00:05',
    ip: '182.253.12.98',
    device: 'Chrome / macOS Desktop'
  },
  {
    id: 'ACT-002',
    user: 'OB-003',
    user_name: 'Agus Setiawan',
    role: 'OfficeBoy',
    unit: 'SD',
    aktivitas: 'Submit Task Log Pembersihan Kaca & Sapu Lapangan Utama',
    waktu: '2026-07-31 08:00:12',
    ip: '180.252.88.10',
    device: 'Mobile Safari / Android'
  },
  {
    id: 'ACT-003',
    user: 'USR-004',
    user_name: 'Hendra Wijaya',
    role: 'Coordinator',
    unit: 'SD',
    aktivitas: 'Approve Task LOG-20260731-01 (Skor: 90)',
    waktu: '2026-07-31 08:25:30',
    ip: '180.252.88.15',
    device: 'Chrome / Windows Desktop'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    entity: 'TaskLog',
    entity_id: 'LOG-20260731-01',
    action: 'UPDATE',
    changed_by: 'Hendra Wijaya (USR-004)',
    old_value: '{"approval":"Waiting","score":null,"status":"Done"}',
    new_value: '{"approval":"Approved","score":90,"status":"Done"}',
    timestamp: '2026-07-31 08:25:30'
  }
];
