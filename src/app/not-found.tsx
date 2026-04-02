import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-20 h-20 bg-dark-card border border-dark-border rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl text-dark-muted">404</span>
      </div>
      <h1 className="text-2xl font-bold text-dark-text mb-2">Page Not Found</h1>
      <p className="text-dark-muted mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button>Back to The Phorum</Button>
      </Link>
    </div>
  );
}
