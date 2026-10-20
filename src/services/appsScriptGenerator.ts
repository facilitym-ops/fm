export interface AppsScriptFile {
  filename: string;
  type: 'gs' | 'html';
  description: string;
  code: string;
}

export function getGoogleAppsScriptFiles(spreadsheetId = '17_0Cldc-nCrrouWlfTjTo0iMa9mzH_iZz4M1u1Zy4bA'): AppsScriptFile[] {
  return [
    {
      filename: 'Code.gs',
      type: 'gs',
      description: 'Entry point Web App Apps Script (doGet & doPost)',
      code: `/**
 * ====================================================================
 * OB & OG MANAGEMENT DASHBOARD - GOOGLE APPS SCRIPT WEB APP BACKEND
 * Lazuardi Global Compassionate School Facility Management
 * ====================================================================
 */

var SPREADSHEET_ID = "${spreadsheetId}";
var DRIVE_FOLDER_ID = "17_0Cldc-nCrrouWlfTjTo0iMa9mzH_iZz4M1u1Zy4bA";

function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Apps Script API Active' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'get_all_data') {
    var data = getAllDataFromSheets();
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Serve Single Page Web App Interface
  var html = HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('OB & OG Management Dashboard - Facility Management')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
  return html;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var response = { status: 'error', message: 'Invalid action' };

    if (action === 'login') {
      response = handleAuthLogin(payload.username, payload.password);
    } else if (action === 'submit_task') {
      response = handleSubmitTask(payload);
    } else if (action === 'inspect_task') {
      response = handleInspectTask(payload);
    } else if (action === 'create_job_bareng') {
      response = handleCreateJobBareng(payload);
    } else if (action === 'save_user') {
      response = handleSaveUser(payload);
    } else if (action === 'upload_photo') {
      response = handleUploadToDrive(payload.base64, payload.filename);
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`
    },
    {
      filename: 'Auth.gs',
      type: 'gs',
      description: 'Authentication logic and session checking',
      code: `function handleAuthLogin(username, password) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Users");
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[2] == username && row[3] == password) {
      if (row[9] == 'Inactive' || row[9] == 'Archived') {
        return { status: 'error', message: 'Akun Anda dalam status nonaktif.' };
      }
      
      var user = {
        id: row[0],
        nama: row[1],
        username: row[2],
        role: row[4],
        position: row[5],
        unit: row[6],
        inspection_unit: row[7],
        photo: row[8],
        status: row[9]
      };
      
      logActivity(user.nama, user.role, user.unit, "Login berhasil via Apps Script Web App");
      return { status: 'success', user: user };
    }
  }
  return { status: 'error', message: 'Username atau password salah!' };
}`
    },
    {
      filename: 'Dashboard.gs',
      type: 'gs',
      description: 'Dashboard analytics calculator and Sheet reader',
      code: `function getAllDataFromSheets() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  return {
    users: getSheetData(ss, "Users"),
    units: getSheetData(ss, "Units"),
    masterTasks: getSheetData(ss, "MasterTasks"),
    taskLogs: getSheetData(ss, "TaskLogs"),
    inspectionHistory: getSheetData(ss, "InspectionHistory"),
    settings: getSheetData(ss, "Settings")[0] || {}
  };
}

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var range = sheet.getDataRange();
  var values = range.getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var result = [];
  
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[i][j];
    }
    result.push(obj);
  }
  return result;
}`
    },
    {
      filename: 'Tasks.gs',
      type: 'gs',
      description: 'Task submission, auto-late checker, and Job Bareng handler',
      code: `function handleSubmitTask(payload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("TaskLogs");
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == payload.log_id) {
      sheet.getRange(i + 1, 9).setValue(payload.before_photo);
      sheet.getRange(i + 1, 10).setValue(payload.after_photo);
      sheet.getRange(i + 1, 11).setValue("Done");
      sheet.getRange(i + 1, 13).setValue("Waiting");
      
      logActivity(payload.actor_name, "OfficeBoy", payload.unit, "Submit task log: " + payload.log_id);
      return { status: 'success', message: 'Pekerjaan berhasil disubmit!' };
    }
  }
  return { status: 'error', message: 'Log ID tidak ditemukan' };
}

function handleCreateJobBareng(payload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var masterSheet = ss.getSheetByName("MasterTasks");
  
  var newId = "TSK-" + (masterSheet.getLastRow() + 100);
  masterSheet.appendRow([
    newId,
    "[Job Bareng] " + payload.name,
    "Job Bareng",
    payload.task_type,
    "Daily",
    payload.target_unit,
    "ALL_OB",
    payload.instruction,
    "",
    payload.estimated_time,
    payload.priority,
    "Active",
    new Date(),
    new Date()
  ]);
  
  return { status: 'success', message: 'Job Bareng berhasil ditambahkan!' };
}`
    },
    {
      filename: 'Inspection.gs',
      type: 'gs',
      description: 'Inspection grading, checklist, and score recording',
      code: `function handleInspectTask(payload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var taskSheet = ss.getSheetByName("TaskLogs");
  var inspSheet = ss.getSheetByName("InspectionHistory");
  
  var taskData = taskSheet.getDataRange().getValues();
  for (var i = 1; i < taskData.length; i++) {
    if (taskData[i][0] == payload.log_id) {
      var isApproved = payload.approval === 'Approved';
      
      taskSheet.getRange(i + 1, 11).setValue(isApproved ? "Done" : "Rejected");
      taskSheet.getRange(i + 1, 13).setValue(payload.approval);
      taskSheet.getRange(i + 1, 14).setValue(payload.score);
      taskSheet.getRange(i + 1, 16).setValue(payload.inspector_id);
      taskSheet.getRange(i + 1, 17).setValue(payload.inspection_note);
      
      inspSheet.appendRow([
        "INSP-" + Date.now(),
        payload.task_id,
        new Date(),
        new Date().toLocaleTimeString(),
        payload.inspector_id,
        payload.inspector_name,
        "Coordinator",
        payload.unit,
        payload.office_boy_id,
        taskData[i][10],
        isApproved ? "Done" : "Rejected",
        payload.approval,
        payload.score,
        JSON.stringify(payload.checklist),
        payload.inspection_note,
        new Date()
      ]);
      
      return { status: 'success', message: 'Inspeksi berhasil disimpan!' };
    }
  }
  return { status: 'error', message: 'Task Log tidak ditemukan' };
}`
    },
    {
      filename: 'Users.gs',
      type: 'gs',
      description: 'User management and CRUD logic',
      code: `function handleSaveUser(payload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("Users");
  
  sheet.appendRow([
    "USR-" + (sheet.getLastRow() + 1),
    payload.nama,
    payload.username,
    payload.password,
    payload.role,
    payload.position,
    payload.unit,
    payload.inspection_unit,
    payload.photo,
    "Active"
  ]);
  
  return { status: 'success', message: 'User berhasil disimpan' };
}`
    },
    {
      filename: 'Drive.gs',
      type: 'gs',
      description: 'Google Drive photo upload integration handler',
      code: `function handleUploadToDrive(base64Data, filename) {
  try {
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var contentType = base64Data.substring(5, base64Data.indexOf(';'));
    var bytes = Utilities.base64Decode(base64Data.substr(base64Data.indexOf('base64,') + 7));
    var blob = Utilities.newBlob(bytes, contentType, filename);
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      status: 'success',
      url: "https://lh3.googleusercontent.com/d/" + file.getId()
    };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}`
    },
    {
      filename: 'Reports.gs',
      type: 'gs',
      description: 'Report compilation and log generator',
      code: `function logActivity(user, role, unit, aktivitas) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("ActivityLogs");
    if (sheet) {
      sheet.appendRow([
        "ACT-" + Date.now(),
        user,
        role,
        unit,
        aktivitas,
        new Date()
      ]);
    }
  } catch (e) {
    Logger.log(e);
  }
}`
    },
    {
      filename: 'Utils.gs',
      type: 'gs',
      description: 'Utility helpers and batch operations',
      code: `function setupSheets() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheets = ["Users", "Units", "MasterTasks", "TaskLogs", "InspectionHistory", "Settings", "ActivityLogs", "AuditLogs"];
  
  sheets.forEach(function(name) {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
}`
    },
    {
      filename: 'Index.html',
      type: 'html',
      description: 'Main HTML wrapper for Apps Script Web App UI',
      code: `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <title>OB & OG Management Dashboard</title>
  <?!= include('Styles'); ?>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
  <div id="app"></div>
  <?!= include('Scripts'); ?>
</body>
</html>`
    },
    {
      filename: 'Dashboard.html',
      type: 'html',
      description: 'Embedded HTML template component for Web App layout',
      code: `<div class="p-6">
  <h1 class="text-2xl font-bold">OB & OG Facility Management Dashboard</h1>
  <p class="text-slate-400">Google Apps Script Live Web App Interface</p>
</div>`
    },
    {
      filename: 'Styles.html',
      type: 'html',
      description: 'Tailwind CSS CDN and Glassmorphism styling header imports',
      code: `<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
</style>`
    },
    {
      filename: 'Scripts.html',
      type: 'html',
      description: 'Chart.js, SweetAlert2, and frontend client script loader',
      code: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
  console.log("OB & OG Apps Script Frontend Loaded Successfully");
</script>`
    }
  ];
}
