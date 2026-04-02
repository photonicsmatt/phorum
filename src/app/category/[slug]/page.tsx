import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hotScore } from "@/lib/utils";
import { SortOption } from "@/lib/types";
import PostFeed from "@/components/posts/PostFeed";
import SortBar from "@/components/posts/SortBar";
import Sidebar from "@/components/layout/Sidebar";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const sort = (sp.sort as SortOption) || "hot";
  const page = parseInt(sp.page || "1");
  const limit = 20;

  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  if (!category) notFound();

  const postsRaw = await prisma.post.findMany({
    where: { categories: { some: { categoryId: category.id } } },
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
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h1 className="text-xl font-bold text-dark-text">
                {category.name}
              </h1>
            </div>
            <p className="text-sm text-dark-muted mb-4">
              {category.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-muted">
                {category._count.posts} posts
              </span>
              <SortBar currentSort={sort} />
            </div>
          </div>
          <PostFeed posts={posts} />
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar categories={categories} activeSlug={slug} />
        </div>
      </div>
    </div>
  );
}
