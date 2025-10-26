import ClientPage from './ClientPage';
import { demoPosts } from '@/utils/posts';
import { notFound } from 'next/navigation';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  // Gera páginas estáticas para todos os slugs em demoPosts
  return demoPosts.map((p) => ({ slug: p.slug }));
}

export default function PostPage({ params }: PostPageProps) {
  const post = demoPosts.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }
  return <ClientPage post={post} />;
}
