import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, postId, commentId, value } = body;

  if (!userId || (!postId && !commentId) || (value !== 1 && value !== -1)) {
    return NextResponse.json({ error: "Invalid vote data" }, { status: 400 });
  }

  // Use a transaction to ensure atomic score updates
  const result = await prisma.$transaction(async (tx) => {
    // Find existing vote
    let existingVote = null;
    if (postId) {
      existingVote = await tx.vote.findUnique({
        where: { userId_postId: { userId, postId } },
      });
    } else if (commentId) {
      existingVote = await tx.vote.findUnique({
        where: { userId_commentId: { userId, commentId } },
      });
    }

    let scoreDelta = 0;

    if (existingVote) {
      if (existingVote.value === value) {
        // Same vote direction: remove the vote (toggle off)
        await tx.vote.delete({ where: { id: existingVote.id } });
        scoreDelta = -value;
      } else {
        // Different direction: flip the vote
        await tx.vote.update({
          where: { id: existingVote.id },
          data: { value },
        });
        scoreDelta = value * 2; // Remove old vote + add new
      }
    } else {
      // New vote
      await tx.vote.create({
        data: {
          value,
          userId,
          postId: postId || null,
          commentId: commentId || null,
        },
      });
      scoreDelta = value;
    }

    // Update denormalized score
    if (postId) {
      await tx.post.update({
        where: { id: postId },
        data: { score: { increment: scoreDelta } },
      });
    } else if (commentId) {
      await tx.comment.update({
        where: { id: commentId },
        data: { score: { increment: scoreDelta } },
      });
    }

    return { scoreDelta, removed: existingVote?.value === value };
  });

  return NextResponse.json(result);
}
