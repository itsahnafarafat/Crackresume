
import { Header } from "@/components/shared/header";
import { firestore } from "@/lib/firebase-admin";
import type { BlogPost } from "@/lib/types";
import { format } from 'date-fns';
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
    const postsRef = firestore.collection('posts');
    const snapshot = await postsRef.where('slug', '==', slug).limit(1).get();
    
    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as BlogPost;
    
     // Ensure date is a plain string
    if (data.date && typeof (data.date as any).toDate === 'function') {
        data.date = format((data.date as any).toDate(), 'PPP');
    } else {
        data.date = format(new Date(data.date as string), 'PPP');
    }
    
    return data;
}

// Generate static pages for each blog post
export async function generateStaticParams() {
  const postsSnapshot = await firestore.collection('posts').get();
  return postsSnapshot.docs.map((doc) => ({
    slug: doc.data().slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto py-12 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Button asChild variant="outline">
                <Link href="/learning-hub">
                  &larr; Back to Learning Hub
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date as string}>{post.date as string}</time>
                </div>
            </div>

            <Image
              src={post.imageUrl}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg object-cover mb-8 shadow-lg"
              priority
              data-ai-hint="blog post header"
            />

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
      <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t bg-muted/40">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Crackresume. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
