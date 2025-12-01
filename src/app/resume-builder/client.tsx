'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateHtmlResume } from '@/ai/flows/resume-html-generation';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
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

const templateOptions = [
  {
    id: 'elegant',
    label: 'Elegant',
    imageUrl: 'https://picsum.photos/seed/elegant-resume/400/566',
    imageHint: 'elegant resume professional',
  },
];

export function ResumeBuilderClient() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 890',
      summary:
        'A brief summary of your professional background...',
      experiences: [
        {
          jobTitle: 'Software Engineer',
          company: 'Tech Corp',
          startDate: '2020-01',
          endDate: 'Present',
          jobDescription:
            '• Developed and maintained web applications using React and Node.js.\n• Collaborated with cross-functional teams to deliver high-quality software.',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          university: 'State University',
          startDate: '2016-09',
          endDate: '2020-05',
        },
      ],
      skills: '• JavaScript, React, Node.js\n• Python, SQL\n• AWS, Docker',
      template: 'elegant',
      enhancementInstructions: '',
    },
  });

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


      pdf.save(`resume-${values.template}.pdf`);

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
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">
                    Choose a Template
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {templateOptions.map((template) => (
                        <FormItem
                          key={template.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <div>
                              <RadioGroupItem
                                value={template.id}
                                id={template.id}
                                className="sr-only"
                              />
                              <Label
                                htmlFor={template.id}
                                className="cursor-pointer"
                              >
                                <Card
                                  className={cn(
                                    'overflow-hidden transition-all',
                                    field.value === template.id &&
                                      'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                  )}
                                >
                                  <CardContent className="p-0">
                                    <Image
                                      src={template.imageUrl}
                                      alt={template.label}
                                      width={400}
                                      height={566}
                                      className="aspect-[1/1.414]"
                                      data-ai-hint={template.imageHint}
                                    />
                                  </CardContent>
                                </Card>
                                <span className="block text-center mt-2 text-sm font-medium">
                                  {template.label}
                                </span>
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">
                  <User className="mr-2 h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="experience">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Code className="mr-2 h-4 w-4" />
                  Skills
                </TabsTrigger>
                 <TabsTrigger value="enhance">
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
  );
}
