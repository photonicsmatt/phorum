import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostDetail from "@/components/posts/PostDetail";
import CommentThread from "@/components/comments/CommentThread";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, displayName: true } },
      categories: {
        include: {
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
        },
      },
      comments: {
        include: {
          author: {
            select: { id: true, username: true, displayName: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { comments: true } },
    },
  });

  if (!post) notFound();

  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  const serializedComments = post.comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-dark-muted hover:text-dark-text transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to posts
      </Link>

      <div className="space-y-4">
        <PostDetail post={serializedPost} />
        <CommentThread postId={post.id} initialComments={serializedComments} />
      </div>
    </div>
  );
}
