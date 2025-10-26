"use client";
import React from 'react';
import { Post } from '@/utils/posts';
import { useTheme } from '@/app/providers/ThemeProvider';
import { sanitizeHtml } from '@/utils/sanitize';

interface ClientPageProps {
  post: Post;
}

export default function ClientPage({ post }: ClientPageProps) {
  const { colors, spacing, typography } = useTheme();
  const formattedDate = post?.date ? new Date(post.date) : null;
  const dateStr = formattedDate
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(formattedDate)
    : null;
  const safeContent = sanitizeHtml(post?.content ?? '');

  if (!post) return null;

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: spacing.medium,
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <h1
        style={{
          fontSize: typography.h1,
          marginBottom: spacing.small,
        }}
      >
        {post.title}
      </h1>
      {dateStr && (
        <p
          style={{
            fontSize: typography.subtitle,
            color: colors.muted,
            marginBottom: spacing.medium,
          }}
        >
          {dateStr}
        </p>
      )}
      <div
        style={{
          fontSize: typography.body,
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    </div>
  );
}