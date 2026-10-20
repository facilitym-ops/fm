import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TaskLog, User, InspectionHistoryItem } from '../types';

export function exportTasksToExcel(tasks: TaskLog[], filename = 'Laporan_Pekerjaan_OB_OG.xlsx'): void {
  const data = tasks.map(t => ({
    'ID Log': t.log_id,
    'Nama Pekerjaan': t.task_name,
    'Kategori': t.category,
    'Tipe': t.task_type,
    'Tanggal': t.tanggal,
    'Jam Mulai': t.jam_mulai || '-',
    'Jam Selesai': t.jam_selesai || '-',
    'Durasi (Menit)': t.durasi || '-',
    'Unit': t.unit,
    'Petugas (OB/OG)': t.user_name,
    'Status': t.status,
    'Terlambat': t.late,
    'Status Approval': t.approval,
    'Nilai/Skor': t.score || '-',
    'Jumlah Rework': t.rework,
    'Inspector': t.inspector_name || '-',
    'Catatan Inspeksi': t.inspection_note || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Pekerjaan');
  XLSX.writeFile(workbook, filename);
}

export function exportTasksToCsv(tasks: TaskLog[], filename = 'Laporan_Pekerjaan_OB_OG.csv'): void {
  const headers = [
    'ID Log', 'Nama Pekerjaan', 'Kategori', 'Tipe', 'Tanggal', 'Jam Mulai', 'Jam Selesai',
    'Durasi (Min)', 'Unit', 'Petugas', 'Status', 'Late', 'Approval', 'Skor', 'Rework', 'Inspector', 'Catatan'
  ];

  const rows = tasks.map(t => [
    `"${t.log_id}"`,
    `"${t.task_name.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    `"${t.task_type}"`,
    `"${t.tanggal}"`,
    `"${t.jam_mulai || '-'}"`,
    `"${t.jam_selesai || '-'}"`,
    `"${t.durasi || '-'}"`,
    `"${t.unit}"`,
    `"${t.user_name}"`,
    `"${t.status}"`,
    `"${t.late}"`,
    `"${t.approval}"`,
    `"${t.score || '-'}"`,
    `"${t.rework}"`,
    `"${t.inspector_name || '-'}"`,
    `"${(t.inspection_note || '-').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTasksToPdf(tasks: TaskLog[], schoolName = 'Lazuardi Global Compassionate School'): void {
  const doc = new jsPDF('landscape');

  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(26, 35, 126); // Deep blue
  doc.text(schoolName, 14, 15);

  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text('LAPORAN MONITORING & EVALUASI PEKERJAAN OFFICE BOY & OFFICE GIRL', 14, 22);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')} | Total Rekor: ${tasks.length} Task`, 14, 27);

  const tableData = tasks.map(t => [
    t.log_id,
    t.tanggal,
    t.unit,
    t.user_name,
    t.task_name,
    t.category,
    t.status,
    t.late === 'Yes' ? 'LATE' : 'On-Time',
    t.approval,
    t.score ? `${t.score}` : '-',
    t.inspector_name || '-'
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['ID', 'Tanggal', 'Unit', 'Petugas', 'Nama Pekerjaan', 'Kategori', 'Status', 'Ketepatan', 'Approval', 'Skor', 'Inspector']],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  doc.save(`Laporan_OB_OG_Facility_Management_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportPerformanceToExcel(users: User[], tasks: TaskLog[], filename = 'Laporan_Kinerja_Personnel.xlsx'): void {
  const data = users.map(u => {
    const userTasks = tasks.filter(t => t.user === u.id);
    const total = userTasks.length;
    const done = userTasks.filter(t => t.status === 'Done').length;
    const late = userTasks.filter(t => t.late === 'Yes').length;
    const rejected = userTasks.filter(t => t.status === 'Rejected').length;
    const reworks = userTasks.reduce((acc, curr) => acc + (curr.rework || 0), 0);
    const scoredTasks = userTasks.filter(t => typeof t.score === 'number');
    const avgScore = scoredTasks.length > 0 ? (scoredTasks.reduce((a, b) => a + (b.score || 0), 0) / scoredTasks.length).toFixed(1) : '-';

    return {
      'ID User': u.id,
      'Nama Personnel': u.nama,
      'Role': u.role,
      'Unit Kerja': u.unit,
      'Poin Akumulasi': u.points || 0,
      'Total Pekerjaan': total,
      'Selesai (Done)': done,
      'Terlambat (Late)': late,
      'Ditolak (Rejected)': rejected,
      'Total Rework': reworks,
      'Rata-rata Skor Inspeksi': avgScore
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Kinerja Personnel');
  XLSX.writeFile(workbook, filename);
}
