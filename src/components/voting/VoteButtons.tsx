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
  layout = "vertical",
}: VoteButtonsProps) {
  const { user } = useUser();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number>(0);

  const vote = (value: number) => {
    if (!user) return;

    if (userVote === value) {
      setScore(score - value);
      setUserVote(0);
    } else {
      setScore(score - userVote + value);
      setUserVote(value);
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
        title={user ? "Downvote" : "Join to vote"}
      >
        <ChevronDown className={isVertical ? "w-5 h-5" : "w-4 h-4"} />
      </button>
    </div>
  );
}
