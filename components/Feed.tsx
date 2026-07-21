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
  onEditPost: (postId: string, newMessage: string) => Promise<boolean>;
  onEditComment: (commentId: string, postId: string, newMessage: string) => Promise<boolean>;
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
  onEditPost,
  onEditComment,
  onFocusCreate,
}) => {
  return (
    <div className="w-full">
      {isAdmin && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200/60 px-4 py-3 flex items-center justify-between text-xs text-emerald-800 animate-fade-in sticky top-0 lg:top-[57px] z-20">
          <div className="flex items-center gap-2.5 font-bold">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Admin Mode — Edit, delete posts & comments</span>
          </div>
          <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2.5 py-1 rounded-full font-bold tracking-wider uppercase">
            Admin
          </span>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState onFocusCreate={onFocusCreate} />
      ) : (
        <div className="divide-y divide-gray-100">
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
              onEditPost={onEditPost}
              onEditComment={onEditComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
