import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the first letter of a user's name for their avatar PFP logo
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return 'P';
  const cleanName = name.trim().replace(/^[^a-zA-Z0-9]+/, '');
  if (!cleanName) return 'P';
  return cleanName[0].toUpperCase();
}

/**
 * Generates a deterministic clean hex color badge set based on user's name
 */
export function getAvatarColor(name: string): { bgHex: string; textHex: string } {
  const badgeStyles = [
    { bgHex: '#1D9BF0', textHex: '#FFFFFF' }, // Pulse Sky Blue
    { bgHex: '#4F46E5', textHex: '#FFFFFF' }, // Indigo
    { bgHex: '#059669', textHex: '#FFFFFF' }, // Emerald
    { bgHex: '#D97706', textHex: '#FFFFFF' }, // Amber
    { bgHex: '#E11D48', textHex: '#FFFFFF' }, // Rose
    { bgHex: '#7C3AED', textHex: '#FFFFFF' }, // Violet
    { bgHex: '#0D9488', textHex: '#FFFFFF' }, // Teal
    { bgHex: '#2563EB', textHex: '#FFFFFF' }, // Royal Blue
  ];

  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % badgeStyles.length;
  return badgeStyles[index];
}

/**
 * Converts ISO date string to relative time (Just now, 5m, 2h, Yesterday, etc.)
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) {
    return 'Just now';
  }

  if (diffInSeconds < 30) {
    return 'Just now';
  }
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
