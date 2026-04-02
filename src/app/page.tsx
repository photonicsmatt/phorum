"use client";

import { useState, useMemo } from "react";
import { posts as allPosts, categories, comments as allComments, users } from "@/lib/data";
import { hotScore } from "@/lib/utils";
import { SortOption, PostWithDetails } from "@/lib/types";
import PostFeed from "@/components/posts/PostFeed";
import PostDetail from "@/components/posts/PostDetail";
import PostForm from "@/components/posts/PostForm";
import CommentThread from "@/components/comments/CommentThread";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { Flame, Clock, TrendingUp, ArrowLeft, Calendar, MessageSquare, FileText } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type View =
  | { page: "home" }
  | { page: "post"; id: string }
  | { page: "newpost" }
  | { page: "category"; slug: string }
  | { page: "user"; username: string }
  | { page: "search"; query: string };

export default function Home() {
  const [view, setView] = useState<View>({ page: "home" });
  const [sort, setSort] = useState<SortOption>("hot");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (v: View) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  const handleNavbarNavigate = (viewName: string, data?: string) => {
    switch (viewName) {
      case "home": navigate({ page: "home" }); break;
      case "newpost": navigate({ page: "newpost" }); break;
      case "search": navigate({ page: "search", query: data || "" }); break;
      case "user": navigate({ page: "user", username: data || "" }); break;
    }
  };

  const NavbarEl = <Navbar onNavigate={handleNavbarNavigate} />;

  const sortedPosts = useMemo(() => {
    const sorted = [...allPosts];
    if (sort === "new") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "top") {
      sorted.sort((a, b) => b.score - a.score);
    } else {
      sorted.sort((a, b) => hotScore(b.score, new Date(b.createdAt)) - hotScore(a.score, new Date(a.createdAt)));
    }
    return sorted;
  }, [sort]);

  const filterByCategory = (slug: string) => {
    return sortedPosts.filter((p) => p.categories.some((c) => c.category.slug === slug));
  };

  const filterByUser = (username: string) => {
    return allPosts.filter((p) => p.author.username === username);
  };

  const searchPosts = (q: string) => {
    const lower = q.toLowerCase();
    return allPosts.filter((p) => p.title.toLowerCase().includes(lower) || p.body.toLowerCase().includes(lower));
  };

  // Sort bar component
  const SortBarInline = () => (
    <div className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-1">
      {([
        { value: "hot" as SortOption, label: "Hot", icon: <Flame className="w-4 h-4" /> },
        { value: "new" as SortOption, label: "New", icon: <Clock className="w-4 h-4" /> },
        { value: "top" as SortOption, label: "Top", icon: <TrendingUp className="w-4 h-4" /> },
      ]).map((opt) => (
        <button key={opt.value} onClick={() => setSort(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sort === opt.value ? "bg-photon-600/20 text-photon-400" : "text-dark-muted hover:text-dark-text hover:bg-dark-hover"}`}>
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );

  // Back button
  const BackButton = () => (
    <button onClick={() => navigate({ page: "home" })}
      className="inline-flex items-center gap-1.5 text-sm text-dark-muted hover:text-dark-text transition-colors mb-4">
      <ArrowLeft className="w-4 h-4" /> Back to posts
    </button>
  );

  // Enhanced sidebar that uses navigate
  const SidebarWithNav = ({ activeSlug }: { activeSlug?: string }) => (
    <aside className="w-full space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-photon-400 to-photon-600 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <h2 className="font-semibold text-dark-text">About The Phorum</h2>
        </div>
        <p className="text-sm text-dark-muted leading-relaxed">
          A community for photonics engineers, scientists, and researchers to share
          questions, findings, and discussions about optics, lasers, and light-based technologies.
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold text-dark-text mb-3">Topics</h3>
        <div className="space-y-1">
          <button onClick={() => navigate({ page: "home" })}
            className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${!activeSlug ? "bg-photon-600/20 text-photon-400" : "text-dark-muted hover:text-dark-text hover:bg-dark-hover"}`}>
            All Topics
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => navigate({ page: "category", slug: cat.slug })}
              className={`flex items-center justify-between w-full px-3 py-1.5 rounded-md text-sm transition-colors ${activeSlug === cat.slug ? "bg-photon-600/20 text-photon-400" : "text-dark-muted hover:text-dark-text hover:bg-dark-hover"}`}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </span>
              {cat._count && <span className="text-xs text-dark-muted">{cat._count.posts}</span>}
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold text-dark-text mb-2">Rules</h3>
        <ol className="text-sm text-dark-muted space-y-1.5 list-decimal list-inside">
          <li>Be respectful and professional</li>
          <li>Back claims with data or references</li>
          <li>No spam or self-promotion</li>
          <li>Use appropriate topic tags</li>
          <li>Search before posting duplicates</li>
        </ol>
      </Card>
    </aside>
  );

  // Post feed that uses navigate for links
  const PostFeedWithNav = ({ posts }: { posts: PostWithDetails[] }) => (
    <PostFeed posts={posts} onPostClick={(id) => navigate({ page: "post", id })}
      onCategoryClick={(slug) => navigate({ page: "category", slug })}
      onUserClick={(username) => navigate({ page: "user", username })} />
  );

  // ---- RENDER CONTENT ----
  const renderContent = () => {
    if (view.page === "post") {
      const post = allPosts.find((p) => p.id === view.id);
      if (!post) return <div className="max-w-4xl mx-auto px-4 py-6"><BackButton /><p>Post not found.</p></div>;
      const postComments = allComments[post.id] || [];
      return (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <BackButton />
          <div className="space-y-4">
            <PostDetail post={post}
              onCategoryClick={(slug) => navigate({ page: "category", slug })}
              onUserClick={(username) => navigate({ page: "user", username })} />
            <CommentThread postId={post.id} initialComments={postComments} />
          </div>
        </div>
      );
    }

    if (view.page === "newpost") {
      return (
        <div className="max-w-3xl mx-auto px-4 py-6">
          <BackButton />
          <h1 className="text-2xl font-bold text-dark-text mb-6">Create a Post</h1>
          <Card className="p-6">
            <PostForm onSubmit={() => {}} />
          </Card>
        </div>
      );
    }

    if (view.page === "category") {
      const category = categories.find((c) => c.slug === view.slug);
      if (!category) return <div className="max-w-4xl mx-auto px-4 py-6"><BackButton /><p>Category not found.</p></div>;
      const filteredPosts = filterByCategory(view.slug);
      return (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <h1 className="text-xl font-bold text-dark-text">{category.name}</h1>
                </div>
                <p className="text-sm text-dark-muted mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-muted">{filteredPosts.length} posts</span>
                  <SortBarInline />
                </div>
              </div>
              <PostFeedWithNav posts={filteredPosts} />
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <SidebarWithNav activeSlug={view.slug} />
            </div>
          </div>
        </div>
      );
    }

    if (view.page === "user") {
      const user = users.find((u) => u.username === view.username);
      if (!user) return <div className="max-w-4xl mx-auto px-4 py-6"><BackButton /><p>User not found.</p></div>;
      const userPosts = filterByUser(view.username);
      const userCommentCount = Object.values(allComments).flat().filter((c) => c.author.username === view.username).length;
      return (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <BackButton />
          <Card className="p-6 mb-6">
            <div className="flex items-start gap-4">
              <Avatar username={user.username} size="lg" />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-dark-text">{user.displayName}</h1>
                <p className="text-sm text-dark-muted">@{user.username}</p>
                {user.bio && <p className="text-sm text-dark-text mt-2">{user.bio}</p>}
                <div className="flex items-center gap-4 mt-3 text-sm text-dark-muted">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {timeAgo(user.createdAt)}</span>
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {userPosts.length} posts</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {userCommentCount} comments</span>
                </div>
              </div>
            </div>
          </Card>
          <h2 className="text-lg font-semibold text-dark-text mb-4">Posts</h2>
          <PostFeedWithNav posts={userPosts} />
        </div>
      );
    }

    if (view.page === "search") {
      const results = searchPosts(view.query);
      return (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <BackButton />
          <h1 className="text-xl font-bold text-dark-text mb-1">Search results for &ldquo;{view.query}&rdquo;</h1>
          <p className="text-sm text-dark-muted mb-6">{results.length} {results.length === 1 ? "result" : "results"} found</p>
          <PostFeedWithNav posts={results} />
        </div>
      );
    }

    // HOME
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-dark-text">Posts</h1>
              <SortBarInline />
            </div>
            <PostFeedWithNav posts={sortedPosts} />
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <SidebarWithNav />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {NavbarEl}
      <main className="flex-1">{renderContent()}</main>
    </>
  );
}
