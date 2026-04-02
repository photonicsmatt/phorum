"use client";

import { useState } from "react";
import { useUser } from "@/components/providers/UserProvider";
import { X } from "lucide-react";
import Button from "./Button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    if (trimmed.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setError("Username can only contain letters, numbers, hyphens, and underscores");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(trimmed);
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-text">Join The Phorum</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-dark-text">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-dark-muted mb-4">
          Choose a username to start posting and commenting.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-photon-500 focus:ring-1 focus:ring-photon-500 mb-3"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining..." : "Join"}
          </Button>
        </form>
      </div>
    </div>
  );
}
