'use client';
import type { Dispatch, SetStateAction } from 'react';
import type { ResumeData } from '@/lib/types';
import type { EditorSection } from '../resume-editor-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { produce } from 'immer';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditorPanelProps {
  activeSection: EditorSection;
  resumeData: ResumeData;
  setResumeData: Dispatch<SetStateAction<ResumeData>>;
  setActiveSection: (section: EditorSection) => void;
}

export function EditorPanel({ activeSection, resumeData, setResumeData, setActiveSection }: EditorPanelProps) {
  if (!activeSection) {
    return (
      <div className="p-4 sm:p-6 border-l bg-background hidden xl:flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Resume Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Select a section from the resume preview to start editing.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderEditor = () => {
    if (activeSection === 'personal-details') {
      return <PersonalDetailsEditor data={resumeData.personalDetails} setData={setResumeData} />;
    }
    if (activeSection === 'summary') {
      return <SummaryEditor data={resumeData.summary} setData={setResumeData} />;
    }
    if (activeSection.startsWith('experience-')) {
      const id = activeSection.split('experience-')[1];
      const experienceItem = resumeData.experience.find(e => e.id === id);
      if (experienceItem) {
        return <ExperienceEditor data={experienceItem} setData={setResumeData} setActiveSection={setActiveSection} />;
      }
    }
    if (activeSection.startsWith('education-')) {
      const id = activeSection.split('education-')[1];
      const educationItem = resumeData.education.find(e => e.id === id);
      if (educationItem) {
        return <EducationEditor data={educationItem} setData={setResumeData} setActiveSection={setActiveSection} />;
      }
    }
    if (activeSection === 'skills') {
      return <SkillsEditor data={resumeData.skills} setData={setResumeData} />;
    }
    return null;
  };

  return <div className="p-4 sm:p-6 border-l bg-background hidden xl:block overflow-y-auto">{renderEditor()}</div>;
}


function PersonalDetailsEditor({ data, setData }: { data: ResumeData['personalDetails'], setData: Dispatch<SetStateAction<ResumeData>> }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => produce(prev, draft => {
            draft.personalDetails[name as keyof typeof data] = value;
        }));
    };
    
    return (
        <Card>
            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={data.fullName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" name="jobTitle" value={data.jobTitle} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={data.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={data.phoneNumber} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={data.address} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn</Label>
                    <Input id="linkedIn" name="linkedIn" value={data.linkedIn || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/GitHub</Label>
                    <Input id="portfolio" name="portfolio" value={data.portfolio || ''} onChange={handleChange} />
                </div>
            </CardContent>
        </Card>
    );
}


function SummaryEditor({ data, setData }: { data: string, setData: Dispatch<SetStateAction<ResumeData>> }) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData(prev => produce(prev, draft => {
            draft.summary = e.target.value;
        }));
    };
    return (
        <Card>
            <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
            <CardContent>
                <Textarea value={data} onChange={handleChange} rows={8} />
            </CardContent>
        </Card>
    );
}

function ExperienceEditor({ data, setData, setActiveSection }: { data: ResumeData['experience'][0], setData: Dispatch<SetStateAction<ResumeData>>, setActiveSection: (section: EditorSection) => void }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => produce(prev, draft => {
            const exp = draft.experience.find(item => item.id === data.id);
            if (exp) {
              (exp as any)[name] = value;
            }
        }));
    };
    
    const handleDescriptionChange = (index: number, value: string) => {
        setData(prev => produce(prev, draft => {
            const exp = draft.experience.find(item => item.id === data.id);
            if (exp) exp.description[index] = value;
        }));
    };
    
    const addDescriptionPoint = () => {
         setData(prev => produce(prev, draft => {
            const exp = draft.experience.find(item => item.id === data.id);
            if (exp) exp.description.push('');
        }));
    };

    const removeDescriptionPoint = (index: number) => {
        setData(prev => produce(prev, draft => {
            const exp = draft.experience.find(item => item.id === data.id);
            if (exp) exp.description.splice(index, 1);
        }));
    };

    const removeExperience = () => {
        setData(prev => produce(prev, draft => {
            draft.experience = draft.experience.filter(item => item.id !== data.id);
        }));
        setActiveSection(null);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Edit Experience</CardTitle>
                <Button variant="ghost" size="icon" onClick={removeExperience}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Job Title</Label><Input name="jobTitle" value={data.jobTitle} onChange={handleChange} /></div>
                <div className="space-y-2"><Label>Company</Label><Input name="company" value={data.company} onChange={handleChange} /></div>
                <div className="space-y-2"><Label>Location</Label><Input name="location" value={data.location} onChange={handleChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Start Date</Label><Input name="startDate" value={data.startDate} onChange={handleChange} /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input name="endDate" value={data.endDate} onChange={handleChange} /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label>
                    {data.description.map((point, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Textarea value={point} onChange={e => handleDescriptionChange(index, e.target.value)} rows={2}/>
                            <Button variant="ghost" size="icon" onClick={() => removeDescriptionPoint(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addDescriptionPoint}><Plus className="mr-2 h-4 w-4" /> Add point</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function EducationEditor({ data, setData, setActiveSection }: { data: ResumeData['education'][0], setData: Dispatch<SetStateAction<ResumeData>>, setActiveSection: (section: EditorSection) => void }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => produce(prev, draft => {
            const edu = draft.education.find(item => item.id === data.id);
            if (edu) {
              (edu as any)[name] = value;
            }
        }));
    };

     const removeEducation = () => {
        setData(prev => produce(prev, draft => {
            draft.education = draft.education.filter(item => item.id !== data.id);
        }));
        setActiveSection(null);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Edit Education</CardTitle>
                <Button variant="ghost" size="icon" onClick={removeEducation}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Institution</Label><Input name="institution" value={data.institution} onChange={handleChange} /></div>
                <div className="space-y-2"><Label>Degree</Label><Input name="degree" value={data.degree} onChange={handleChange} /></div>
                <div className="space-y-2"><Label>Field of Study</Label><Input name="fieldOfStudy" value={data.fieldOfStudy} onChange={handleChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Start Date</Label><Input name="startDate" value={data.startDate} onChange={handleChange} /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input name="endDate" value={data.endDate} onChange={handleChange} /></div>
                </div>
            </CardContent>
        </Card>
    );
}


function SkillsEditor({ data, setData }: { data: ResumeData['skills'], setData: Dispatch<SetStateAction<ResumeData>> }) {
    
    const handleSkillChange = (id: string, value: string) => {
        setData(prev => produce(prev, draft => {
            const skill = draft.skills.find(s => s.id === id);
            if (skill) skill.name = value;
        }));
    };
    
    const addSkill = () => {
        setData(prev => produce(prev, draft => {
            draft.skills.push({ id: `skill${Date.now()}`, name: 'New Skill' });
        }));
    };

    const removeSkill = (id: string) => {
        setData(prev => produce(prev, draft => {
            draft.skills = draft.skills.filter(s => s.id !== id);
        }));
    };

    return (
        <Card>
            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {data.map(skill => (
                  <div key={skill.id} className="flex items-center gap-2">
                      <Input value={skill.name} onChange={e => handleSkillChange(skill.id, e.target.value)} />
                      <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                 <Button variant="outline" size="sm" onClick={addSkill}><Plus className="mr-2 h-4 w-4" /> Add skill</Button>
            </CardContent>
        </Card>
    );
}
