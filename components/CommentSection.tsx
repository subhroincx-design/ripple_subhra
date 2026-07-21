'use client';

import React, { useState } from 'react';
import { Comment, CreateCommentInput } from '@/types/post';
import { getInitials, getAvatarColor, getRelativeTime } from '@/lib/utils';
import { Send, Loader2, Trash2, MessageCircle } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  isAdmin: boolean;
  onAddComment: (input: CreateCommentInput) => Promise<boolean>;
  onDeleteComment: (commentId: string, postId: string) => Promise<boolean>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments = [],
  isAdmin,
  onAddComment,
  onDeleteComment,
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAddComment({
      post_id: postId,
      name: name.trim(),
      message: message.trim(),
    });

    if (success) {
      setName('');
      setMessage('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-3 space-y-3 animate-fade-in">
      {/* Thread Divider with Label */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
          <MessageCircle className="w-3 h-3" />
          {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-primary/20 via-primary/10 to-transparent"></div>
      </div>

      {/* Comments Thread */}
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment, idx) => {
            const avatarColor = getAvatarColor(comment.name);
            const firstLetter = getInitials(comment.name);
            const relativeTime = getRelativeTime(comment.created_at);

            return (
              <div
                key={comment.id}
                className="flex items-start gap-2.5 sm:gap-3 group/comment"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    style={{ backgroundColor: avatarColor.bgHex, color: avatarColor.textHex }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-sm select-none border border-white ring-1 ring-black/5"
                  >
                    {firstLetter}
                  </div>
                  {/* Thread connector line */}
                  {idx < comments.length - 1 && (
                    <div className="absolute left-1/2 top-full w-px h-2 -translate-x-1/2 bg-gray-200"></div>
                  )}
                </div>

                {/* Comment Bubble */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl rounded-tl-md px-3.5 py-2.5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow duration-200">
                    {/* Name + Time Row */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-[13px] truncate leading-tight">
                        {comment.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium tabular-nums">
                          {relativeTime}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteComment(comment.id, postId)}
                            className="opacity-0 group-hover/comment:opacity-100 p-1 rounded-full text-rose-400 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-all duration-150"
                            title="Delete Comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Comment Body */}
                    <p className="text-gray-700 text-[13px] sm:text-sm leading-relaxed break-words">
                      {comment.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Reply Card */}
      <form
        onSubmit={handleSubmit}
        className="flex items-start gap-2.5 sm:gap-3"
      >
        {/* Compose Avatar */}
        <div
          style={{
            backgroundColor: name.trim() ? getAvatarColor(name).bgHex : '#e2e8f0',
            color: name.trim() ? getAvatarColor(name).textHex : '#94a3b8',
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-sm shrink-0 select-none border border-white ring-1 ring-black/5 mt-1 transition-colors duration-300"
        >
          {name.trim() ? getInitials(name) : '?'}
        </div>

        {/* Input Fields */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl rounded-tl-md border border-gray-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200 overflow-hidden">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
            required
            className="w-full px-3.5 pt-2.5 pb-1 bg-transparent text-gray-900 text-[13px] font-semibold placeholder-gray-400 outline-none border-none"
          />
          <div className="flex items-center gap-1.5 px-1.5 pb-1.5">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a reply..."
              maxLength={200}
              required
              className="flex-1 px-2 py-1.5 bg-transparent text-gray-700 text-[13px] placeholder-gray-400 outline-none border-none"
            />
            <button
              type="submit"
              disabled={!name.trim() || !message.trim() || isSubmitting}
              className={`p-2 rounded-full transition-all duration-200 shrink-0 ${
                !name.trim() || !message.trim() || isSubmitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-hover active:scale-90 text-white shadow-sm shadow-primary/20'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
