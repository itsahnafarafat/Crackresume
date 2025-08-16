
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Edit, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  about: string;
  profilePicture: string | null;
}

export function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    about: '',
    profilePicture: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfileData;
            setProfile({
                ...userData,
                email: user.email || '',
            });
        } else {
            setProfile(prev => ({ ...prev, email: user.email || '' }));
        }
    }
    loadUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const { email, ...profileData } = profile;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, profileData, { merge: true });

    setIsEditing(false);
    toast({
      title: "Profile Saved",
      description: "Your profile has been updated successfully.",
    });
  };

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
            <Card className="max-w-3xl mx-auto">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
                        <CardDescription>View and edit your personal information.</CardDescription>
                    </div>
                    {isEditing ? (
                        <Button onClick={handleSave} size="sm">
                            <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                         <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.profilePicture || undefined} alt={profile.firstName} />
                            <AvatarFallback>
                                <User className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            {isEditing ? (
                                <>
                                <div className="flex gap-2">
                                    <div>
                                        <Label htmlFor='firstName'>First Name</Label>
                                        <Input 
                                            id='firstName'
                                            value={profile.firstName} 
                                            onChange={(e) => setProfile(p => ({...p, firstName: e.target.value}))} 
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='lastName'>Last Name</Label>
                                        <Input 
                                            id='lastName'
                                            value={profile.lastName} 
                                            onChange={(e) => setProfile(p => ({...p, lastName: e.target.value}))} 
                                        />
                                    </div>
                                </div>

                                <Button variant="link" className="p-0 h-auto" onClick={() => fileInputRef.current?.click()}>
                                    Upload Picture
                                </Button>
                                <Input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handlePictureUpload} 
                                />
                                </>
                            ) : (
                                <>
                                <h2 className="text-2xl font-bold">{`${profile.firstName} ${profile.lastName}`}</h2>
                                <p className="text-muted-foreground">{profile.email}</p>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="about">About</Label>
                        {isEditing ? (
                            <Textarea 
                                id="about"
                                value={profile.about} 
                                onChange={(e) => setProfile(p => ({...p, about: e.target.value}))} 
                                rows={5}
                                placeholder="Tell us a little about yourself..."
                            />
                        ) : (
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {profile.about || 'No information provided.'}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </section>
  );
}
