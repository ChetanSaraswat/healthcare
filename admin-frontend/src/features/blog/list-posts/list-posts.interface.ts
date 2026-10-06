import { BlogPost } from '@/domain/entities/blog.entity';

export interface ListBlogPostsResponse {
  success: boolean;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    posts: BlogPost[];
  };
}
