import { createAppSlice } from '@/store/create-app-slice';
import { BlogPost } from '@/domain/entities/blog.entity';
import { listBlogPosts } from './list-posts/list-posts.action';
import { STATIC_BLOG_POSTS } from '@/content/blog/posts';

export interface BlogState {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  posts: STATIC_BLOG_POSTS,
  selectedPost: null,
  total: STATIC_BLOG_POSTS.length,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

export const blogSlice = createAppSlice({
  name: 'blog',
  initialState,
  reducers: (create) => ({
    setSelectedPost: create.reducer<BlogPost | null>((state, action) => {
      state.selectedPost = action.payload;
    }),
    addPost: create.reducer<BlogPost>((state, action) => {
      state.posts.unshift(action.payload);
      state.total += 1;
    }),
    updatePost: create.reducer<BlogPost>((state, action) => {
      const idx = state.posts.findIndex((p) => p.id === action.payload.id || p.slug === action.payload.slug);
      if (idx !== -1) {
        state.posts[idx] = action.payload;
      } else {
        state.posts.push(action.payload);
      }
      if (state.selectedPost?.id === action.payload.id) {
        state.selectedPost = action.payload;
      }
    }),
    togglePostStatus: create.reducer<{ id: number | string; status: 'draft' | 'published' }>((state, action) => {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (post) {
        post.status = action.payload.status;
        if (action.payload.status === 'published' && !post.publishedAt) {
          post.publishedAt = new Date().toISOString();
        }
      }
      if (state.selectedPost?.id === action.payload.id) {
        state.selectedPost.status = action.payload.status;
      }
    }),
    deletePost: create.reducer<number | string>((state, action) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
      if (state.selectedPost?.id === action.payload) {
        state.selectedPost = null;
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(listBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data.posts;
        state.total = action.payload.data.total;
        state.page = action.payload.data.page;
        state.limit = action.payload.data.limit;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(listBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load clinical articles';
      });
  },
});

export const {
  setSelectedPost,
  addPost,
  updatePost,
  togglePostStatus,
  deletePost,
} = blogSlice.actions;

export default blogSlice.reducer;
