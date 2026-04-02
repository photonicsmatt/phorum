"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useUser } from "@/components/providers/UserProvider";
import LoginModal from "@/components/ui/LoginModal";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSubmit: (comment: { id: string; body: string; score: number; createdAt: string; parentId: string | null; author: { id: string; username: string; displayName: string } }) => void;
  onCancel?: () => void;
  placeholder?: string;
  compact?: boolean;
}

export default function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = "Share your thoughts...",
  compact = false,
}: CommentFormProps) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          userId: user.id,
          parentId,
        }),
      });
      const comment = await res.json();
      onSubmit(comment);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={compact ? 2 : 4}
          className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-photon-500 focus:ring-1 focus:ring-photon-500 transition-colors resize-y"
        />
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Comment"}
          </Button>
          {onCancel && (
            <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
