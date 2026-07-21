'use client';

import React, { useRef, useState, Suspense } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useAdminMode } from '@/hooks/useAdminMode';
import { Header } from '@/components/Header';
import { LeftSidebar } from '@/components/LeftSidebar';
import { CreatePost } from '@/components/CreatePost';
import { Feed } from '@/components/Feed';
import { Toast } from '@/components/Toast';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { ShieldCheck, Waves } from 'lucide-react';

function HomeContent() {
  const {
    posts,
    commentsMap,
    likedPostIds,
    isLoading,
    isPosting,
    stats,
    toasts,
    removeToast,
    addToast,
    createPost,
    toggleLike,
    addComment,
    deleteComment,
    deletePost,
  } = usePosts();

  const { isAdmin, loginAdmin, logoutAdmin } = useAdminMode();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdminLogin = (username: string, password: string): boolean => {
    const success = loginAdmin(username, password);
    if (success) {
      addToast('Welcome Admin (SUBHRA)! Deletion enabled for posts and comments.', 'success');
    }
    return success;
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    addToast('Admin logged out.', 'info');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-text-main antialiased selection:bg-primary/20">
      {/* Mobile Sticky Header (Visible < lg) */}
      <Header
        onScrollToTop={scrollToTop}
        totalPosts={stats.totalPosts}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto flex justify-center min-h-screen">
        {/* Left Column Sidebar (Hidden on mobile < lg, visible >= lg) */}
        <LeftSidebar
          onScrollToTop={scrollToTop}
          isAdmin={isAdmin}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onLogoutAdmin={handleAdminLogout}
        />

        {/* Center Main Column */}
        <main
          ref={mainContainerRef}
          className="flex-1 w-full max-w-2xl border-x-0 sm:border-x border-border min-h-screen bg-white pb-24 lg:pb-0"
        >
          {/* Top Header Bar for Desktop (hidden on mobile < lg) */}
          <div className="hidden lg:flex sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border p-4 items-center justify-between">
            <h1 className="text-xl font-extrabold text-text-main tracking-tight flex items-center gap-2">
              <span>Home</span>
              <Waves className="w-4 h-4 text-primary" />
            </h1>
            
            {isAdmin ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Mode Active</span>
              </div>
            ) : (
              <span className="text-xs text-text-muted font-medium">
                Ripple Feed
              </span>
            )}
          </div>

          {/* Create Post Card */}
          <CreatePost
            onPostCreated={createPost}
            isPosting={isPosting}
            onScrollToTop={scrollToTop}
          />

          {/* Feed List */}
          <Feed
            posts={posts}
            commentsMap={commentsMap}
            likedPostIds={likedPostIds}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onLike={toggleLike}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            onDelete={deletePost}
            onFocusCreate={scrollToTop}
          />
        </main>
      </div>

      {/* Mobile Bottom Navigation Toolbar (< lg) */}
      <MobileBottomNav
        onScrollToTop={scrollToTop}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={handleAdminLogin}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-text-main">
          <div className="animate-pulse font-bold text-lg text-primary flex items-center gap-2">
            <Waves className="w-6 h-6 animate-spin" />
            <span>Loading Ripple By SUBHRA BISWAS...</span>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
