'use client';

import React from 'react';
import { Post, Comment, CreateCommentInput } from '@/types/post';
import { PostCard } from '@/components/PostCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { ShieldCheck } from 'lucide-react';

interface FeedProps {
  posts: Post[];
  commentsMap?: Record<string, Comment[]>;
  likedPostIds?: Set<string>;
  isLoading: boolean;
  isAdmin: boolean;
  onLike: (id: string) => void;
  onAddComment: (input: CreateCommentInput) => Promise<boolean>;
  onDeleteComment: (commentId: string, postId: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onFocusCreate?: () => void;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  commentsMap = {},
  likedPostIds = new Set(),
  isLoading,
  isAdmin,
  onLike,
  onAddComment,
  onDeleteComment,
  onDelete,
  onFocusCreate,
}) => {
  return (
    <div className="w-full">
      {/* Admin Mode Status Banner (only visible if admin mode is active) */}
      {isAdmin && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-800 animate-fade-in sticky top-[57px] z-20">
          <div className="flex items-center gap-2 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Admin Mode Active (SUBHRA) — Delete buttons visible for posts & comments</span>
          </div>
          <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold">
            ADMIN
          </span>
        </div>
      )}

      {/* Main Feed Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState onFocusCreate={onFocusCreate} />
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              comments={commentsMap[post.id] || []}
              isLiked={likedPostIds.has(post.id)}
              isAdmin={isAdmin}
              onLike={onLike}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
