
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Job } from '@/lib/types';
import { Briefcase, Edit, PlusCircle, Trash2, Loader2, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc, orderBy, Timestamp, limit as firestoreLimit } from 'firebase/firestore';
import { firestore, analytics } from '@/lib/firebase';
import { logEvent } from "firebase/analytics";
import Link from 'next/link';

const APPLICATION_STATUSES: Job['status'][] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const formatDate = (date: string | { toDate: () => Date }): string => {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'Invalid Date' : format(d, 'PPP');
    }
    if (date && typeof date.toDate === 'function') {
        return format(date.toDate(), 'PPP');
    }
    return 'Invalid Date';
};


export function JobTracker({ limit }: { limit?: number }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadJobs = useCallback(async () => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    };
    
    setLoading(true);
    try {
      const jobQueryConstraints = [
        where('userId', '==', user.uid),
        orderBy('applicationDate', 'desc'),
      ];

      if (limit) {
          jobQueryConstraints.push(firestoreLimit(limit));
      }

      const q = query(collection(firestore, 'jobs'), ...jobQueryConstraints);

      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setJobs(jobsData);
    } catch (error) {
      console.error("Error loading jobs: ", error);
      toast({
        title: 'Error',
        description: 'Failed to load your tracked jobs. Please check your connection or Firestore rules.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, limit]);

  useEffect(() => {
    if (user) {
        loadJobs();
    } else {
        setLoading(false);
    }
    
    const handleJobAdded = () => {
        if(user) loadJobs();
    };

    window.addEventListener('jobAdded', handleJobAdded);
    return () => window.removeEventListener('jobAdded', handleJobAdded);

  }, [user, loadJobs]);


  const handleUpdateJob = async (updatedJob: Job) => {
    if (!user) return;
    try {
      const jobRef = doc(firestore, 'jobs', updatedJob.id);
      await updateDoc(jobRef, { ...updatedJob });
      loadJobs();
      toast({ title: 'Success', description: 'Job updated successfully.' });
    } catch (error) {
       console.error("Error updating job: ", error);
       toast({ title: 'Error', description: 'Failed to update job.', variant: 'destructive'});
    }
  };

  const handleDeleteJob = async (jobId: string) => {
     if (!user) return;
    try {
      await deleteDoc(doc(firestore, 'jobs', jobId));
      loadJobs();
      toast({ title: 'Success', description: 'Job deleted.' });
    } catch(error) {
      console.error("Error deleting job: ", error);
      toast({ title: 'Error', description: 'Failed to delete job.', variant: 'destructive'});
    }
  };

  const handleAddNewJob = async (newJobData: Omit<Job, 'id' | 'userId'>) => {
    if (!user) return;
    try {
        const docWithUser = { ...newJobData, userId: user.uid };
        await addDoc(collection(firestore, 'jobs'), docWithUser);
        loadJobs();
        toast({ title: 'Success', description: 'Job added successfully.' });
    } catch (error) {
        console.error("Error adding job: ", error);
        toast({ title: 'Error', description: 'Failed to add new job.', variant: 'destructive' });
    }
  }

  const handleJobClick = () => {
    if (analytics) {
      logEvent(analytics, "job_click", { source: "job_tracker" });
    }
  }

  return (
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <CardTitle className="text-2xl font-bold tracking-tight">My Tracked Jobs</CardTitle>
                <CardDescription>Keep track of all your job applications in one place.</CardDescription>
            </div>
             {user && <AddEditJobDialog onSave={handleAddNewJob} triggerButton={
                <Button className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Job Manually
                </Button>
            } />}
          </CardHeader>
          <CardContent>
            {loading && (
                 <div className="text-center py-12 text-muted-foreground">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <h3 className="mt-4 text-lg font-semibold">Loading your tracked jobs...</h3>
                </div>
            )}
            {!loading && !user && (
                 <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">Track Your Applications</h3>
                    <p className="mt-1 text-sm">Log in or create an account to save and manage your job applications.</p>
                     <div className="flex gap-4 justify-center pt-4">
                        <Button asChild>
                            <Link href="/login"><LogIn /> Login</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/signup"><UserPlus /> Sign Up</Link>
                        </Button>
                    </div>
                </div>
            )}
            {!loading && user && jobs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">No jobs tracked yet</h3>
                    <p className="mt-1 text-sm">Use the Resume Tool to automatically track a job, or add one manually.</p>
                </div>
            )}
            {!loading && user && jobs.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden sm:table-cell">Date Added</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} onClick={handleJobClick}>
                      <TableCell className="font-medium">{job.companyName}</TableCell>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell className="hidden sm:table-cell">{formatDate(job.applicationDate)}</TableCell>
                      <TableCell>
                        <Select value={job.status} onValueChange={(status) => handleUpdateJob({...job, status: status as Job['status']})}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {APPLICATION_STATUSES.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                         <AddEditJobDialog job={job} onSave={(data) => handleUpdateJob({ ...data, id: job.id })} triggerButton={
                            <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                         } />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             </div>
            )}
             {limit && user && jobs.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button asChild variant="link">
                  <Link href="/dashboard">View All Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
  );
}


interface AddEditJobDialogProps {
    job?: Job;
    onSave: (job: any) => void;
    triggerButton: React.ReactElement;
}

function AddEditJobDialog({ job, onSave, triggerButton }: AddEditJobDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Job, 'id' | 'userId'>>({
      companyName: '',
      jobTitle: '',
      location: '',
      status: 'Saved',
      applicationDate: new Date().toISOString(),
      notes: '',
      jobDescription: '',
  });
  const { toast } = useToast();

  const handleSave = () => {
      if (!formData.companyName || !formData.jobTitle) {
          toast({
              title: 'Missing Fields',
              description: 'Company Name and Job Title are required.',
              variant: 'destructive',
          });
          return;
      }
      onSave(formData);
      setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
        setFormData(job || {
          companyName: '',
          jobTitle: '',
          location: '',
          status: 'Saved',
          applicationDate: new Date().toISOString(),
          notes: '',
          jobDescription: '',
        });
    }
  }, [job, isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>{job ? 'Edit Job' : 'Add New Job'}</DialogTitle>
            </DialogHeader>
             <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="companyName" className="text-left sm:text-right">Company</Label>
                    <Input id="companyName" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="col-span-1 sm:col-span-3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="jobTitle" className="text-left sm:text-right">Job Title</Label>
                    <Input id="jobTitle" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="col-span-1 sm:col-span-3" />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-left sm:text-right">Location</Label>
                    <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="col-span-1 sm:col-span-3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-left sm:text-right">Status</Label>
                    <Select value={formData.status} onValueChange={(status) => setFormData({...formData, status: status as Job['status']})}>
                        <SelectTrigger className="col-span-1 sm:col-span-3">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                             {APPLICATION_STATUSES.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                    <Label htmlFor="jobDescriptionDisplay" className="text-left sm:text-right pt-2">Job Desc.</Label>
                    <Textarea id="jobDescriptionDisplay" value={formData.jobDescription} onChange={e => setFormData({...formData, jobDescription: e.target.value})} className="col-span-1 sm:col-span-3" rows={5} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                    <Label htmlFor="notes" className="text-left sm:text-right pt-2">Notes</Label>
                    <Textarea id="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="col-span-1 sm:col-span-3" rows={3}/>
                </div>
             </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
