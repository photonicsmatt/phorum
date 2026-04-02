"use client";

import { useState } from "react";
import Link from "next/link";
import { Reply, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VoteButtons from "@/components/voting/VoteButtons";
import Avatar from "@/components/ui/Avatar";
import CommentForm from "./CommentForm";
import { CommentWithDetails } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { useUser } from "@/components/providers/UserProvider";

interface CommentItemProps {
  comment: CommentWithDetails;
  postId: string;
  depth: number;
  onReply: (comment: CommentWithDetails) => void;
}

export default function CommentItem({ comment, postId, depth, onReply }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 5;

  return (
    <div className="group">
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-1">
          <Avatar username={comment.author.username} size="sm" />
          {hasReplies && !collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="w-0.5 flex-1 bg-dark-border hover:bg-photon-500 transition-colors rounded-full min-h-[20px]"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/user/${comment.author.username}`}
              className="text-sm font-medium text-dark-text hover:text-photon-400 transition-colors"
            >
              {comment.author.username}
            </Link>
            <span className="text-xs text-dark-muted">{timeAgo(comment.createdAt)}</span>
          </div>

          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center gap-1 text-xs text-dark-muted hover:text-dark-text transition-colors mb-2"
            >
              <ChevronDown className="w-3 h-3" />
              Expand {comment.replies?.length || 0} replies
            </button>
          ) : (
            <>
              <div className="prose-phorum text-sm text-dark-text mb-1.5">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.body}</ReactMarkdown>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <VoteButtons
                  score={comment.score}
                  commentId={comment.id}
                  layout="horizontal"
                />
                {user && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-1 text-xs text-dark-muted hover:text-dark-text transition-colors px-2 py-1 rounded hover:bg-dark-hover"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                )}
              </div>

              {showReplyForm && (
                <div className="mb-3">
                  <CommentForm
                    postId={postId}
                    parentId={comment.id}
                    onSubmit={(newComment) => {
                      onReply({
                        ...newComment,
                        replies: [],
                      });
                      setShowReplyForm(false);
                    }}
                    onCancel={() => setShowReplyForm(false)}
                    placeholder={`Reply to ${comment.author.username}...`}
                    compact
                  />
                </div>
              )}

              {hasReplies && depth < maxDepth && (
                <div className="space-y-3">
                  {comment.replies!.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      postId={postId}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </div>
              )}

              {hasReplies && depth >= maxDepth && (
                <button className="text-xs text-photon-400 hover:text-photon-300 transition-colors">
                  Continue thread →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
