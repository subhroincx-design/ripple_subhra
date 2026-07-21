'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Post, CreatePostInput, Comment, CreateCommentInput, Stats, ToastMessage } from '@/types/post';

const INITIAL_DEMO_POSTS: Post[] = [
  {
    id: 'demo-1',
    name: 'Alex Rivers',
    message: 'Welcome to Ripple! Share your thoughts anonymously with zero login hurdles. 🌊',
    likes: 42,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Cyber Nomad',
    message: 'Next.js 15 App Router + Supabase Realtime makes microblogging feel instant. 🚀',
    likes: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

const INITIAL_DEMO_COMMENTS: Record<string, Comment[]> = {
  'demo-1': [
    {
      id: 'c-1',
      post_id: 'demo-1',
      name: 'Sarah',
      message: 'Love the minimalist layout! Super clean design.',
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ],
};

function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load user's liked posts from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('ripple_liked_posts');
      if (stored) {
        setLikedPostIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore
    }
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial posts and comments from Supabase
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setPosts(INITIAL_DEMO_POSTS);
        setCommentsMap(INITIAL_DEMO_COMMENTS);
        setIsLoading(false);
        return;
      }

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        setPosts(INITIAL_DEMO_POSTS);
        setCommentsMap(INITIAL_DEMO_COMMENTS);
      } else {
        setPosts(postsData || []);
      }

      // Fetch comments from Supabase
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

      if (!commentsError && commentsData) {
        const map: Record<string, Comment[]> = {};
        commentsData.forEach((c) => {
          if (!map[c.post_id]) map[c.post_id] = [];
          map[c.post_id].push(c);
        });
        setCommentsMap(map);
      }
    } catch (err) {
      console.error('Error fetching server data:', err);
      setPosts(INITIAL_DEMO_POSTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Realtime subscription for posts and comments
  useEffect(() => {
    fetchPosts();

    if (!isSupabaseConfigured) return;

    const postsChannel = supabase
      .channel('realtime_posts_comments_v5')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPost = payload.new as Post;
            setPosts((prev) => (prev.some((p) => p.id === newPost.id) ? prev : [newPost, ...prev]));
          } else if (payload.eventType === 'UPDATE') {
            const updatedPost = payload.new as Post;
            setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setPosts((prev) => prev.filter((p) => p.id !== deletedId));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newComment = payload.new as Comment;
            setCommentsMap((prev) => {
              const list = prev[newComment.post_id] || [];
              if (list.some((c) => c.id === newComment.id)) return prev;
              return { ...prev, [newComment.post_id]: [...list, newComment] };
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedCommentId = payload.old.id;
            setCommentsMap((prev) => {
              const updated: Record<string, Comment[]> = {};
              Object.keys(prev).forEach((k) => {
                updated[k] = prev[k].filter((c) => c.id !== deletedCommentId);
              });
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [fetchPosts]);

  // Smart Create Post with explicit Server Feedback
  const createPost = useCallback(
    async (input: CreatePostInput): Promise<boolean> => {
      const trimmedName = input.name.trim();
      const trimmedMessage = input.message.trim();

      if (!trimmedName) {
        addToast('Validation Error: Please enter your name.', 'error');
        return false;
      }

      if (!trimmedMessage) {
        addToast('Validation Error: Message cannot be empty.', 'error');
        return false;
      }

      if (trimmedMessage.length > 280) {
        addToast('Validation Error: Message exceeds 280 character limit.', 'error');
        return false;
      }

      setIsPosting(true);

      const tempId = `temp-${Date.now()}`;
      const newPostObject: Post = {
        id: tempId,
        name: trimmedName,
        message: trimmedMessage,
        likes: 0,
        created_at: new Date().toISOString(),
      };

      try {
        if (!isSupabaseConfigured) {
          setPosts((prev) => [newPostObject, ...prev]);
          addToast('Post published locally (Supabase keys pending).', 'info');
          setIsPosting(false);
          return true;
        }

        const { data, error } = await supabase
          .from('posts')
          .insert([{ name: trimmedName, message: trimmedMessage, likes: 0 }])
          .select()
          .single();

        if (error) {
          console.error('Supabase post insert error:', error);
          setPosts((prev) => [newPostObject, ...prev]);
          addToast(`Post published locally. Server error: ${error.message}`, 'info');
          return true;
        }

        if (data) {
          setPosts((prev) => [data, ...prev.filter((p) => p.id !== tempId)]);
          addToast('✅ Post published & recorded on Supabase Server!', 'success');
          return true;
        }

        return true;
      } catch (err) {
        console.error('Error creating post:', err);
        addToast('Post published locally.', 'info');
        return true;
      } finally {
        setIsPosting(false);
      }
    },
    [addToast]
  );

  // Smart Toggle Like / Unlike with explicit Server Feedback
  const toggleLike = useCallback(
    async (postId: string) => {
      const isAlreadyLiked = likedPostIds.has(postId);
      const newLikedSet = new Set(likedPostIds);

      if (isAlreadyLiked) {
        newLikedSet.delete(postId);
        setLikedPostIds(newLikedSet);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ripple_liked_posts', JSON.stringify(Array.from(newLikedSet)));
        }

        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
        );

        if (isSupabaseConfigured && isValidUUID(postId)) {
          try {
            await supabase.rpc('decrement_likes', { post_id: postId });
            addToast('Unliked post (Synced to Server)', 'info');
          } catch (err) {
            console.error('Error decrementing likes:', err);
          }
        }
      } else {
        newLikedSet.add(postId);
        setLikedPostIds(newLikedSet);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ripple_liked_posts', JSON.stringify(Array.from(newLikedSet)));
        }

        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );

        if (isSupabaseConfigured && isValidUUID(postId)) {
          try {
            await supabase.rpc('increment_likes', { post_id: postId });
            addToast('Liked post! (Synced to Server)', 'success');
          } catch (err) {
            console.error('Error incrementing likes:', err);
          }
        }
      }
    },
    [likedPostIds, addToast]
  );

  // Smart Add Comment with explicit Server Verification
  const addComment = useCallback(
    async (input: CreateCommentInput): Promise<boolean> => {
      const trimmedName = input.name.trim();
      const trimmedMessage = input.message.trim();

      if (!trimmedName) {
        addToast('Validation Error: Please enter your name.', 'error');
        return false;
      }

      if (!trimmedMessage) {
        addToast('Validation Error: Comment message cannot be empty.', 'error');
        return false;
      }

      const tempComment: Comment = {
        id: `temp-comment-${Date.now()}`,
        post_id: input.post_id,
        name: trimmedName,
        message: trimmedMessage,
        created_at: new Date().toISOString(),
      };

      // Optimistic UI update
      setCommentsMap((prev) => ({
        ...prev,
        [input.post_id]: [...(prev[input.post_id] || []), tempComment],
      }));

      if (isSupabaseConfigured && isValidUUID(input.post_id)) {
        try {
          const { data, error } = await supabase
            .from('comments')
            .insert([
              {
                post_id: input.post_id,
                name: trimmedName,
                message: trimmedMessage,
              },
            ])
            .select()
            .single();

          if (error) {
            console.error('Supabase comment insert error:', error);
            if (error.code === '42P01') {
              addToast('⚠️ Comments table missing on Supabase server. Run SQL script.', 'error');
            } else {
              addToast(`Comment added locally. Server note: ${error.message}`, 'info');
            }
            return true;
          }

          if (data) {
            setCommentsMap((prev) => ({
              ...prev,
              [input.post_id]: (prev[input.post_id] || []).map((c) =>
                c.id === tempComment.id ? data : c
              ),
            }));
            addToast('✅ Comment recorded on Supabase Server!', 'success');
            return true;
          }
        } catch (err) {
          console.error('Unexpected error syncing comment:', err);
        }
      }

      addToast('Comment added locally.', 'info');
      return true;
    },
    [addToast]
  );

  // Smart Delete Comment with explicit Server Verification
  const deleteComment = useCallback(
    async (commentId: string, postId: string): Promise<boolean> => {
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }));

      if (isSupabaseConfigured && isValidUUID(commentId)) {
        try {
          const { error } = await supabase.from('comments').delete().eq('id', commentId);
          if (error) {
            addToast(`Comment deleted locally. Server note: ${error.message}`, 'info');
            return true;
          }
          addToast('✅ Comment deleted from Supabase Server!', 'info');
          return true;
        } catch (err) {
          console.error('Error deleting comment:', err);
        }
      }

      addToast('Comment deleted.', 'info');
      return true;
    },
    [addToast]
  );

  // Smart Delete Post with explicit Server Verification
  const deletePost = useCallback(
    async (postId: string): Promise<boolean> => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));

      if (isSupabaseConfigured && isValidUUID(postId)) {
        try {
          const { error } = await supabase.from('posts').delete().eq('id', postId);
          if (error) {
            addToast(`Post deleted locally. Server note: ${error.message}`, 'info');
            return true;
          }
          addToast('✅ Post deleted from Supabase Server!', 'info');
          return true;
        } catch (err) {
          console.error('Error deleting post:', err);
          addToast('Failed to delete post.', 'error');
          fetchPosts();
          return false;
        }
      }

      addToast('Post deleted.', 'info');
      return true;
    },
    [addToast, fetchPosts]
  );

  const stats: Stats = useMemo(() => {
    const totalPosts = posts.length;
    const today = new Date().toDateString();
    const todayPosts = posts.filter(
      (p) => new Date(p.created_at).toDateString() === today
    ).length;

    return { totalPosts, todayPosts };
  }, [posts]);

  return {
    posts,
    commentsMap,
    likedPostIds,
    isLoading,
    isPosting,
    stats,
    toasts,
    addToast,
    removeToast,
    createPost,
    toggleLike,
    addComment,
    deleteComment,
    deletePost,
    refreshPosts: fetchPosts,
  };
}
