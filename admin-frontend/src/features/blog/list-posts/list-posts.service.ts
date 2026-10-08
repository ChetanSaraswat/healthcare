import { BlogPost } from '@/domain/entities/blog.entity';
import { ListBlogPostsResponse } from './list-posts.interface';
import { STATIC_BLOG_POSTS } from '@/content/blog/posts';

// Blog posts are intentional permanent frontend static content per Requirement 4 & 5
export const INITIAL_MOCK_POSTS: BlogPost[] = STATIC_BLOG_POSTS;

export const listBlogPostsService = async (_params?: any): Promise<ListBlogPostsResponse> => {
  return {
    success: true,
    data: {
      total: STATIC_BLOG_POSTS.length,
      page: 1,
      limit: STATIC_BLOG_POSTS.length,
      totalPages: 1,
      posts: STATIC_BLOG_POSTS,
    },
  };
};
