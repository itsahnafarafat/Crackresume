
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

interface UserProfileData {
  name: string;
  email: string;
  about: string;
  profilePicture: string | null;
}

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    email: '',
    about: '',
    profilePicture: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setProfile(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
        about: userData.about || '',
        profilePicture: userData.profilePicture || null
      }));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(profile));
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
                            <AvatarImage src={profile.profilePicture || undefined} alt={profile.name} />
                            <AvatarFallback>
                                <User className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            {isEditing ? (
                                <>
                                <Label htmlFor='name'>Name</Label>
                                <Input 
                                    id='name'
                                    className="text-2xl font-bold" 
                                    value={profile.name} 
                                    onChange={(e) => setProfile(p => ({...p, name: e.target.value}))} 
                                />
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
                                <h2 className="text-2xl font-bold">{profile.name}</h2>
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
