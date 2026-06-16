'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateHtmlResumeString, templateStyles } from '@/lib/resume-templates';
import { enhanceResume } from '@/ai/flows/resume-enhancement';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  FileDown,
  Wand2,
  LayoutTemplate,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formSchema = z.object({
  templateId: z.string().optional(),
  enhancementInstructions: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const AVAILABLE_TEMPLATES = [
  { id: 'template-1', src: '/templates/template-1.jpg', name: 'Template 1' },
  { id: 'template-2', src: '/templates/template-2.png', name: 'Template 2' },
  { id: 'template-3', src: '/templates/template-3.jpg', name: 'Template 3' },
  { id: 'template-4', src: '/templates/template-4.png', name: 'Template 4' },
  { id: 'template-5', src: '/templates/template-5.jpg', name: 'Template 5' },
  { id: 'template-6', src: '/templates/template-6.svg', name: 'Template 6' },
  { id: 'template-7', src: '/templates/template-7.png', name: 'Template 7' },
  { id: 'template-8', src: '/templates/template-8.png', name: 'Template 8' },
  { id: 'template-9', src: '/templates/template-9.png', name: 'Template 9' },
  { id: 'template-10', src: '/templates/template-10.jpg', name: 'Template 10' },
  { id: 'template-11', src: '/templates/template-11.webp', name: 'Template 11' },
  { id: 'template-12', src: '/templates/template-12.jpg', name: 'Template 12' },
  { id: 'template-13', src: '/templates/template-13.png', name: 'Template 13' },
  { id: 'template-14', src: '/templates/template-14.webp', name: 'Template 14' },
  { id: 'template-15', src: '/templates/template-15.jpg', name: 'Template 15' },
  { id: 'template-16', src: '/templates/template-16.png', name: 'Template 16' },
  { id: 'template-17', src: '/templates/template-17.png', name: 'Template 17' },
  { id: 'template-18', src: '/templates/template-18.png', name: 'Template 18' },
  { id: 'template-19', src: '/templates/template-19.jpg', name: 'Template 19' },
  { id: 'template-20', src: '/templates/template-20.png', name: 'Template 20' },
];

export function ResumeBuilderClient() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enhancementInstructions: '',
      templateId: 'template-1',
    },
  });

  const watchedTemplateId = form.watch('templateId');

  // Generate the initial placeholder HTML ONCE. We don't want to re-render it because it would wipe out user edits.
  const initialHtmlPreview = useMemo(() => {
    return generateHtmlResumeString({
      fullName: 'Tommy',
      email: 'tommy@example.com',
      phone: '+1 234 567 890',
      summary: 'A driven professional with a proven track record of creating dynamic applications and solving complex problems.',
      experiences: [
        {
          jobTitle: 'Senior Software Engineer',
          company: 'Stark Industries',
          startDate: '2020-01',
          endDate: 'Present',
          jobDescription: '• Developed and maintained scalable web applications.\n• Led a team of 5 engineers to deliver critical systems.',
        },
      ],
      education: [
        {
          degree: 'Master of Engineering',
          university: 'MIT',
          startDate: '2016-09',
          endDate: '2020-05',
        },
      ],
      projects: [],
      skills: '• JavaScript, React, Node.js\n• Python, SQL\n• AWS, Docker',
      templateId: 'template-1', // Default
    });
  }, []);

  // Sync template CSS variables into the iframe document when template changes
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
    const doc = iframeRef.current.contentDocument;
    
    const style = templateStyles[watchedTemplateId || 'template-1'] || templateStyles['template-1'];
    
    doc.documentElement.style.setProperty('--primary-color', style.primaryColor);
    doc.documentElement.style.setProperty('--header-border', style.headerBorder);
    doc.documentElement.style.setProperty('--font-family', style.font);
  }, [watchedTemplateId]);

  const onDownloadPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      if (!iframeRef.current || !iframeRef.current.contentDocument) {
        throw new Error('Iframe not ready.');
      }

      const resumeElement = iframeRef.current.contentDocument.querySelector('#resume-container') as HTMLElement | null;
      if (!resumeElement) {
        throw new Error('Could not find resume content to render.');
      }

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let imgWidth = pdfWidth;
      let imgHeight = pdfWidth / canvasAspectRatio;

      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = imgHeight * canvasAspectRatio;
      }
      
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      
      let heightLeft = imgHeight - pdfHeight;
      while (heightLeft > 0) {
        position = -pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('resume.pdf');

      toast({
        title: 'Download Started',
        description: 'Your PDF resume is downloading.',
      });
    } catch (error) {
      console.error('Error generating PDF resume:', error);
      toast({
        title: 'Generation Failed',
        description:
          'There was an error generating your PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const onEnhance = async () => {
    const values = form.getValues();
    if (!values.enhancementInstructions) {
      form.setError('enhancementInstructions', {
        type: 'manual',
        message: 'Please provide instructions or a job description to enhance your resume.'
      });
      return;
    }
    
    if (!iframeRef.current || !iframeRef.current.contentDocument) {
        return;
    }

    const currentHtml = iframeRef.current.contentDocument.body.innerHTML;

    setIsEnhancing(true);
    try {
      const result = await enhanceResume({
        enhancementInstructions: values.enhancementInstructions,
        htmlContent: currentHtml,
      });

      iframeRef.current.contentDocument.body.innerHTML = result.enhancedHtmlContent;
      
      // Re-apply styles just in case
      const style = templateStyles[watchedTemplateId || 'template-1'] || templateStyles['template-1'];
      iframeRef.current.contentDocument.documentElement.style.setProperty('--primary-color', style.primaryColor);
      iframeRef.current.contentDocument.documentElement.style.setProperty('--header-border', style.headerBorder);
      iframeRef.current.contentDocument.documentElement.style.setProperty('--font-family', style.font);

      toast({
        title: 'Resume Enhanced',
        description: 'Your resume has been rewritten by AI.',
      });
    } catch (error) {
       console.error('Error enhancing resume:', error);
      toast({
        title: 'Enhancement Failed',
        description:
          'There was an error enhancing your resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEnhancing(false);
    }
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle>AI Resume Builder</CardTitle>
            <CardDescription>
              Choose a template, edit directly in the live preview, and generate a professional
              PDF resume. Use the AI enhancer to tailor your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={onDownloadPDF}
                className="space-y-8"
              >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full flex-wrap h-auto gap-2 justify-start md:grid md:grid-cols-2">
                <TabsTrigger value="templates" className="flex-1 md:flex-auto">
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Templates
                </TabsTrigger>
                 <TabsTrigger value="enhance" className="flex-1 md:flex-auto">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Enhance
                </TabsTrigger>
              </TabsList>

               <TabsContent value="enhance" className="mt-6">
                <div className="space-y-4">
                   <FormField
                    control={form.control}
                    name="enhancementInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enhancement Instructions</FormLabel>
                        <FormControl>
                           <Textarea
                            rows={8}
                            placeholder="Paste a job description or provide instructions to tailor your resume (e.g., 'Emphasize my project management skills')."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="button" onClick={onEnhance} disabled={isEnhancing}>
                      {isEnhancing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Enhance with AI
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="mt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Resume Template</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => {
                              field.onChange(val);
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                          >
                            {AVAILABLE_TEMPLATES.map((template) => (
                              <FormItem key={template.id} className="relative cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem id={template.id} value={template.id} className="peer sr-only" />
                                </FormControl>
                                <Label
                                  htmlFor={template.id}
                                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
                                >
                                  <div className="relative w-full aspect-[1/1.4] mb-3 rounded-lg overflow-hidden bg-muted border shadow-sm">
                                    <Image
                                      src={template.src}
                                      alt={template.name}
                                      fill
                                      className="object-contain"
                                      quality={100}
                                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                      priority={false}
                                    />
                                  </div>
                                  <span className="font-semibold text-sm mb-1">{template.name}</span>
                                </Label>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="submit" disabled={isDownloading || isEnhancing}>
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                Download PDF
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
      </div>

      <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)]">
        <Card className="h-full flex flex-col overflow-hidden bg-muted/10 border-2 border-primary/10 shadow-lg">
          <CardHeader className="py-4 border-b bg-card">
            <CardTitle className="text-lg flex items-center justify-between">
              Live Preview
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">Editable text</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0 relative bg-neutral-100">
            {initialHtmlPreview ? (
              <iframe
                ref={iframeRef}
                srcDoc={initialHtmlPreview}
                className="absolute inset-0 w-full h-full border-0"
                title="Resume Preview"
                style={{ backgroundColor: '#f5f5f5' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
