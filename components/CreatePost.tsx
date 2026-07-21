'use client';

import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CreatePostInput } from '@/types/post';
import { getInitials, getAvatarColor } from '@/lib/utils';
import { Send, Loader2, User } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: (input: CreatePostInput) => Promise<boolean>;
  isPosting: boolean;
  onScrollToTop?: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  onPostCreated,
  isPosting,
  onScrollToTop,
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = message.length;
  const maxChars = 280;
  const charsRemaining = maxChars - charCount;

  const getCounterColor = () => {
    if (charCount > 270) return 'text-rose-500 font-bold';
    if (charCount > 240) return 'text-amber-500 font-medium';
    return 'text-text-muted';
  };

  const isSubmitDisabled =
    !name.trim() || !message.trim() || charCount > maxChars || isPosting;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.3 },
        colors: ['#1D9BF0', '#38BDF8', '#818CF8'],
      });
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const success = await onPostCreated({ name, message });

    if (success) {
      // Clear BOTH Name and Message boxes completely
      setName('');
      setMessage('');
      triggerConfetti();
      if (onScrollToTop) {
        onScrollToTop();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const avatarColor = getAvatarColor(name || 'User');
  const firstLetter = getInitials(name || 'A');

  return (
    <div className="bg-white border-b border-border p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3.5">
          {/* Avatar PFP Logo Preview */}
          <div
            style={{ backgroundColor: avatarColor.bgHex, color: avatarColor.textHex }}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm shrink-0 mt-1 select-none border border-black/5"
          >
            {firstLetter}
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                maxLength={50}
                required
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border focus:border-primary rounded-xl text-text-main text-sm placeholder-text-muted outline-none transition-all focus:bg-white"
              />
            </div>

            {/* Message Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's happening?"
                rows={3}
                required
                className="w-full p-2 bg-transparent text-text-main text-base placeholder-text-muted outline-none resize-none border-0 focus:ring-0 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Divider & Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className={`text-xs ${getCounterColor()}`}>
              {charsRemaining}
            </span>
            <div className="w-4 h-4 shrink-0 relative flex items-center justify-center">
              <svg className="w-4 h-4 transform -rotate-90" width={16} height={16} viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    charCount > 270
                      ? 'text-rose-500'
                      : charCount > 240
                      ? 'text-amber-500'
                      : 'text-primary'
                  }
                  strokeDasharray={`${Math.min(100, (charCount / maxChars) * 100)}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
              isSubmitDisabled
                ? 'bg-primary/40 text-white/70 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isPosting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Post</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
