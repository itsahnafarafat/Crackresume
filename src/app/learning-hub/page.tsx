

import { BlogPostCard } from "@/components/blog-post-card";
import { Header } from "@/components/shared/header";
import { firestore } from "@/lib/firebase-admin";
import type { BlogPost } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


async function getBlogPosts(): Promise<BlogPost[] | 'unconfigured' | 'error'> {
    if (!firestore) {
      console.warn("Firestore not initialized. FIREBASE_SERVICE_ACCOUNT_KEY might be missing.");
      return 'unconfigured';
    }
    try {
        const postsSnapshot = await firestore.collection('posts').orderBy('date', 'desc').get();
        if (postsSnapshot.empty) {
            return [];
        }
        const posts = postsSnapshot.docs.map(doc => {
            const data = doc.data() as BlogPost;
            if (data.date && typeof (data.date as any).toDate === 'function') {
                data.date = (data.date as any).toDate().toISOString().split('T')[0];
            }
            return {
                ...data,
                slug: data.slug,
            };
        });
        return posts;
    } catch (error) {
        console.error("Error fetching blog posts from Firestore:", error);
        // This could be a permission error if rules are not set correctly.
        return 'error';
    }
}

export default async function LearningHubPage() {
  const blogPosts = await getBlogPosts();
  
  const renderContent = () => {
    if (blogPosts === 'unconfigured' || blogPosts === 'error') {
        const title = blogPosts === 'unconfigured' ? 'Blog Content Not Available' : 'Error Loading Posts';
        const description = blogPosts === 'unconfigured'
            ? "The blog is not currently configured. The site administrator needs to provide the `FIREBASE_SERVICE_ACCOUNT_KEY` to connect to the database."
            : "There was an error fetching blog posts. Please check the server logs or Firestore security rules.";

       return (
            <div className="max-w-3xl mx-auto text-center bg-yellow-50 border border-yellow-200 p-8 rounded-lg">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                <h2 className="mt-4 text-2xl font-bold text-yellow-900">{title}</h2>
                <p className="mt-2 text-yellow-700">{description}</p>
                 <div className="mt-6">
                     <Button asChild>
                        <Link href="/">
                            &larr; Back to Homepage
                        </Link>
                     </Button>
                </div>
            </div>
       )
    }

    if (blogPosts.length === 0) {
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
