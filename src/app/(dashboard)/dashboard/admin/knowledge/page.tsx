'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

    const res = await fetch('/api/knowledge/upload', {
      method: 'POST',
      body: formData,
    });

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

    const res = await fetch('/api/knowledge/upload', {
      method: 'POST',
      body: formData,
    });

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
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Base de Conhecimento</h1>

      {/* Resumo */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          <Database size={16} />
          {totalChunks} chunks no banco
        </div>
        <div className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm">
          <FileText size={16} />
          {files.length} arquivos
        </div>
      </div>

      {/* Tabs Upload / Texto */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex gap-2">
            <button
              onClick={() => setTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload size={16} />
              Upload de arquivo
            </button>
            <button
              onClick={() => setTab('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Plus size={16} />
              Colar texto
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {tab === 'upload' ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Aceita PDF, TXT e MD. O arquivo será dividido em chunks e salvo no banco vetorial.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleUploadFile}
                className="hidden"
              />
              <Button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Selecionar arquivo
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Cole o texto que deseja adicionar à base de conhecimento do agente.
              </p>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Cole aqui o conteúdo que o agente deve conhecer..."
                rows={8}
                className="mb-4"
              />
              <Button
                onClick={handleUploadText}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Adicionar ao banco
                  </>
                )}
              </Button>
            </div>
          )}

          {message && (
            <p className="mt-4 text-sm font-medium">{message}</p>
          )}
        </CardContent>
      </Card>

      {/* Lista de arquivos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos no banco</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Nenhum documento enviado ainda
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Arquivo</th>
                    <th className="pb-3 font-medium">Origem</th>
                    <th className="pb-3 font-medium">Chunks</th>
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => (
                    <tr key={f.name} className="border-b last:border-0">
                      <td className="py-3 font-medium flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        {f.name}
                      </td>
                      <td className="py-3 text-gray-500 capitalize">{f.source}</td>
                      <td className="py-3">{f.chunks}</td>
                      <td className="py-3 text-gray-500">{formatDate(f.date)}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(f)}
                          disabled={deleting === f.name}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          {deleting === f.name ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}