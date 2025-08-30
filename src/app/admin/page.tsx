
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { BlogPost } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type BlogPostWithId = BlogPost & { id: string };

function PostFormDialog({ post, onSave, triggerButton }: { post?: BlogPostWithId, onSave: (data: Omit<BlogPost, 'date'>) => void, triggerButton: React.ReactElement }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<BlogPost, 'date'>>({
        title: '',
        slug: '',
        author: '',
        excerpt: '',
        imageUrl: '',
        content: ''
    });
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (post) {
                setFormData(post);
            } else {
                 setFormData({
                    title: '',
                    slug: '',
                    author: '',
                    excerpt: '',
                    imageUrl: 'https://picsum.photos/600/400',
                    content: ''
                });
            }
        }
    }, [post, isOpen]);

    const handleSave = () => {
        if (!formData.title || !formData.slug || !formData.author || !formData.excerpt || !formData.content) {
            toast({ title: "Missing Fields", description: "Please fill out all fields.", variant: "destructive" });
            return;
        }
        onSave(formData);
        setIsOpen(false);
    };
    
    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-right">Slug</Label>
                        <Input id="slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="author" className="text-right">Author</Label>
                        <Input id="author" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                        <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="excerpt" className="text-right pt-2">Excerpt</Label>
                        <Textarea id="excerpt" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className="col-span-3" rows={3} />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="content" className="text-right pt-2">Content (HTML)</Label>
                        <Textarea id="content" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="col-span-3" rows={15} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPostWithId[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // Wait until authentication is complete
        if (loading) return;

        // If not logged in, or not an admin, redirect
        if (!user || !user.isAdmin) {
            router.push('/');
            return;
        }
        
        // Fetch posts if the user is an admin
        fetchPosts();

    }, [user, loading, router]);
    
    const fetchPosts = async () => {
        setPageLoading(true);
        try {
            const q = query(collection(firestore, 'posts'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPostWithId));
            // Ensure date is a string
            postsData.forEach(post => {
              if (post.date && typeof (post.date as any).toDate === 'function') {
                post.date = (post.date as any).toDate().toISOString().split('T')[0];
              }
            });
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast({ title: "Error", description: "Could not fetch posts.", variant: "destructive" });
        } finally {
            setPageLoading(false);
        }
    };

    const handleSavePost = async (data: Omit<BlogPost, 'date'>, id?: string) => {
        try {
            if (id) {
                const postRef = doc(firestore, 'posts', id);
                await updateDoc(postRef, { ...data, date: serverTimestamp() });
                toast({ title: "Success", description: "Post updated successfully." });
            } else {
                await addDoc(collection(firestore, 'posts'), {
                    ...data,
                    date: serverTimestamp()
                });
                toast({ title: "Success", description: "Post created successfully." });
            }
            fetchPosts();
        } catch (error) {
            console.error("Error saving post:", error);
            toast({ title: "Error", description: "Could not save the post.", variant: "destructive" });
        }
    };

    const handleDeletePost = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteDoc(doc(firestore, 'posts', id));
                toast({ title: "Success", description: "Post deleted." });
                fetchPosts();
            } catch (error) {
                 console.error("Error deleting post:", error);
                 toast({ title: "Error", description: "Could not delete the post.", variant: "destructive" });
            }
        }
    };

    if (loading || pageLoading || !user?.isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
                        <CardDescription>Manage your blog posts here.</CardDescription>
                    </div>
                     <PostFormDialog 
                        onSave={(data) => handleSavePost(data)} 
                        triggerButton={
                             <Button><PlusCircle className="mr-2 h-4 w-4" />Create New Post</Button>
                        } 
                    />
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {posts.map(post => (
                            <li key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground">/learning-hub/{post.slug}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <PostFormDialog 
                                        post={post}
                                        onSave={(data) => handleSavePost(data, post.id)} 
                                        triggerButton={
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        } 
                                    />
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeletePost(post.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                         {posts.length === 0 && <p className="text-center text-muted-foreground py-8">No posts found. Create one to get started!</p>}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
