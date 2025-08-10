'use client';
import type { ResumeData, Experience, Education, Skill } from '@/lib/types';
import type { EditorSection } from '../resume-editor-layout';
import { cn } from '@/lib/utils';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface TemplateProps {
  resumeData: ResumeData;
  activeSection: EditorSection;
  setActiveSection: (section: EditorSection) => void;
}

const Section = ({ id, title, onEdit, children, className }: { id: EditorSection, title: string, onEdit: (id: EditorSection) => void, children: React.ReactNode, className?: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section 
      ref={setNodeRef} 
      style={style}
      className={cn("group relative p-1", className)} 
      onClick={() => onEdit(id)}
    >
      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        <Button variant="ghost" size="icon" className="cursor-grab" {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5" />
        </Button>
      </div>
      <h2 className="text-xl font-bold text-accent mb-2 border-b-2 border-accent pb-1">{title}</h2>
      {children}
    </section>
  );
};

const SortableItem = ({ id, onEdit, children, className }: { id: string, onEdit: (id: EditorSection) => void, children: React.ReactNode, className?: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} className={cn("group relative", className)} onClick={() => onEdit(id as EditorSection)}>
       <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        <Button variant="ghost" size="icon" className="cursor-grab" {...attributes} {...listeners}>
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Pencil className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
};


export function DefaultTemplate({ resumeData, activeSection, setActiveSection }: TemplateProps) {
  const { personalDetails, summary, experience, education, skills } = resumeData;

  const experienceIds = experience.map(e => `exp-${e.id}`);
  const educationIds = education.map(e => `edu-${e.id}`);
  const skillIds = skills.map(s => `skill-${s.id}`);

  const sectionIsActive = (section: EditorSection) => activeSection === section;

  return (
    <div className="bg-white p-8 font-sans text-sm text-gray-800">
      {/* Header */}
      <header className={cn("text-center mb-8 p-4 rounded-lg border-2 border-transparent transition-all", sectionIsActive('personal-details') && 'border-primary bg-primary/5')} onClick={() => setActiveSection('personal-details')}>
         <div className="group relative">
            <h1 className="text-4xl font-bold text-gray-900">{personalDetails.fullName}</h1>
            <p className="text-lg text-accent font-medium">{personalDetails.jobTitle}</p>
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </div>
         </div>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-600 flex-wrap">
          {personalDetails.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /><span>{personalDetails.email}</span></div>}
          {personalDetails.phoneNumber && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /><span>{personalDetails.phoneNumber}</span></div>}
          {personalDetails.address && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{personalDetails.address}</span></div>}
          {personalDetails.linkedIn && <div className="flex items-center gap-1"><Linkedin className="h-3 w-3" /><span>{personalDetails.linkedIn}</span></div>}
          {personalDetails.portfolio && <div className="flex items-center gap-1"><Globe className="h-3 w-3" /><span>{personalDetails.portfolio}</span></div>}
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Summary */}
        <section className={cn("p-4 rounded-lg border-2 border-transparent transition-all", sectionIsActive('summary') && 'border-primary bg-primary/5')} onClick={() => setActiveSection('summary')}>
           <div className="group relative">
            <h2 className="text-xl font-bold text-accent mb-2 border-b-2 border-accent pb-1">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
             <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </div>
           </div>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-xl font-bold text-accent mb-2 border-b-2 border-accent pb-1">Experience</h2>
          <SortableContext items={experienceIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {experience.map(exp => (
                 <SortableItem key={exp.id} id={`exp-${exp.id}`} onEdit={setActiveSection} className={cn('p-2 rounded-lg border border-transparent transition-all', sectionIsActive(`experience-${exp.id}`) && 'border-primary bg-primary/5')}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-gray-800">{exp.jobTitle}</h3>
                      <p className="font-medium text-gray-700">{exp.company} | {exp.location}</p>
                    </div>
                    <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                    {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                  </ul>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl font-bold text-accent mb-2 border-b-2 border-accent pb-1">Education</h2>
           <SortableContext items={educationIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {education.map(edu => (
                <SortableItem key={edu.id} id={`edu-${edu.id}`} onEdit={setActiveSection} className={cn('p-2 rounded-lg border border-transparent transition-all', sectionIsActive(`education-${edu.id}`) && 'border-primary bg-primary/5')}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-gray-800">{edu.institution}</h3>
                      <p className="font-medium text-gray-700">{edu.degree}, {edu.fieldOfStudy}</p>
                    </div>
                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                </SortableItem>
              ))}
            </div>
           </SortableContext>
        </section>

        {/* Skills */}
        <section className={cn("p-4 rounded-lg border-2 border-transparent transition-all", sectionIsActive('skills') && 'border-primary bg-primary/5')} onClick={() => setActiveSection('skills')}>
          <div className="group relative">
            <h2 className="text-xl font-bold text-accent mb-2 border-b-2 border-accent pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              <SortableContext items={skillIds} strategy={verticalListSortingStrategy}>
              {skills.map(skill => (
                 <div key={skill.id} className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm">{skill.name}</div>
              ))}
              </SortableContext>
            </div>
             <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
