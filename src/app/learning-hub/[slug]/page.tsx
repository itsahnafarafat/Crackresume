
import { Header } from "@/components/shared/header";
import { blogPosts } from "@/lib/blog-posts";
import type { BlogPost } from "@/lib/types";
import { format } from 'date-fns';
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import Link from "next/link";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = format(new Date(post.date as string), 'PPP');

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
                    <time dateTime={post.date as string}>{formattedDate}</time>
                </div>
            </div>

            <div
              className="prose prose-lg max-w-none mt-8"
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
