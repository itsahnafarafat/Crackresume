
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";


export function ResumeManager() {
    const { user, updateUserResume } = useAuth();
    const [resume, setResume] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (user?.resumeContent) {
            setResume(user.resumeContent);
        }
    }, [user]);

    const handleSave = () => {
        startTransition(async () => {
            await updateUserResume(resume);
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Base Resume</CardTitle>
                <CardDescription>Save your resume here. It will be automatically used by the resume tool.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Paste your base resume here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    rows={20}
                    className="text-sm"
                />
                <Button onClick={handleSave} disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="animate-spin" /> : <Save />}
                    Save Resume
                </Button>
            </CardContent>
        </Card>
    )
}
