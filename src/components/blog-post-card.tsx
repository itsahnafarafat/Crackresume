
import type { BlogPost } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/learning-hub/${post.slug}`} className="group">
        <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <CardDescription className="mb-4 text-muted-foreground">{post.excerpt}</CardDescription>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                </div>
                 <div className="flex items-center mt-4 text-primary font-semibold">
                    <span>Read More</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}
