
import { BlogPostCard } from "@/components/blog-post-card";
import { Header } from "@/components/shared/header";
import { blogPosts } from "@/lib/blog-posts";
import type { BlogPost } from "@/lib/types";

export default async function LearningHubPage() {
  const renderContent = () => {
    if (!blogPosts || blogPosts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No blog posts found. Check back soon!</p>
            </div>
        )
    }

    return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
            ))}
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Learning Hub</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Tips, tricks, and expert advice to help you land your dream job.
            </p>
          </div>
          {renderContent()}
        </div>
      </main>
      <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t mt-auto">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crackresume. All rights reserved.</p>
      </footer>
    </div>
  );
}
