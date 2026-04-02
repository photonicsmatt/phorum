"use client";

import Link from "next/link";
import { Zap, Plus, LogOut } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import LoginModal from "@/components/ui/LoginModal";
import { useUser } from "@/components/providers/UserProvider";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useUser();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-dark-card/80 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-photon-400 to-photon-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-dark-text hidden sm:block">
              The <span className="text-photon-400">Phorum</span>
            </span>
          </Link>

          <SearchBar />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/post/new">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Post</span>
                  </Button>
                </Link>
                <Link href={`/user/${user.username}`} className="flex items-center gap-2">
                  <Avatar username={user.username} size="sm" />
                  <span className="text-sm text-dark-text hidden md:block">{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-dark-muted hover:text-dark-text hover:bg-dark-hover rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Button size="sm" onClick={() => setShowLogin(true)}>
                Join
              </Button>
            )}
          </div>
        </div>
      </nav>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
