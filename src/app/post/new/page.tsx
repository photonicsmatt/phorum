import PostForm from "@/components/posts/PostForm";
import Card from "@/components/ui/Card";

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-dark-text mb-6">Create a Post</h1>
      <Card className="p-6">
        <PostForm />
      </Card>
    </div>
  );
}
