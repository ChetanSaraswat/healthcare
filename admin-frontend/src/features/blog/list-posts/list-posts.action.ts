import { createAsyncThunk } from '@reduxjs/toolkit';
import { LIST_BLOG_POSTS_ACTION_TYPE } from './list-posts.type';
import { ListBlogPostsResponse } from './list-posts.interface';
import { listBlogPostsService } from './list-posts.service';

export const listBlogPosts = createAsyncThunk<
  ListBlogPostsResponse,
  { locale?: string; status?: string; page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>(LIST_BLOG_POSTS_ACTION_TYPE, async (params, { rejectWithValue }) => {
  try {
    const result = await listBlogPostsService(params);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch clinical blog articles');
  }
});
