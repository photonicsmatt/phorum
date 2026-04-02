export interface PostWithDetails {
  id: string;
  title: string;
  body: string;
  type: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
  };
  categories: {
    category: {
      id: string;
      name: string;
      slug: string;
      color: string;
    };
  }[];
  _count: {
    comments: number;
  };
}

export interface CommentWithDetails {
  id: string;
  body: string;
  score: number;
  createdAt: string;
  parentId: string | null;
  author: {
    id: string;
    username: string;
    displayName: string;
  };
  replies?: CommentWithDetails[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  _count?: {
    posts: number;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  createdAt: string;
}

export type SortOption = "hot" | "new" | "top";
