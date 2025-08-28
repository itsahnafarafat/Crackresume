
import { Header } from "@/components/shared/header";
import { blogPosts } from "@/lib/blog-posts";
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

// Generate static pages for each blog post
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

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
                    <time dateTime={post.date}>{post.date}</time>
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

// Add some basic styling for the blog content
const styles = `
.prose h2 {
  font-size: 1.875rem;
  margin-top: 2em;
  margin-bottom: 1em;
  font-weight: 700;
}
.prose p {
  line-height: 1.7;
  margin-bottom: 1.25em;
}
.prose .lead {
    font-size: 1.25em;
    color: hsl(var(--muted-foreground));
}
.prose ul, .prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1.25em;
}
.prose li {
  margin-bottom: 0.5em;
}
.prose blockquote {
  border-left: 4px solid hsl(var(--primary));
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
  color: hsl(var(--muted-foreground));
}
`;

// Inject styles into the global css - a bit of a hack but works for this case
export function getStaticProps() {
  return { props: {} };
}

export function Head() {
  return <style>{styles}</style>
}
