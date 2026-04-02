import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hotScore } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sort = searchParams.get("sort") || "hot";
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};

  if (category) {
    where.categories = {
      some: { category: { slug: category } },
    };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { body: { contains: q } },
    ];
  }

  let orderBy: Record<string, string>[] = [];
  if (sort === "new") {
    orderBy = [{ createdAt: "desc" }];
  } else if (sort === "top") {
    orderBy = [{ score: "desc" }, { createdAt: "desc" }];
  } else {
    // For "hot", we fetch all and sort in memory
    orderBy = [{ createdAt: "desc" }];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      skip: sort === "hot" ? 0 : (page - 1) * limit,
      take: sort === "hot" ? 200 : limit,
      include: {
        author: { select: { id: true, username: true, displayName: true } },
        categories: {
          include: {
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  let result = posts;
  if (sort === "hot") {
    result = posts
      .map((p) => ({ ...p, _hotScore: hotScore(p.score, p.createdAt) }))
      .sort((a, b) => b._hotScore - a._hotScore)
      .slice((page - 1) * limit, page * limit);
  }

  return NextResponse.json({
    posts: result,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content, type, categoryIds, userId } = body;

  if (!title || !content || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      body: content,
      type: type || "discussion",
      authorId: userId,
      categories: categoryIds?.length
        ? {
            create: categoryIds.map((id: string) => ({
              categoryId: id,
            })),
          }
        : undefined,
    },
    include: {
      author: { select: { id: true, username: true, displayName: true } },
      categories: {
        include: {
          category: { select: { id: true, name: true, slug: true, color: true } },
        },
      },
      _count: { select: { comments: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
