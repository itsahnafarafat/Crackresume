'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, ScanLine, FileText } from 'lucide-react';
import { AiContentAssistModal } from '../modals/ai-content-assist-modal';
import { KeywordOptimizerModal } from '../modals/keyword-optimizer-modal';
import { AtsCheckModal } from '../modals/ats-check-modal';
import type { ResumeData } from '@/lib/types';

interface ActionPanelProps {
  resumeData: ResumeData;
}

export function ActionPanel({ resumeData }: ActionPanelProps) {
  const [isContentAssistOpen, setContentAssistOpen] = useState(false);
  const [isKeywordOptimizerOpen, setKeywordOptimizerOpen] = useState(false);
  const [isAtsCheckOpen, setAtsCheckOpen] = useState(false);

  return (
    <>
      <div className="p-4 sm:p-6 bg-background border-r flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start gap-3" onClick={() => setContentAssistOpen(true)}>
              <Bot className="h-5 w-5 text-primary" />
              <span>AI Content Assist</span>
            </Button>
            <Button variant="outline" className="justify-start gap-3" onClick={() => setKeywordOptimizerOpen(true)}>
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Keyword Optimizer</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => setAtsCheckOpen(true)}>
              <ScanLine className="h-5 w-5 text-primary" />
              <span>ATS Compatibility Check</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Template</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
             <div className="flex items-center justify-between rounded-md border border-primary bg-primary/10 p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Default Professional</span>
                </div>
                <span className="text-sm font-semibold text-primary">Active</span>
             </div>
             <p className="text-xs text-muted-foreground">More templates coming soon!</p>
          </CardContent>
        </Card>

        <div className="mt-auto">
           <Button className="w-full" onClick={() => window.print()}>
              Download PDF
           </Button>
        </div>
      </div>

      <AiContentAssistModal isOpen={isContentAssistOpen} onOpenChange={setContentAssistOpen} />
      <KeywordOptimizerModal isOpen={isKeywordOptimizerOpen} onOpenChange={setKeywordOptimizerOpen} resumeData={resumeData} />
      <AtsCheckModal isOpen={isAtsCheckOpen} onOpenChange={setAtsCheckOpen} resumeData={resumeData} />
    </>
  );
}
