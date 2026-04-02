"use client";

import { MessageSquare, HelpCircle, Lightbulb } from "lucide-react";
import VoteButtons from "@/components/voting/VoteButtons";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { PostWithDetails } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface PostCardProps {
  post: PostWithDetails;
  onPostClick?: (id: string) => void;
  onCategoryClick?: (slug: string) => void;
  onUserClick?: (username: string) => void;
}

export default function PostCard({ post, onPostClick, onCategoryClick, onUserClick }: PostCardProps) {
  const typeIcon = post.type === "question"
    ? <HelpCircle className="w-4 h-4 text-amber-400" />
    : <Lightbulb className="w-4 h-4 text-photon-400" />;

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-photon-700/50 transition-colors">
      <div className="flex gap-3">
        <div className="shrink-0 pt-1">
          <VoteButtons score={post.score} postId={post.id} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {typeIcon}
            <span className="text-xs text-dark-muted capitalize">{post.type}</span>
          </div>
          <button onClick={() => onPostClick?.(post.id)} className="text-left">
            <h2 className="text-base font-semibold text-dark-text hover:text-photon-400 transition-colors line-clamp-2 mb-1.5">
              {post.title}
            </h2>
          </button>
          {post.body && (
            <p className="text-sm text-dark-muted line-clamp-2 mb-2">{post.body.slice(0, 200)}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.categories.map(({ category }) => (
              <button key={category.id} onClick={() => onCategoryClick?.(category.slug)}>
                <Badge label={category.name} color={category.color} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-dark-muted">
            <button onClick={() => onUserClick?.(post.author.username)}
              className="flex items-center gap-1.5 hover:text-dark-text transition-colors">
              <Avatar username={post.author.username} size="sm" />
              <span>{post.author.username}</span>
            </button>
            <span>{timeAgo(post.createdAt)}</span>
            <button onClick={() => onPostClick?.(post.id)}
              className="flex items-center gap-1 hover:text-dark-text transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
