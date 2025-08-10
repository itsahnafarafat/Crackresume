import type { ResumeData } from '@/lib/types';
import type { EditorSection } from '../resume-editor-layout';
import { DefaultTemplate } from '../templates/default-template';

interface PreviewPanelProps {
  resumeData: ResumeData;
  activeSection: EditorSection;
  setActiveSection: (section: EditorSection) => void;
}

export function PreviewPanel({ resumeData, activeSection, setActiveSection }: PreviewPanelProps) {
  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-[8.5in] shadow-2xl">
         <DefaultTemplate 
            resumeData={resumeData} 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
        />
      </div>
    </div>
  );
}
