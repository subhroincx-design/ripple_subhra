export interface Post {
  id: string;
  name: string;
  message: string;
  likes: number;
  created_at: string;
}

export interface CreatePostInput {
  name: string;
  message: string;
}

export interface Comment {
  id: string;
  post_id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface CreateCommentInput {
  post_id: string;
  name: string;
  message: string;
}

export interface Stats {
  totalPosts: number;
  todayPosts: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
