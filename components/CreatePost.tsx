'use client';

import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CreatePostInput } from '@/types/post';
import { getInitials, getAvatarColor } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

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
  const progress = Math.min(100, (charCount / maxChars) * 100);

  const getCounterColor = () => {
    if (charCount > 270) return 'text-rose-500 font-bold';
    if (charCount > 240) return 'text-amber-500 font-semibold';
    return 'text-gray-400';
  };

  const getProgressColor = () => {
    if (charCount > 270) return 'text-rose-500';
    if (charCount > 240) return 'text-amber-500';
    return 'text-primary';
  };

  const isSubmitDisabled = !name.trim() || !message.trim() || charCount > maxChars || isPosting;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.3 },
        colors: ['#38bdf8', '#818cf8', '#6366f1', '#0ea5e9'],
      });
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const success = await onPostCreated({ name, message });
    if (success) {
      setName('');
      setMessage('');
      triggerConfetti();
      onScrollToTop?.();
    }
  };

  const avatarColor = getAvatarColor(name || 'User');
  const firstLetter = getInitials(name || 'A');

  return (
    <div className="bg-white border-b border-gray-100 p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          {/* Live Avatar Preview */}
          <div
            style={{ backgroundColor: avatarColor.bgHex, color: avatarColor.textHex }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-base shadow-sm shrink-0 mt-1 select-none border border-white ring-1 ring-black/5 transition-colors duration-300"
          >
            {firstLetter}
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              maxLength={50}
              required
              className="w-full px-4 py-2.5 bg-gray-50/80 border border-gray-200 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 rounded-xl text-gray-900 text-sm font-semibold placeholder-gray-400 outline-none transition-all duration-200"
            />

            {/* Message Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's happening?"
              rows={3}
              required
              className="w-full px-4 py-2.5 bg-gray-50/80 border border-gray-200 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none resize-none leading-relaxed transition-all duration-200"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pl-[52px] sm:pl-[56px]">
          <div className="flex items-center gap-2.5">
            <span className={`text-xs tabular-nums ${getCounterColor()}`}>
              {charsRemaining}
            </span>
            <div className="w-5 h-5 shrink-0 relative flex items-center justify-center">
              <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={getProgressColor()}
                  strokeDasharray={`${progress}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
              isSubmitDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-[1.02] active:scale-[0.97]'
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
