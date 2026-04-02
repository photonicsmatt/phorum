import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    include: {
      author: { select: { id: true, username: true, displayName: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { content, userId, parentId } = body;

  if (!content || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      body: content,
      authorId: userId,
      postId: id,
      parentId: parentId || null,
    },
    include: {
      author: { select: { id: true, username: true, displayName: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
