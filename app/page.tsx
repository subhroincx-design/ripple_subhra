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
    editPost,
    editComment,
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
      addToast('Welcome Admin (SUBHRA)! Deletion enabled.', 'success');
    }
    return success;
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    addToast('Admin logged out.', 'info');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-900 antialiased">
      {/* Mobile Header */}
      <Header
        onScrollToTop={scrollToTop}
        totalPosts={stats.totalPosts}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto flex justify-center min-h-screen">
        {/* Desktop Sidebar */}
        <LeftSidebar
          onScrollToTop={scrollToTop}
          isAdmin={isAdmin}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onLogoutAdmin={handleAdminLogout}
        />

        {/* Center Feed Column */}
        <main
          ref={mainContainerRef}
          className="flex-1 w-full max-w-2xl border-x-0 sm:border-x border-gray-200/60 min-h-screen bg-white pb-24 lg:pb-0"
        >
          {/* Desktop Header Bar */}
          <div className="hidden lg:flex sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-4 items-center justify-between">
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>Home</span>
              <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                <Waves className="w-3.5 h-3.5 text-primary" />
              </div>
            </h1>
            
            {isAdmin ? (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Active</span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                Ripple Feed
              </span>
            )}
          </div>

          {/* Create Post */}
          <CreatePost
            onPostCreated={createPost}
            isPosting={isPosting}
            onScrollToTop={scrollToTop}
          />

          {/* Post Feed */}
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
            onEditPost={editPost}
            onEditComment={editComment}
            onFocusCreate={scrollToTop}
          />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav
        onScrollToTop={scrollToTop}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={handleAdminLogin}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/25">
              <Waves className="w-7 h-7 text-white animate-pulse" />
            </div>
            <span className="text-sm font-bold text-gray-400 tracking-wide">Loading Ripple...</span>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
