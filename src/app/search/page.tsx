import { prisma } from "@/lib/prisma";
import PostFeed from "@/components/posts/PostFeed";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Search className="w-12 h-12 text-dark-muted mx-auto mb-4" />
        <h1 className="text-xl font-bold text-dark-text mb-2">
          Search The Phorum
        </h1>
        <p className="text-sm text-dark-muted">
          Use the search bar above to find posts and discussions.
        </p>
      </div>
    );
  }

  const postsRaw = await prisma.post.findMany({
    where: {
      OR: [{ title: { contains: q } }, { body: { contains: q } }],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
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
  });

  const posts = postsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-dark-text mb-1">
        Search results for &ldquo;{q}&rdquo;
      </h1>
      <p className="text-sm text-dark-muted mb-6">
        {posts.length} {posts.length === 1 ? "result" : "results"} found
      </p>
      <PostFeed posts={posts} />
    </div>
  );
}
