'use client';
import React, { useMemo, useEffect, useState } from 'react';
import { demoPosts } from '@/utils/posts';
import type { Post } from '@/utils/posts';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PostsPage() {
  const [featured, setFeatured] = useState<Post[]>([]);
  useEffect(() => {
    const fetchFeatured = async () => {
      const base = process.env.NEXT_PUBLIC_POSTS_API_URL || '/api/data';
      try {
        const res = await fetch(`${base.replace(/\/$/, '')}/posts?featured=true&limit=3`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const arr: Post[] = Array.isArray(data) ? data : [data];
        setFeatured(arr.filter(Boolean));
      } catch (e) {
        // Fallback: top 3 por data
        const sorted = [...demoPosts].sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        });
        setFeatured(sorted.slice(0, 3));
      }
    };
    fetchFeatured();
  }, []);
  const formatDate = (d?: string) => {
    if (!d) return null;
    const dt = new Date(d);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(dt);
  };
  const searchParams = useSearchParams();
  const router = useRouter();
  const setParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const sortParam = searchParams.get('sort');
  const sort: 'newest' | 'oldest' | 'title' =
    sortParam === 'oldest' || sortParam === 'title' ? (sortParam as any) : 'newest';
  const rangeParam = searchParams.get('range');
  const range: 'all' | '7' | '30' =
    rangeParam === '7' || rangeParam === '30' ? (rangeParam as any) : 'all';
  const categoryParam = searchParams.get('category');
  const category: 'all' | 'ejg' | 'general' =
    categoryParam === 'ejg' || categoryParam === 'general' ? (categoryParam as any) : 'all';
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const now = new Date();
  const filtered = useMemo(() => {
    let arr = demoPosts;
    if (category === 'ejg') arr = arr.filter((p) => p.slug.startsWith('ejg-'));
    if (category === 'general') arr = arr.filter((p) => !p.slug.startsWith('ejg-'));
    if (range !== 'all') {
      const days = range === '7' ? 7 : 30;
      const cutoff = now.getTime() - days * 86400000;
      arr = arr.filter((p) => {
        if (!p.date) return false;
        const ts = new Date(p.date).getTime();
        return ts >= cutoff;
      });
    }
    return arr;
  }, [searchParams, category, now, range]);
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
      const da = a.date ? new Date(a.date).getTime() : null;
      const db = b.date ? new Date(b.date).getTime() : null;
      if (da !== null && db !== null && da !== db) {
        return sort === 'newest' ? db - da : da - db;
      }
      if (da === null && db !== null) return 1;
      if (da !== null && db === null) return -1;
      return a.title.localeCompare(b.title);
    });
    return arr;
  }, [filtered, sort]);
  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(totalPages, Math.max(1, page));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
      <h1>Posts</h1>
      {featured.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 18 }}>Destaques</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {featured.map((p) => (
              <div
                key={p.slug}
                style={{
                  border: '1px solid #333',
                  borderRadius: 6,
                  padding: '0.5rem 0.75rem',
                  background: '#111',
                  width: 'calc(50% - 0.75rem)',
                }}
              >
                <Link href={`/posts/${p.slug}`} style={{ fontWeight: 600 }}>
                  {p.title}
                </Link>
                {p.date && <div style={{ color: '#888', fontSize: 12 }}>{formatDate(p.date)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setParams({ sort: 'newest', page: '1' })}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: 4,
            border: '1px solid #444',
            background: sort === 'newest' ? '#222' : '#111',
            color: '#fff',
          }}
        >
          Mais recentes
        </button>
        <button
          onClick={() => setParams({ sort: 'oldest', page: '1' })}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: 4,
            border: '1px solid #444',
            background: sort === 'oldest' ? '#222' : '#111',
            color: '#fff',
          }}
        >
          Mais antigos
        </button>
        <button
          onClick={() => setParams({ sort: 'title', page: '1' })}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: 4,
            border: '1px solid #444',
            background: sort === 'title' ? '#222' : '#111',
            color: '#fff',
          }}
        >
          Título A–Z
        </button>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#bbb' }}>Período</span>
          <select
            value={range}
            onChange={(e) =>
              setParams({ range: e.target.value === 'all' ? null : e.target.value, page: '1' })
            }
            style={{
              padding: '0.25rem',
              borderRadius: 4,
              background: '#111',
              color: '#fff',
              border: '1px solid #444',
            }}
          >
            <option value="all">Todos</option>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
          </select>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#bbb' }}>Categoria</span>
          <select
            value={category}
            onChange={(e) =>
              setParams({ category: e.target.value === 'all' ? null : e.target.value, page: '1' })
            }
            style={{
              padding: '0.25rem',
              borderRadius: 4,
              background: '#111',
              color: '#fff',
              border: '1px solid #444',
            }}
          >
            <option value="all">Todas</option>
            <option value="ejg">EJG</option>
            <option value="general">Geral</option>
          </select>
        </label>
      </div>
      <ul>
        {pageItems.map((post) => (
          <li key={post.slug} style={{ marginBottom: '0.5rem' }}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            {post.date && (
              <span style={{ marginLeft: '0.5rem', color: '#888' }}>— {formatDate(post.date)}</span>
            )}
            {post.date && new Date(post.date).getTime() >= new Date().getTime() - 7 * 86400000 && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.1rem 0.3rem',
                  borderRadius: 4,
                  background: '#224422',
                  color: '#c8f7c5',
                  fontSize: 12,
                }}
              >
                Novo
              </span>
            )}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          disabled={currentPage <= 1}
          onClick={() => setParams({ page: String(currentPage - 1) })}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: 4,
            border: '1px solid #444',
            background: currentPage <= 1 ? '#222' : '#111',
            color: '#fff',
          }}
        >
          Anterior
        </button>
        <span style={{ color: '#bbb' }}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setParams({ page: String(currentPage + 1) })}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: 4,
            border: '1px solid #444',
            background: currentPage >= totalPages ? '#222' : '#111',
            color: '#fff',
          }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
