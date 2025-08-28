

import { Header } from "@/components/shared/header";
import { firestore } from "@/lib/firebase-admin";
import type { BlogPost } from "@/lib/types";
import { format } from 'date-fns';
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string): Promise<BlogPost | null | 'unconfigured'> {
    if (!firestore) {
      console.warn("Firestore not initialized. FIREBASE_SERVICE_ACCOUNT_KEY might be missing.");
      return 'unconfigured';
    }
    const postsRef = firestore.collection('posts');
    const snapshot = await postsRef.where('slug', '==', slug).limit(1).get();
    
    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as BlogPost;
    
    if (data.date && typeof (data.date as any).toDate === 'function') {
        data.date = format((data.date as any).toDate(), 'PPP');
    } else if (typeof data.date === 'string') {
        data.date = format(new Date(data.date as string), 'PPP');
    }
    
    return data;
}

export async function generateStaticParams() {
  if (!firestore) {
    return [];
  }
  try {
    const postsSnapshot = await firestore.collection('posts').get();
    return postsSnapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.warn("Could not generate static params for blog posts, Firestore might be unconfigured.");
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (post === 'unconfigured') {
    return (
       <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
             <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center bg-yellow-50 border border-yellow-200 p-8 rounded-lg">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                    <h1 className="mt-4 text-2xl font-bold text-yellow-900">Blog Content Not Available</h1>
                    <p className="mt-2 text-yellow-700">
                        The blog is not currently configured. The site administrator needs to provide the `FIREBASE_SERVICE_ACCOUNT_KEY` to connect to the database.
                    </p>
                    <div className="mt-6">
                         <Button asChild>
                            <Link href="/">
                                &larr; Back to Homepage
                            </Link>
                         </Button>
                    </div>
                </div>
            </div>
          </main>
      </div>
    );
  }

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
