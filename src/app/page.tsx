import { prisma } from "@/lib/prisma";
import { hotScore } from "@/lib/utils";
import { SortOption } from "@/lib/types";
import PostFeed from "@/components/posts/PostFeed";
import SortBar from "@/components/posts/SortBar";
import Sidebar from "@/components/layout/Sidebar";

interface HomeProps {
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const sort = (params.sort as SortOption) || "hot";
  const page = parseInt(params.page || "1");
  const limit = 20;

  const [categories, postsRaw, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.post.findMany({
      orderBy:
        sort === "new"
          ? { createdAt: "desc" }
          : sort === "top"
          ? [{ score: "desc" }, { createdAt: "desc" }]
          : { createdAt: "desc" },
      skip: sort === "hot" ? 0 : (page - 1) * limit,
      take: sort === "hot" ? 200 : limit,
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
    }),
    prisma.post.count(),
  ]);

  let posts = postsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  if (sort === "hot") {
    posts = posts
      .map((p) => ({
        ...p,
        _hot: hotScore(p.score, new Date(p.createdAt)),
      }))
      .sort((a, b) => b._hot - a._hot)
      .slice((page - 1) * limit, page * limit);
  }

  const serializedCategories = categories.map((c) => ({
    ...c,
    _count: c._count,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-dark-text">Posts</h1>
            <SortBar currentSort={sort} />
          </div>
          <PostFeed posts={posts} />
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar categories={serializedCategories} />
        </div>
      </div>
    </div>
  );
}
