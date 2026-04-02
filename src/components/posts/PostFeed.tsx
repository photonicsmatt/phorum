"use client";

import PostCard from "./PostCard";
import { PostWithDetails } from "@/lib/types";

interface PostFeedProps {
  posts: PostWithDetails[];
}

export default function PostFeed({ posts }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-dark-card border border-dark-border rounded-full flex items-center justify-center">
          <span className="text-2xl">~</span>
        </div>
        <h3 className="text-lg font-semibold text-dark-text mb-1">No posts yet</h3>
        <p className="text-sm text-dark-muted">
          Be the first to start a discussion!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
