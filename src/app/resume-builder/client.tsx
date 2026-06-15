'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateHtmlResume } from '@/ai/flows/resume-html-generation';
import { generateHtmlResumeString } from '@/lib/resume-templates';
import { enhanceResume } from '@/ai/flows/resume-enhancement';
import {
  GenerateResumeInputSchema,
  type GenerateResumeInput,
} from '@/ai/schemas/resume-generation';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  PlusCircle,
  Trash2,
  Loader2,
  FileDown,
  Wand2,
  LayoutTemplate,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formSchema = GenerateResumeInputSchema.extend({
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

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: 'Tommy',
      email: 'tommy@example.com',
      phone: '+1 234 567 890',
      summary:
        'A driven professional with a proven track record of creating dynamic applications and solving complex problems.',
      experiences: [
        {
          jobTitle: 'Senior Software Engineer',
          company: 'Stark Industries',
          startDate: '2020-01',
          endDate: 'Present',
          jobDescription:
            '• Developed and maintained scalable web applications.\n• Led a team of 5 engineers to deliver critical systems.',
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
      enhancementInstructions: '',
      templateId: 'template-1',
      photoDataUri: '',
    },
  });

  const watchedValues = form.watch();
  const htmlPreview = useMemo(() => {
    return generateHtmlResumeString(watchedValues as any);
  }, [watchedValues]);

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: 'experiences',
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  const onDownloadPDF = async (values: GenerateResumeInput) => {
    setIsDownloading(true);
    try {
      const { htmlContent } = await generateHtmlResume(values);

      const renderContainer = document.createElement('div');
      renderContainer.style.position = 'absolute';
      renderContainer.style.left = '-9999px';
      document.body.appendChild(renderContainer);
      renderContainer.innerHTML = htmlContent;

      const resumeElement = renderContainer.querySelector('#resume-container') as HTMLElement | null;
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

      document.body.removeChild(renderContainer);

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
    
    setIsEnhancing(true);
    try {
      const result = await enhanceResume({
        ...values,
        enhancementInstructions: values.enhancementInstructions,
      });

      form.setValue('summary', result.summary);
      form.setValue('experiences', result.experiences);
      
      toast({
        title: 'Resume Enhanced',
        description: 'Your summary and experiences have been rewritten by AI.',
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
              Fill in your details, choose a template, and generate a professional
              PDF resume. Use the AI enhancer to tailor your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onDownloadPDF)}
                className="space-y-8"
              >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full flex-wrap h-auto gap-2 justify-start md:grid md:grid-cols-7">
                <TabsTrigger value="templates" className="flex-1 md:flex-auto">
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex-1 md:flex-auto">
                  <User className="mr-2 h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex-1 md:flex-auto">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="flex-1 md:flex-auto">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex-1 md:flex-auto">
                  <Code className="mr-2 h-4 w-4" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex-1 md:flex-auto">
                  <Code className="mr-2 h-4 w-4" />
                  Skills
                </TabsTrigger>
                 <TabsTrigger value="enhance" className="flex-1 md:flex-auto">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Enhance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 234 567 890"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="photoDataUri"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Profile Photo (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                              {value && (
                                  <img src={value} alt="Profile" className="w-16 h-16 rounded-full object-cover border shadow-sm" />
                              )}
                              <Input 
                                  type="file" 
                                  accept="image/*" 
                                  className="flex-1 cursor-pointer"
                                  onChange={async (e) => {
                                      if (e.target.files && e.target.files[0]) {
                                          const uri = await fileToDataUri(e.target.files[0]);
                                          onChange(uri);
                                      }
                                  }}
                                  {...rest}
                                  value={undefined}
                              />
                              {value && (
                                  <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>Remove</Button>
                              )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="A brief summary of your professional background..."
                            {...field}
                          />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="experience" className="mt-6">
                <div className="space-y-6">
                  {experienceFields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.jobTitle`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Software Engineer"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.company`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Tech Corp" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input type="month" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="Present" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`experiences.${index}.jobDescription`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Description (use bullet points)
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={5}
                                  placeholder="• Describe your responsibilities and achievements..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendExperience({
                        jobTitle: '',
                        company: '',
                        startDate: '',
                        endDate: '',
                        jobDescription: '',
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-6">
                <div className="space-y-6">
                  {educationFields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="B.S. in Computer Science"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.university`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="State University"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`education.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input type="month" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`education.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input type="month" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendEducation({
                        degree: '',
                        university: '',
                        startDate: '',
                        endDate: '',
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <div className="space-y-6">
                  {projectFields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`projects.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Awesome Project"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`projects.${index}.timeline`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Timeline</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jan 2021 - Present" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`projects.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={5}
                                  placeholder="• Describe what you built..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        onClick={() => removeProject(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendProject({
                        name: '',
                        timeline: '',
                        description: '',
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills (use bullet points)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            placeholder="• JavaScript, React, Node.js..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

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
                              setActiveTab('personal');
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                          >
                            {AVAILABLE_TEMPLATES.map((template) => (
                              <FormItem key={template.id} className="relative cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value={template.id} className="peer sr-only" />
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
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">Auto-updating</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0 relative bg-neutral-100">
            {htmlPreview ? (
              <iframe
                srcDoc={htmlPreview}
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
