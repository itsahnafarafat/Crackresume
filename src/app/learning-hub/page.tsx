
import { BlogPostCard } from "@/components/blog-post-card";
import { Header } from "@/components/shared/header";
import { firestore } from "@/lib/firebase-admin";
import type { BlogPost } from "@/lib/types";

async function getBlogPosts() {
    const postsSnapshot = await firestore.collection('posts').orderBy('date', 'desc').get();
    const posts = postsSnapshot.docs.map(doc => {
        const data = doc.data() as BlogPost;
        // Ensure date is a plain string for serialization
        if (data.date && typeof (data.date as any).toDate === 'function') {
            data.date = (data.date as any).toDate().toISOString().split('T')[0];
        }
        return {
            ...data,
            slug: data.slug,
        };
    });
    return posts;
}

export default async function LearningHubPage() {
  const blogPosts = await getBlogPosts();
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
      <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t mt-auto">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crackresume. All rights reserved.</p>
      </footer>
    </div>
  );
}
