"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HelpCircle, Lightbulb } from "lucide-react";
import VoteButtons from "@/components/voting/VoteButtons";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { timeAgo } from "@/lib/utils";

interface PostDetailProps {
  post: {
    id: string;
    title: string;
    body: string;
    type: string;
    score: number;
    createdAt: string;
    author: { id: string; username: string; displayName: string };
    categories: { category: { id: string; name: string; slug: string; color: string } }[];
    _count: { comments: number };
  };
  onCategoryClick?: (slug: string) => void;
  onUserClick?: (username: string) => void;
}

export default function PostDetail({ post, onCategoryClick, onUserClick }: PostDetailProps) {
  const typeIcon = post.type === "question"
    ? <HelpCircle className="w-5 h-5 text-amber-400" />
    : <Lightbulb className="w-5 h-5 text-photon-400" />;

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex gap-4">
        <div className="shrink-0">
          <VoteButtons score={post.score} postId={post.id} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {typeIcon}
            <span className="text-sm text-dark-muted capitalize">{post.type}</span>
            <span className="text-dark-border">|</span>
            <button onClick={() => onUserClick?.(post.author.username)}
              className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-dark-text transition-colors">
              <Avatar username={post.author.username} size="sm" />
              <span>{post.author.username}</span>
            </button>
            <span className="text-sm text-dark-muted">{timeAgo(post.createdAt)}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-text mb-3">{post.title}</h1>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.categories.map(({ category }) => (
              <button key={category.id} onClick={() => onCategoryClick?.(category.slug)}>
                <Badge label={category.name} color={category.color} size="md" />
              </button>
            ))}
          </div>
          <div className="prose-phorum text-dark-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
