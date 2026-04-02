"use client";

import { useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { CommentWithDetails } from "@/lib/types";

interface CommentThreadProps {
  postId: string;
  initialComments: CommentWithDetails[];
}

function buildCommentTree(comments: CommentWithDetails[]): CommentWithDetails[] {
  const map = new Map<string, CommentWithDetails>();
  const roots: CommentWithDetails[] = [];

  // First pass: create all nodes with empty replies
  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  // Second pass: build tree
  comments.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function CommentThread({ postId, initialComments }: CommentThreadProps) {
  const [comments, setComments] = useState<CommentWithDetails[]>(initialComments);
  const tree = buildCommentTree(comments);

  const handleNewComment = (comment: CommentWithDetails) => {
    setComments((prev) => [...prev, comment]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-dark-text mb-3">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
        <CommentForm
          postId={postId}
          onSubmit={(c) => handleNewComment({ ...c, replies: [] })}
          placeholder="Add a comment..."
        />
      </div>

      {tree.length > 0 && (
        <div className="space-y-4">
          {tree.map((comment) => (
            <div key={comment.id} className="bg-dark-card border border-dark-border rounded-lg p-4">
              <CommentItem
                comment={comment}
                postId={postId}
                depth={0}
                onReply={handleNewComment}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
