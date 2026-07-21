'use client';

import React, { useState } from 'react';
import { Post, Comment, CreateCommentInput } from '@/types/post';
import { getInitials, getAvatarColor, getRelativeTime } from '@/lib/utils';
import { CommentSection } from '@/components/CommentSection';
import { Heart, Trash2, X, MessageSquare, Pencil, Check } from 'lucide-react';

interface PostCardProps {
  post: Post;
  comments?: Comment[];
  isLiked: boolean;
  isAdmin: boolean;
  onLike: (id: string) => void;
  onAddComment: (input: CreateCommentInput) => Promise<boolean>;
  onDeleteComment: (commentId: string, postId: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onEditPost: (postId: string, newMessage: string) => Promise<boolean>;
  onEditComment: (commentId: string, postId: string, newMessage: string) => Promise<boolean>;
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
  onEditPost,
  onEditComment,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(post.message);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const avatarColor = getAvatarColor(post.name);
  const relativeTime = getRelativeTime(post.created_at);
  const firstLetter = getInitials(post.name);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiking(true);
    onLike(post.id);
    setTimeout(() => setIsLiking(false), 400);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await onDelete(post.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleEditSave = async () => {
    if (!editMessage.trim() || editMessage.trim() === post.message) {
      setIsEditing(false);
      setEditMessage(post.message);
      return;
    }
    setIsSavingEdit(true);
    const success = await onEditPost(post.id, editMessage);
    setIsSavingEdit(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditMessage(post.message);
  };

  return (
    <article className="bg-white hover:bg-gray-50/50 p-4 sm:p-5 transition-colors duration-150 relative animate-fade-in">
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* User Avatar */}
        <div
          style={{ backgroundColor: avatarColor.bgHex, color: avatarColor.textHex }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-base shadow-sm shrink-0 select-none border border-white ring-1 ring-black/5"
        >
          {firstLetter}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Header: Name + Time + Admin Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-gray-900 text-[15px] truncate">
                {post.name}
              </span>
              <span className="text-gray-300 text-sm shrink-0">·</span>
              <span className="text-gray-400 text-[13px] shrink-0 font-medium tabular-nums">
                {relativeTime}
              </span>
            </div>

            {/* Admin Actions: Edit + Delete */}
            {isAdmin && !isEditing && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { setIsEditing(true); setEditMessage(post.message); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-500 border border-blue-200/80 text-xs font-semibold transition-all"
                  title="Edit Post"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-500 border border-rose-200/80 text-xs font-semibold transition-all"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full px-3 py-1.5 shadow-lg shadow-rose-500/25 animate-scale-in">
                    <span className="text-xs font-bold">Sure?</span>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={isDeleting}
                      className="px-2 py-0.5 rounded-full bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      {isDeleting ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="p-0.5 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message or Edit Mode */}
          {isEditing ? (
            <div className="space-y-2.5 animate-fade-in">
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={3}
                maxLength={280}
                className="w-full px-3.5 py-2.5 bg-blue-50/50 border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl text-gray-900 text-[15px] placeholder-gray-400 outline-none resize-none leading-relaxed transition-all"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 tabular-nums">{280 - editMessage.length} chars left</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEditCancel}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={isSavingEdit || !editMessage.trim()}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSavingEdit || !editMessage.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md shadow-blue-500/20 active:scale-95'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSavingEdit ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 text-[15px] leading-[1.6] break-words whitespace-pre-wrap font-normal">
              {post.message}
            </p>
          )}

          {/* Interaction Bar */}
          <div className="pt-1 flex items-center gap-1">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-2 py-2 px-3 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                isLiked
                  ? 'text-rose-500 bg-rose-50/80'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50/60'
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-[18px] h-[18px] transition-transform duration-200 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : ''
                } ${isLiking ? 'scale-[1.3]' : 'scale-100'}`}
              />
              <span className="tabular-nums">{post.likes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 py-2 px-3 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                showComments
                  ? 'text-primary bg-primary/5'
                  : comments.length > 0
                  ? 'text-primary/70 bg-primary/5'
                  : 'text-gray-400 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <MessageSquare className="w-[18px] h-[18px]" />
              <span className="tabular-nums">{comments.length}</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <CommentSection
              postId={post.id}
              comments={comments}
              isAdmin={isAdmin}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              onEditComment={onEditComment}
            />
          )}
        </div>
      </div>
    </article>
  );
};
