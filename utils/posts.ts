import { getDb } from '@/lib/firebaseClient';

const API_URL = process.env.NEXT_PUBLIC_POSTS_API_URL;

export type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
  author_id?: string | null;
  date?: string;
};

export const demoPosts: Post[] = [
  {
    id: 'demo-1',
    slug: 'boas-vindas',
    title: 'Boas-vindas ao Optilog!',
    content: '<p>Esta é uma postagem de demonstração exibida quando o Firebase não está configurado.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-01-15'
  },
  {
    id: 'demo-2',
    slug: 'como-configurar',
    title: 'Como configurar sua fonte de dados',
    content: '<p>Defina as variáveis <code>NEXT_PUBLIC_FIREBASE_*</code> para integrar seu backend Firestore.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-02-10'
  },
  {
    id: 'demo-3',
    slug: 'ejg-apresentacao',
    title: 'Apresentação EJG',
    content: '<p>Bem-vindo ao preview da EJG com Firebase Hosting (7 dias).</p><p>Este canal expira automaticamente e é ideal para validação rápida.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-03-05'
  },
  {
    id: 'demo-4',
    slug: 'ejg-cases',
    title: 'Casos e Resultados EJG',
    content: '<ul><li>Redução de custos logísticos</li><li>Melhoria no last-mile</li><li>Integração com ERP</li></ul>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-04-18'
  },
  {
    id: 'demo-5',
    slug: 'ejg-roadmap',
    title: 'Roadmap Optilog × EJG',
    content: '<p>Planejamento de entregas, SLAs e integrações prioritárias.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-05-12'
  },
  {
    id: 'demo-6',
    slug: 'ejg-faqs',
    title: 'FAQs EJG',
    content:
      '<ul><li>Como acesso o dashboard? Faça login e vá em Dashboard.</li><li>Posso integrar com ERP? Sim, via APIs.</li><li>O preview dura quanto? 7 dias.</li></ul>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-06-20'
  },
  {
    id: 'demo-7',
    slug: 'ejg-termos',
    title: 'Termos de Uso EJG',
    content: '<p>Termos e condições para uso da plataforma Optilog pela EJG.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-06-21'
  },
  {
    id: 'demo-8',
    slug: 'ejg-politicas',
    title: 'Políticas de Privacidade EJG',
    content: '<p>Política de privacidade e proteção de dados em conformidade com LGPD.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-06-22'
  }
];
// Slugs adicionais para EJG
export const extraDemoPosts: Post[] = [
  {
    id: 'demo-6',
    slug: 'ejg-onboarding',
    title: 'Onboarding EJG',
    content: '<p>Passos de onboarding, permissões e acesso ao painel.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-06-05'
  },
  {
    id: 'demo-7',
    slug: 'ejg-integracoes',
    title: 'Integrações EJG',
    content: '<p>Conexões com ERP, WMS e APIs de transporte.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-07-10'
  },
  {
    id: 'demo-8',
    slug: 'ejg-kpis',
    title: 'KPIs e Metas EJG',
    content: '<p>Visão de KPIs operacionais e metas trimestrais.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-08-14'
  },
  {
    id: 'demo-9',
    slug: 'ejg-contato',
    title: 'Contato e Suporte EJG',
    content: '<p>Canais de suporte, SLA e escalonamento.</p>',
    is_published: true,
    author_id: 'demo-user',
    date: '2024-09-20'
  }
];

// Inclui extras no demoPosts, mantendo compatibilidade
export const allDemoPosts: Post[] = [...demoPosts, ...extraDemoPosts];

export async function getPosts(): Promise<Post[]> {
  // 1) Tenta API externa, se definida
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/posts`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Falha na API externa: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((p: any) => ({
          id: p.id ?? p._id ?? p.slug ?? Math.random().toString(36).slice(2),
          slug: p.slug ?? String(p.id ?? p._id ?? ''),
          title: p.title ?? 'Sem título',
          content: p.content ?? p.description ?? '',
          is_published: Boolean(p.is_published ?? p.published ?? true),
          author_id: p.author_id ?? p.authorId ?? null,
        })) as Post[];
      }
    } catch (e) {
      // Continua para Firestore/demo
      console.warn('Erro ao buscar API externa, usando fallback:', e);
    }
  }

  // 2) Tenta Firestore, se configurado
  const db = await getDb();
  if (db) {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const q = query(collection(db, 'posts'), where('is_published', '==', true));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Post[];
    } catch (err) {
      console.warn('Permissão/erro ao acessar Firestore, usando demo:', err);
      return demoPosts;
    }
  }

  // 3) Fallback demo
  return demoPosts;
}

export async function getPost(slug: string): Promise<Post | null> {
  // 1) Tenta API externa
  if (API_URL) {
    try {
      const base = API_URL.replace(/\/$/, '');
      // Primeiro tenta rota REST por slug; se falhar, tenta query
      let res = await fetch(`${base}/posts/${encodeURIComponent(slug)}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`${base}/posts?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      }
      if (res.ok) {
        const data = await res.json();
        const p = Array.isArray(data) ? data[0] : data;
        if (p) {
          return {
            id: p.id ?? p._id ?? slug,
            slug: p.slug ?? slug,
            title: p.title ?? 'Sem título',
            content: p.content ?? p.description ?? '',
            is_published: Boolean(p.is_published ?? p.published ?? true),
            author_id: p.author_id ?? p.authorId ?? null,
          } as Post;
        }
      }
    } catch (e) {
      console.warn('Erro ao buscar post na API externa, usando fallback:', e);
    }
  }

  // 2) Tenta Firestore
  const db = await getDb();
  if (db) {
    try {
      const { collection, getDocs, query, where, limit } = await import('firebase/firestore');
      const q = query(
        collection(db, 'posts'),
        where('slug', '==', slug),
        where('is_published', '==', true),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...(doc.data() as any) } as Post;
    } catch (err) {
      console.warn('Permissão/erro ao buscar post no Firestore, usando demo:', err);
      return demoPosts.find(p => p.slug === slug) || null;
    }
  }

  // 3) Fallback demo
  return demoPosts.find(p => p.slug === slug) || null;
}

export async function getPostsPage(pageSize: number, afterSlug?: string): Promise<Post[]> {
  // 1) Tenta API externa com parâmetros de paginação
  if (API_URL) {
    try {
      const base = API_URL.replace(/\/$/, '');
      const url = `${base}/posts?limit=${encodeURIComponent(pageSize)}${afterSlug ? `&after=${encodeURIComponent(afterSlug)}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((p: any) => ({
            id: p.id ?? p._id ?? p.slug ?? Math.random().toString(36).slice(2),
            slug: p.slug ?? String(p.id ?? p._id ?? ''),
            title: p.title ?? 'Sem título',
            content: p.content ?? p.description ?? '',
            is_published: Boolean(p.is_published ?? p.published ?? true),
            author_id: p.author_id ?? p.authorId ?? null,
          })) as Post[];
        }
      }
    } catch (e) {
      console.warn('Erro na API externa (paginaçao), usando fallback:', e);
    }
  }

  // 2) Firestore com orderBy('slug') e startAfter
  const db = await getDb();
  if (db) {
    try {
      const { collection, getDocs, query, where, limit, orderBy, startAfter } = await import('firebase/firestore');
      const baseQuery = afterSlug
        ? query(
            collection(db, 'posts'),
            where('is_published', '==', true),
            orderBy('slug'),
            startAfter(afterSlug),
            limit(pageSize)
          )
        : query(
            collection(db, 'posts'),
            where('is_published', '==', true),
            orderBy('slug'),
            limit(pageSize)
          );
      const snap = await getDocs(baseQuery);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Post[];
    } catch (err) {
      console.warn('Permissão/erro ao paginar Firestore, usando demo:', err);
      // 3) Fallback demo com paginação baseada em slug
      const sorted = [...demoPosts].sort((a, b) => a.slug.localeCompare(b.slug));
      let startIndex = 0;
      if (afterSlug) {
        const idx = sorted.findIndex(p => p.slug === afterSlug);
        startIndex = idx >= 0 ? idx + 1 : 0;
      }
      return sorted.slice(startIndex, startIndex + pageSize);
    }
  }

  // 3) Fallback demo com paginação baseada em slug
  const sorted = [...demoPosts].sort((a, b) => a.slug.localeCompare(b.slug));
  let startIndex = 0;
  if (afterSlug) {
    const idx = sorted.findIndex(p => p.slug === afterSlug);
    startIndex = idx >= 0 ? idx + 1 : 0;
  }
  return sorted.slice(startIndex, startIndex + pageSize);
}