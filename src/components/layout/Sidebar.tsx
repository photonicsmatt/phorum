import Link from "next/link";
import { CategoryInfo } from "@/lib/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface SidebarProps {
  categories: CategoryInfo[];
  activeSlug?: string;
}

export default function Sidebar({ categories, activeSlug }: SidebarProps) {
  return (
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
          questions, findings, and discussions about optics, lasers, and light-based
          technologies.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-dark-text mb-3">Topics</h3>
        <div className="space-y-1">
          <Link
            href="/"
            className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
              !activeSlug
                ? "bg-photon-600/20 text-photon-400"
                : "text-dark-muted hover:text-dark-text hover:bg-dark-hover"
            }`}
          >
            All Topics
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
                activeSlug === cat.slug
                  ? "bg-photon-600/20 text-photon-400"
                  : "text-dark-muted hover:text-dark-text hover:bg-dark-hover"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </span>
              {cat._count && (
                <span className="text-xs text-dark-muted">{cat._count.posts}</span>
              )}
            </Link>
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
}
