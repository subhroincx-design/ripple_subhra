'use client';

import React, { useState } from 'react';
import { Comment, CreateCommentInput } from '@/types/post';
import { getInitials, getAvatarColor, getRelativeTime } from '@/lib/utils';
import { Send, User, Loader2, Trash2 } from 'lucide-react';

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
      // Clear BOTH Name and Comment input boxes completely
      setName('');
      setMessage('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="pt-3 border-t border-border/70 space-y-4 animate-fade-in">
      {/* Existing Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-primary/20">
          {comments.map((comment) => {
            const avatarColor = getAvatarColor(comment.name);
            const firstLetter = getInitials(comment.name);
            const relativeTime = getRelativeTime(comment.created_at);

            return (
              <div key={comment.id} className="flex items-start gap-2.5 text-sm group/comment">
                <div
                  style={{ backgroundColor: avatarColor.bgHex, color: avatarColor.textHex }}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs shrink-0 select-none border border-black/5 mt-0.5"
                >
                  {firstLetter}
                </div>
                <div className="flex-1 min-w-0 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 space-y-1 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-text-main text-xs truncate">
                      {comment.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-text-muted text-[11px] font-normal">
                        {relativeTime}
                      </span>

                      {/* Admin Delete Comment Action */}
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteComment(comment.id, postId)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-100 transition-colors"
                          title="Delete Comment (Admin)"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-text-main text-xs leading-relaxed break-words">
                    {comment.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              maxLength={40}
              required
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-border focus:border-primary rounded-lg text-text-main text-xs outline-none transition-all focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
            maxLength={200}
            required
            className="flex-1 px-3 py-1.5 bg-gray-50 border border-border focus:border-primary rounded-lg text-text-main text-xs outline-none transition-all focus:bg-white"
          />

          <button
            type="submit"
            disabled={!name.trim() || !message.trim() || isSubmitting}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
              !name.trim() || !message.trim() || isSubmitting
                ? 'bg-primary/40 text-white/70 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Reply</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
