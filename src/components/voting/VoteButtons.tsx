"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/components/providers/UserProvider";
import { formatScore } from "@/lib/utils";

interface VoteButtonsProps {
  score: number;
  postId?: string;
  commentId?: string;
  layout?: "vertical" | "horizontal";
}

export default function VoteButtons({
  score: initialScore,
  postId,
  commentId,
  layout = "vertical",
}: VoteButtonsProps) {
  const { user } = useUser();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const vote = async (value: number) => {
    if (!user || loading) return;

    const prevScore = score;
    const prevVote = userVote;

    // Optimistic update
    if (userVote === value) {
      setScore(score - value);
      setUserVote(0);
    } else {
      setScore(score - userVote + value);
      setUserVote(value);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, postId, commentId, value }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback on error
      setScore(prevScore);
      setUserVote(prevVote);
    } finally {
      setLoading(false);
    }
  };

  const isVertical = layout === "vertical";
  const containerClass = isVertical
    ? "flex flex-col items-center gap-0.5"
    : "flex items-center gap-1";

  return (
    <div className={containerClass}>
      <button
        onClick={() => vote(1)}
        className={`p-0.5 rounded transition-colors ${
          userVote === 1
            ? "text-photon-400 bg-photon-400/10"
            : "text-dark-muted hover:text-photon-400 hover:bg-dark-hover"
        }`}
        disabled={!user}
        title={user ? "Upvote" : "Join to vote"}
      >
        <ChevronUp className={isVertical ? "w-5 h-5" : "w-4 h-4"} />
      </button>
      <span
        className={`font-semibold text-sm tabular-nums ${
          userVote === 1
            ? "text-photon-400"
            : userVote === -1
            ? "text-red-400"
            : "text-dark-muted"
        }`}
      >
        {formatScore(score)}
      </span>
      <button
        onClick={() => vote(-1)}
        className={`p-0.5 rounded transition-colors ${
          userVote === -1
            ? "text-red-400 bg-red-400/10"
            : "text-dark-muted hover:text-red-400 hover:bg-dark-hover"
        }`}
        disabled={!user}
        title={user ? "Downvote" : "Join to vote"}
      >
        <ChevronDown className={isVertical ? "w-5 h-5" : "w-4 h-4"} />
      </button>
    </div>
  );
}
