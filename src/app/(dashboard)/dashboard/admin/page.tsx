'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, Loader2, Database, Plus } from 'lucide-react';

interface FileEntry {
  name: string;
  source: string;
  chunks: number;
  date: string;
  ids: number[];
}

export default function KnowledgePage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [tab, setTab] = useState<'upload' | 'text'>('upload');
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    const res = await fetch('/api/knowledge/list');
    const data = await res.json();
    setFiles(data.files || []);
    setTotalChunks(data.totalChunks || 0);
  }

  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', 'upload');

    const res = await fetch('/api/knowledge/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.ok) {
      setMessage(`✅ ${file.name} processado — ${data.chunks_saved} chunks salvos`);
      loadFiles();
    } else {
      setMessage(`❌ ${data.error}`);
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleUploadText() {
    if (text.trim().length < 50) {
      setMessage('❌ Texto muito curto (mínimo 50 caracteres)');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('text', text);
    formData.append('source', 'manual');

    const res = await fetch('/api/knowledge/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.ok) {
      setMessage(`✅ Texto processado — ${data.chunks_saved} chunks salvos`);
      setText('');
      loadFiles();
    } else {
      setMessage(`❌ ${data.error}`);
    }

    setUploading(false);
  }

  async function handleDelete(file: FileEntry) {
    if (!confirm(`Deletar "${file.name}" e todos os seus ${file.chunks} chunks?`)) return;

    setDeleting(file.name);

    const res = await fetch('/api/knowledge/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: file.ids }),
    });

    const data = await res.json();

    if (data.ok) {
      setMessage(`🗑️ ${file.name} deletado — ${data.deleted} chunks removidos`);
      loadFiles();
    }

    setDeleting(null);
  }

  function formatDate(date: string) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Database size={18} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h1>
          <p className="text-sm text-gray-400">Gerencie os documentos do agente</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full bg-blue-50 text-blue-600">
          <Database size={13} />
          {totalChunks} chunks
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full bg-gray-100 text-gray-500">
          <FileText size={13} />
          {files.length} arquivos
        </span>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Tabs */}
        <div className="flex gap-1 p-2 border-b border-gray-100">
          <button
            onClick={() => setTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              tab === 'upload'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Upload size={14} />
            Upload de arquivo
          </button>
          <button
            onClick={() => setTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              tab === 'text'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Plus size={14} />
            Colar texto
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {tab === 'upload' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Aceita PDF, TXT e MD. O arquivo será dividido em chunks e salvo no banco vetorial.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleUploadFile}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                {uploading ? 'Processando...' : 'Selecionar arquivo'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Cole o texto que deseja adicionar à base de conhecimento do agente.
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Cole aqui o conteúdo que o agente deve conhecer..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
              />
              <button
                onClick={handleUploadText}
                disabled={uploading}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                {uploading ? 'Processando...' : 'Adicionar ao banco'}
              </button>
            </div>
          )}

          {message && (
            <div className={`mt-4 rounded-xl p-3 text-sm font-medium ${
              message.startsWith('✅') || message.startsWith('🗑️')
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <FileText size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Documentos no banco</h2>
          <span className="ml-auto text-xs text-gray-400">{files.length} arquivos</span>
        </div>

        {files.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Database size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Nenhum documento enviado ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-3">Arquivo</th>
                  <th className="px-6 py-3">Origem</th>
                  <th className="px-6 py-3">Chunks</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.name} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FileText size={14} className="text-blue-500" />
                        </div>
                        <span className="font-medium text-gray-900">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 capitalize">{f.source}</td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {f.chunks}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-400">{formatDate(f.date)}</td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleDelete(f)}
                        disabled={deleting === f.name}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                      >
                        {deleting === f.name
                          ? <Loader2 className="animate-spin" size={14} />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}