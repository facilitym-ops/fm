import React, { useState } from 'react';
import { Code, Copy, Check, FileCode, BookOpen, HardDrive, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { getGoogleAppsScriptFiles } from '../services/appsScriptGenerator';

interface AppsScriptDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetId?: string;
}

export const AppsScriptDocModal: React.FC<AppsScriptDocModalProps> = ({
  isOpen,
  onClose,
  spreadsheetId = '17_0Cldc-nCrrouWlfTjTo0iMa9mzH_iZz4M1u1Zy4bA'
}) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('Code.gs');
  const files = getGoogleAppsScriptFiles(spreadsheetId);

  if (!isOpen) return null;

  const currentFile = files.find(f => f.filename === selectedFileName) || files[0];

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-5xl h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b flex items-center justify-between bg-indigo-950/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Dokumentasi Instalasi & Kode Google Apps Script (.gs / .html)
              </h3>
              <p className="text-xs text-indigo-300">
                Lazuardi Global Compassionate School • Web App Deployment Guide
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-gray-300 hover:bg-white/10 font-bold text-lg">
            ✕
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Sidebar: Setup Guide & File List */}
          <div className="md:col-span-4 border-r bg-gray-50/50 dark:bg-gray-900/60 p-4 space-y-4 overflow-y-auto">
            {/* Step-by-Step Installation */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-2 text-xs">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Langkah Instalasi Web App
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                <li>Buka Google Spreadsheet target (<span className="font-mono text-[10px] underline">{spreadsheetId}</span>).</li>
                <li>Klik menu <span className="font-bold">Extensions &gt; Apps Script</span>.</li>
                <li>Buat file-file script sesuai nama di daftar di bawah ini.</li>
                <li>Pilih <span className="font-bold">Deploy &gt; New deployment</span>.</li>
                <li>Pilih type <span className="font-bold">Web App</span>.</li>
                <li>Set Execute as: <span className="font-bold">Me</span>, Access: <span className="font-bold">Anyone</span>.</li>
                <li>Copy Web App URL & masukkan ke menu Settings aplikasi ini.</li>
              </ol>
            </div>

            {/* File List */}
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Daftar File Kode Apps Script ({files.length} File)
              </p>
              <div className="space-y-1">
                {files.map(f => (
                  <button
                    key={f.filename}
                    onClick={() => setSelectedFileName(f.filename)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      selectedFileName === f.filename
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{f.filename}</span>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/20 opacity-80">
                      {f.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Area: Code Editor Preview & Copy Button */}
          <div className="md:col-span-8 p-5 flex flex-col justify-between bg-gray-900 text-gray-100 overflow-hidden">
            <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-indigo-400">{currentFile.filename}</h4>
                  <p className="text-xs text-gray-400">{currentFile.description}</p>
                </div>

                <button
                  onClick={() => handleCopyCode(currentFile.filename, currentFile.code)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  {copiedFile === currentFile.filename ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Tercopy!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Kode File</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Editor Preview */}
              <pre className="flex-1 p-4 rounded-2xl bg-black/80 font-mono text-xs overflow-auto text-emerald-400 border border-gray-800 leading-relaxed">
                <code>{currentFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
