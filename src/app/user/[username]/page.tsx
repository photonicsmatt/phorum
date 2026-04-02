import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Calendar, MessageSquare, FileText } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import PostFeed from "@/components/posts/PostFeed";
import Card from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { posts: true, comments: true } },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          author: { select: { id: true, username: true, displayName: true } },
          categories: {
            include: {
              category: {
                select: { id: true, name: true, slug: true, color: true },
              },
            },
          },
          _count: { select: { comments: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const posts = user.posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <Avatar username={user.username} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-dark-text">
              {user.displayName}
            </h1>
            <p className="text-sm text-dark-muted">@{user.username}</p>
            {user.bio && (
              <p className="text-sm text-dark-text mt-2">{user.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-dark-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined{" "}
                {formatDistanceToNow(user.createdAt, { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {user._count.posts} posts
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {user._count.comments} comments
              </span>
            </div>
          </div>
        </div>
      </Card>

      <h2 className="text-lg font-semibold text-dark-text mb-4">Posts</h2>
      <PostFeed posts={posts} />
    </div>
  );
}
