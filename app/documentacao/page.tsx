"use client";
import { useEffect, useState } from 'react';

type DocItem = { id?: string; title?: string; file?: string; slug?: string };

type SearchItem = { id: string; title: string; snippets: string[]; file: string };

export default function DocumentacaoPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [docsExternos, setDocsExternos] = useState<DocItem[]>([]);
  const [q, setQ] = useState('');
  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lista docs internos (.md/.mdx)
    fetch('/api/search-docs')
      .then(r => r.json())
      .then(d => setDocs((d.items || []).map((x: any) => ({ title: x.title, file: x.file }))))
      .catch(() => {});
    // Lista documentos externos (.pdf) na pasta C:\Users\Pichau\devoptilog-app\documentos
    fetch('/api/read-doc?list=1&base=documentos')
      .then(r => r.json())
      .then(items => setDocsExternos(items || []))
      .catch(() => {});
  }, []);

  const runSearch = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/search-docs?q=${encodeURIComponent(q)}&topN=3`);
      const d = await r.json();
      setSearchItems(d.items || []);
    } finally {
      setLoading(false);
    }
  };

  const openDocInterno = async (file: string) => {
    setSelected(file);
    setIsPdf(false);
    setViewerUrl(null);
    const r = await fetch(`/api/read-doc?slug=${encodeURIComponent(file)}`);
    const text = await r.text();
    setContent(text);
  };

  const openDocExterno = async (slug: string) => {
    setSelected(slug);
    setIsPdf(true);
    const url = `/api/read-doc?slug=${encodeURIComponent(slug)}&base=documentos`;
    setViewerUrl(url);
    setContent('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16, padding: 16 }}>
      <div>
        <h2>Documentação</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar docs (TF-IDF)"
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={runSearch} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        <h3 style={{ marginTop: 16 }}>Materiais (docs internos)</h3>
        <ul>
          {docs.map((d) => (
            <li key={d.file} style={{ marginBottom: 8 }}>
              <button onClick={() => openDocInterno(String(d.file))} style={{ cursor: 'pointer' }}>
                {d.title || d.file}
              </button>
            </li>
          ))}
        </ul>
        <h3 style={{ marginTop: 16 }}>Documentos (PDF externos)</h3>
        <ul>
          {docsExternos.map((d) => (
            <li key={String(d.slug || d.file)} style={{ marginBottom: 8 }}>
              <button onClick={() => openDocExterno(String(d.slug || d.file))} style={{ cursor: 'pointer' }}>
                {String(d.slug || d.file)}
              </button>
            </li>
          ))}
        </ul>
        {searchItems.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3>Resultados (docs internos)</h3>
            {searchItems.map((s) => (
              <div key={s.file} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{s.title}</strong>
                  <button onClick={() => openDocInterno(s.file)}>Abrir</button>
                </div>
                {s.snippets.map((snip, i) => (
                  <p key={i} style={{ fontSize: 12, color: '#555' }}>{snip}...</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2>Leitura</h2>
        {selected ? (
          isPdf && viewerUrl ? (
            <iframe src={viewerUrl} style={{ width: '100%', height: '80vh', border: '1px solid #ddd' }} title={selected} />
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', background: '#fafafa', padding: 16 }}>
              {content}
            </pre>
          )
        ) : (
          <p>Selecione um material à esquerda ou busque por termo.</p>
        )}
      </div>
    </div>
  );
}