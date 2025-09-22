
import type { BlogPost } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { format } from 'date-fns';

export function BlogPostCard({ post }: { post: BlogPost }) {
  const formattedDate = format(new Date(post.date as string), 'PPP');
  return (
    <Link href={`/learning-hub/${post.slug}`} className="group">
        <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-white/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col h-full">
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <CardDescription className="mb-4 text-muted-foreground flex-grow">{post.excerpt}</CardDescription>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-2">
                         <User className="h-4 w-4" />
                         <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.date as string}>{formattedDate}</time>
                    </div>
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
