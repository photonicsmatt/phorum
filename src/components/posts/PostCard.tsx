import Link from "next/link";
import { MessageSquare, HelpCircle, Lightbulb } from "lucide-react";
import VoteButtons from "@/components/voting/VoteButtons";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { PostWithDetails } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface PostCardProps {
  post: PostWithDetails;
}

export default function PostCard({ post }: PostCardProps) {
  const typeIcon =
    post.type === "question" ? (
      <HelpCircle className="w-4 h-4 text-amber-400" />
    ) : (
      <Lightbulb className="w-4 h-4 text-photon-400" />
    );

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

          <Link href={`/post/${post.id}`}>
            <h2 className="text-base font-semibold text-dark-text hover:text-photon-400 transition-colors line-clamp-2 mb-1.5">
              {post.title}
            </h2>
          </Link>

          {post.body && (
            <p className="text-sm text-dark-muted line-clamp-2 mb-2">
              {post.body.slice(0, 200)}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.categories.map(({ category }) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Badge label={category.name} color={category.color} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-dark-muted">
            <Link
              href={`/user/${post.author.username}`}
              className="flex items-center gap-1.5 hover:text-dark-text transition-colors"
            >
              <Avatar username={post.author.username} size="sm" />
              <span>{post.author.username}</span>
            </Link>
            <span>{timeAgo(post.createdAt)}</span>
            <Link
              href={`/post/${post.id}`}
              className="flex items-center gap-1 hover:text-dark-text transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>
                {post._count.comments}{" "}
                {post._count.comments === 1 ? "comment" : "comments"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
