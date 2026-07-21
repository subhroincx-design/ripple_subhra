'use client';

import React, { useState } from 'react';
import { Post, Comment, CreateCommentInput } from '@/types/post';
import { getInitials, getAvatarColor, getRelativeTime } from '@/lib/utils';
import { CommentSection } from '@/components/CommentSection';
import { Heart, Trash2, Check, X, MessageSquare } from 'lucide-react';

interface PostCardProps {
  post: Post;
  comments?: Comment[];
  isLiked: boolean;
  isAdmin: boolean;
  onLike: (id: string) => void;
  onAddComment: (input: CreateCommentInput) => Promise<boolean>;
  onDeleteComment: (commentId: string, postId: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  comments = [],
  isLiked,
  isAdmin,
  onLike,
  onAddComment,
  onDeleteComment,
  onDelete,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const avatarColor = getAvatarColor(post.name);
  const relativeTime = getRelativeTime(post.created_at);
  const firstLetter = getInitials(post.name);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiking(true);
    onLike(post.id);

    setTimeout(() => {
      setIsLiking(false);
    }, 400);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await onDelete(post.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <article className="group bg-white hover:bg-gray-50/70 border-b border-border p-4 sm:p-5 transition-all duration-150 relative">
      <div className="flex items-start gap-3.5">
        {/* User First-Letter Avatar PFP Logo */}
        <div
          style={{ backgroundColor: avatarColor.bgHex, color: avatarColor.textHex }}
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm shrink-0 select-none mt-0.5 border border-black/5"
        >
          {firstLetter}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header row: Name, timestamp, and Admin Delete button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-text-main text-base truncate">
                {post.name}
              </span>
              <span className="text-text-muted text-sm shrink-0">•</span>
              <span className="text-text-muted text-sm shrink-0 font-normal">
                {relativeTime}
              </span>
            </div>

            {/* Prominent Admin Delete Action */}
            {isAdmin && (
              <div className="shrink-0">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition-all shadow-sm"
                    title="Delete Post (Admin Mode)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-rose-600 text-white rounded-full px-3 py-1 shadow-md animate-scale-in">
                    <span className="text-xs font-bold">Delete?</span>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={isDeleting}
                      className="px-2 py-0.5 rounded-full bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                      title="Confirm Delete"
                    >
                      {isDeleting ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Text */}
          <p className="text-text-main text-base leading-relaxed break-words whitespace-pre-wrap font-normal">
            {post.message}
          </p>

          {/* Interaction Bar: Heart Like & Comment Buttons */}
          <div className="pt-1 flex items-center gap-6">
            {/* Heart Like Button (Toggle Like / Unlike) */}
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-2 py-1 px-2.5 rounded-full text-xs font-medium transition-all ${
                isLiked
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-text-muted hover:text-rose-600 hover:bg-rose-50'
              }`}
              title={isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-200 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : ''
                } ${isLiking ? 'scale-125' : 'scale-100'}`}
              />
              <span className="tabular-nums font-semibold">{post.likes}</span>
            </button>

            {/* Comment Section Toggle Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 py-1 px-2.5 rounded-full text-xs font-medium transition-all ${
                showComments || comments.length > 0
                  ? 'text-sky-600 bg-sky-50'
                  : 'text-text-muted hover:text-sky-600 hover:bg-sky-50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="tabular-nums font-semibold">{comments.length}</span>
            </button>
          </div>

          {/* Expandable Comment Section */}
          {showComments && (
            <CommentSection
              postId={post.id}
              comments={comments}
              isAdmin={isAdmin}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
            />
          )}
        </div>
      </div>
    </article>
  );
};
