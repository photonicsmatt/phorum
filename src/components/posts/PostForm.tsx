"use client";

import { useState } from "react";
import { HelpCircle, Lightbulb } from "lucide-react";
import Button from "@/components/ui/Button";
import { useUser } from "@/components/providers/UserProvider";
import LoginModal from "@/components/ui/LoginModal";
import { categories } from "@/lib/data";

interface PostFormProps {
  onSubmit: (post: { title: string; body: string; type: string; categoryIds: string[] }) => void;
}

export default function PostForm({ onSubmit }: PostFormProps) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"question" | "discussion">("discussion");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!title.trim()) { setError("Title is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }

    onSubmit({ title: title.trim(), body: content.trim(), type, categoryIds: selectedCategories });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-dark-text mb-2">Post Created!</h3>
        <p className="text-sm text-dark-muted">Your post has been added. (This is a demo — posts are stored in-memory.)</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Post Type</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setType("question")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${type === "question" ? "border-amber-400 bg-amber-400/10 text-amber-400" : "border-dark-border text-dark-muted hover:border-dark-muted"}`}>
              <HelpCircle className="w-4 h-4" /> Question
            </button>
            <button type="button" onClick={() => setType("discussion")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${type === "discussion" ? "border-photon-400 bg-photon-400/10 text-photon-400" : "border-dark-border text-dark-muted hover:border-dark-muted"}`}>
              <Lightbulb className="w-4 h-4" /> Discussion
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={type === "question" ? "What's your question?" : "Share your findings or start a discussion"}
            className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-photon-500 focus:ring-1 focus:ring-photon-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            Content <span className="text-dark-muted font-normal">(Markdown supported)</span>
          </label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="Provide details, context, and any relevant data..." rows={10}
            className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-photon-500 focus:ring-1 focus:ring-photon-500 transition-colors resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            Topics <span className="text-dark-muted font-normal">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedCategories.includes(cat.id) ? "border-current" : "border-dark-border text-dark-muted hover:text-dark-text"}`}
                style={selectedCategories.includes(cat.id) ? { color: cat.color, backgroundColor: `${cat.color}15`, borderColor: `${cat.color}60` } : undefined}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button type="submit">Create Post</Button>
      </form>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
