"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Clock, TrendingUp } from "lucide-react";
import { SortOption } from "@/lib/types";

export default function SortBar({ currentSort }: { currentSort: SortOption }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const options: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: "hot", label: "Hot", icon: <Flame className="w-4 h-4" /> },
    { value: "new", label: "New", icon: <Clock className="w-4 h-4" /> },
    { value: "top", label: "Top", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setSort(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentSort === opt.value
              ? "bg-photon-600/20 text-photon-400"
              : "text-dark-muted hover:text-dark-text hover:bg-dark-hover"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
