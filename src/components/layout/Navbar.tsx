"use client";

import { Zap, Plus, LogOut, Search } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import LoginModal from "@/components/ui/LoginModal";
import { useUser } from "@/components/providers/UserProvider";
import { useState } from "react";

interface NavbarProps {
  onNavigate?: (view: string, data?: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const { user, logout } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate?.("search", searchQuery.trim());
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-dark-card/80 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => onNavigate?.("home")} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-photon-400 to-photon-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-dark-text hidden sm:block">
              The <span className="text-photon-400">Phorum</span>
            </span>
          </button>

          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input type="text" placeholder="Search The Phorum..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-photon-500 focus:ring-1 focus:ring-photon-500 transition-colors" />
          </form>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Button size="sm" className="gap-1.5" onClick={() => onNavigate?.("newpost")}>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Post</span>
                </Button>
                <button onClick={() => onNavigate?.("user", user.username)} className="flex items-center gap-2">
                  <Avatar username={user.username} size="sm" />
                  <span className="text-sm text-dark-text hidden md:block">{user.username}</span>
                </button>
                <button onClick={logout}
                  className="p-2 text-dark-muted hover:text-dark-text hover:bg-dark-hover rounded-lg transition-colors" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Button size="sm" onClick={() => setShowLogin(true)}>Join</Button>
            )}
          </div>
        </div>
      </nav>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
