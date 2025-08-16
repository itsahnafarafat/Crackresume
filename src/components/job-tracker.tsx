
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
import { Briefcase, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const APPLICATION_STATUSES: Job['status'][] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

export function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();

  const loadJobs = useCallback(async () => {
    if (!user) return;
    try {
        const q = query(collection(db, 'jobs'), where('userId', '==', user.uid), orderBy('applicationDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                applicationDate: (data.applicationDate as Timestamp).toDate().toISOString(),
            } as Job;
        });
        setJobs(jobsData);
    } catch (error) {
        console.error("Failed to fetch jobs from Firestore", error);
        setJobs([]);
    }
  }, [user]);

  useEffect(() => {
    setIsMounted(true);
    if(user){
        loadJobs();
    }
  }, [user, loadJobs]);
  
  const handleUpdateJob = async (updatedJob: Job) => {
    if (!user) return;
    const { id, ...jobData } = updatedJob;
    try {
      await updateDoc(doc(db, 'jobs', id), {
          ...jobData,
          applicationDate: new Date(jobData.applicationDate),
      });
      loadJobs();
    } catch(error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      loadJobs();
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
  };

  const handleAddNewJob = async (newJob: Omit<Job, 'id'>) => {
      if (!user) return;
      try {
        await addDoc(collection(db, 'jobs'), {
            ...newJob,
            userId: user.uid,
            applicationDate: new Date(newJob.applicationDate),
        });
        loadJobs();
      } catch (error) {
          console.error("Error adding document: ", error);
      }
  }

  if (!isMounted) {
    return (
        <div className="container px-4 md:px-6 py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Loading Job Tracker...</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="text-center py-12 text-muted-foreground">
                        <Briefcase className="mx-auto h-12 w-12 animate-pulse" />
                        <h3 className="mt-4 text-lg font-semibold">Loading your tracked jobs...</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="w-full pb-12 md:pb-16 lg:pb-20">
      <div className="container px-4 md:px-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <CardTitle className="text-2xl font-bold tracking-tight">My Tracked Jobs</CardTitle>
                <CardDescription>Keep track of all your job applications in one place.</CardDescription>
            </div>
             <AddEditJobDialog onSave={handleAddNewJob} triggerButton={
                <Button className="w-full md:w-auto" disabled={!user}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Job Manually
                </Button>
            } />
          </CardHeader>
          <CardContent>
             {!user ? (
                 <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">Please log in</h3>
                    <p className="mt-1 text-sm">Log in or sign up to start tracking your job applications.</p>
                </div>
             ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">No jobs tracked yet</h3>
                    <p className="mt-1 text-sm">Paste a job description above to automatically track a job, or add one manually.</p>
                </div>
            ) : (
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
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.companyName}</TableCell>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell className="hidden sm:table-cell">{format(new Date(job.applicationDate), 'PPP')}</TableCell>
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
                         <AddEditJobDialog job={job} onSave={handleUpdateJob} triggerButton={
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


interface AddEditJobDialogProps {
    job?: Job;
    onSave: (job: any) => void;
    triggerButton: React.ReactElement;
}

function AddEditJobDialog({ job, onSave, triggerButton }: AddEditJobDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>(job || {
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
  
  // Update form data when job prop changes, and reset for new job entry
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
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
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
