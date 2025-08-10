'use client';

import React, { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { placeholderData } from '@/lib/placeholder-data';
import { ActionPanel } from '@/components/panels/action-panel';
import { PreviewPanel } from '@/components/panels/preview-panel';
import { EditorPanel } from '@/components/panels/editor-panel';
import { Header } from '@/components/shared/header';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { produce } from 'immer';

export type EditorSection =
  | 'personal-details'
  | 'summary'
  | `experience-${string}`
  | `education-${string}`
  | 'skills'
  | null;


export function ResumeEditorLayout() {
  const [resumeData, setResumeData] = useState<ResumeData>(placeholderData);
  const [activeSection, setActiveSection] = useState<EditorSection>('personal-details');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const overId = over?.id.toString();
      const activeId = active.id.toString();
      
      if (overId?.startsWith('exp') && activeId?.startsWith('exp')) {
        setResumeData(produce(draft => {
          const oldIndex = draft.experience.findIndex(item => `exp-${item.id}` === activeId);
          const newIndex = draft.experience.findIndex(item => `exp-${item.id}` === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            draft.experience = arrayMove(draft.experience, oldIndex, newIndex);
          }
        }));
      } else if (overId?.startsWith('edu') && activeId?.startsWith('edu')) {
        setResumeData(produce(draft => {
          const oldIndex = draft.education.findIndex(item => `edu-${item.id}` === activeId);
          const newIndex = draft.education.findIndex(item => `edu-${item.id}` === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            draft.education = arrayMove(draft.education, oldIndex, newIndex);
          }
        }));
      } else if (overId?.startsWith('skill') && activeId?.startsWith('skill')) {
         setResumeData(produce(draft => {
          const oldIndex = draft.skills.findIndex(item => `skill-${item.id}` === activeId);
          const newIndex = draft.skills.findIndex(item => `skill-${item.id}` === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            draft.skills = arrayMove(draft.skills, oldIndex, newIndex);
          }
        }));
      }
    }
  };


  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[350px_1fr] xl:grid-cols-[350px_1fr_450px]">
          <ActionPanel resumeData={resumeData} />
          
          <div className="order-last lg:order-none bg-secondary/50 p-4 sm:p-6 md:p-8 overflow-y-auto">
            <PreviewPanel resumeData={resumeData} setActiveSection={setActiveSection} activeSection={activeSection} />
          </div>

          <EditorPanel 
            activeSection={activeSection} 
            resumeData={resumeData}
            setResumeData={setResumeData} 
            setActiveSection={setActiveSection}
          />
        </div>
      </div>
    </DndContext>
  );
}
