
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, serverTimestamp } from 'firebase/firestore';

import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  analyzeSocialProfiles,
  type SocialProfileAnalysisOutput,
} from '@/ai/flows/social-profile-analysis';

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
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Save,
  User as UserIcon,
  Link as LinkIcon,
  Info,
  Github,
  Code2,
  Wand2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  gender: z.string().optional(),
  personalWebsite: z.string().url().or(z.literal('')).optional(),
  profileSummary: z.string().optional(),
  links: z.object({
    linkedIn: z.string().url().or(z.literal('')).optional(),
    github: z.string().url().or(z.literal('')).optional(),
    stackOverflow: z.string().url().or(z.literal('')).optional(),
    leetCode: z.string().url().or(z.literal('')).optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileClient() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SocialProfileAnalysisOutput | null>(null);

  const userDocRef = useMemo(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  const { data: profileData, isLoading: isProfileLoading } = useDoc<ProfileFormValues>(userDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      nationality: '',
      gender: '',
      personalWebsite: '',
      profileSummary: '',
      links: {
        linkedIn: '',
        github: '',
        stackOverflow: '',
        leetCode: '',
      }
    },
  });
  
  const { formState: { isSubmitting, isDirty } } = form;

  useEffect(() => {
    if (profileData) {
      form.reset(profileData);
    }
  }, [profileData, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!userDocRef) {
      toast({
        title: 'Error',
        description: 'User not authenticated.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const dataToUpdate = {
        ...values,
        updatedAt: serverTimestamp(),
      };
      
      setDocumentNonBlocking(userDocRef, dataToUpdate, { merge: true });

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved.',
      });
      form.reset(values, { keepDirty: false });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description:
          'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const handleAnalyze = async () => {
    const links = form.getValues('links');
    if (!links?.github && !links?.leetCode) {
      toast({
        title: 'No Profiles to Analyze',
        description: 'Please add your GitHub or LeetCode profile links first.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeSocialProfiles({
        githubUrl: links.github,
        leetCodeUrl: links.leetCode,
      });
      setAnalysisResult(result);
    } catch (error) {
       console.error('Error analyzing profiles:', error);
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing your profiles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          Manage your personal and professional information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">
                  <Info className="mr-2 h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="contact">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Contact
                </TabsTrigger>
                <TabsTrigger value="links">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Links
                </TabsTrigger>
                 <TabsTrigger value="summary">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Summary
                </TabsTrigger>
                 <TabsTrigger value="analysis">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-6">
                <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Male, Female, Non-binary" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </div>
                     <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., American" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                </div>
              </TabsContent>
              <TabsContent value="contact" className="mt-6">
                 <div className="space-y-4">
                     <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 234 567 890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
              </TabsContent>
               <TabsContent value="links" className="mt-6">
                 <div className="space-y-4">
                     <FormField
                      control={form.control}
                      name="personalWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-portfolio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="links.linkedIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="links.github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/your-username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="links.stackOverflow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stack Overflow</FormLabel>
                          <FormControl>
                            <Input placeholder="https://stackoverflow.com/users/your-id" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="links.leetCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LeetCode</FormLabel>
                          <FormControl>
                            <Input placeholder="https://leetcode.com/your-username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
              </TabsContent>
               <TabsContent value="summary" className="mt-6">
                 <div className="space-y-4">
                   <FormField
                      control={form.control}
                      name="profileSummary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Summary</FormLabel>
                          <FormControl>
                            <Textarea rows={8} placeholder="A brief summary of your professional background, skills, and career goals." {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
              </TabsContent>
               <TabsContent value="analysis" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Profile Analysis</CardTitle>
                      <CardDescription>
                        Get an AI-powered analysis of your linked GitHub and LeetCode profiles.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isAnalyzing ? (
                        <div className="flex items-center justify-center min-h-[150px]">
                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : analysisResult ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {analysisResult.github && (
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">GitHub Analysis</CardTitle>
                                <Github className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{analysisResult.github.repositories}</div>
                                <p className="text-xs text-muted-foreground">Public Repositories</p>
                                <div className="text-2xl font-bold mt-4">{analysisResult.github.contributionsLastYear}</div>
                                <p className="text-xs text-muted-foreground">Contributions (Last Year)</p>
                                <div className="text-2xl font-bold mt-4">{analysisResult.github.activityLevel}</div>
                                <p className="text-xs text-muted-foreground">Activity Level</p>
                              </CardContent>
                            </Card>
                          )}
                          {analysisResult.leetCode && (
                             <Card>
                               <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">LeetCode Analysis</CardTitle>
                                <Code2 className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                               <CardContent>
                                <div className="text-2xl font-bold">{analysisResult.leetCode.totalSolved}</div>
                                <p className="text-xs text-muted-foreground mb-4">Total Problems Solved</p>
                                <div className="space-y-2">
                                   <div>
                                    <div className="flex justify-between text-sm font-medium">
                                      <span>Easy</span>
                                      <span>{analysisResult.leetCode.easySolved}</span>
                                    </div>
                                    <Progress value={(analysisResult.leetCode.easySolved / analysisResult.leetCode.totalSolved) * 100} className="h-2 bg-green-500/20 [&>div]:bg-green-500" />
                                  </div>
                                   <div>
                                    <div className="flex justify-between text-sm font-medium">
                                      <span>Medium</span>
                                      <span>{analysisResult.leetCode.mediumSolved}</span>
                                    </div>
                                    <Progress value={(analysisResult.leetCode.mediumSolved / analysisResult.leetCode.totalSolved) * 100} className="h-2 bg-yellow-500/20 [&>div]:bg-yellow-500" />
                                  </div>
                                   <div>
                                    <div className="flex justify-between text-sm font-medium">
                                      <span>Hard</span>
                                      <span>{analysisResult.leetCode.hardSolved}</span>
                                    </div>
                                    <Progress value={(analysisResult.leetCode.hardSolved / analysisResult.leetCode.totalSolved) * 100} className="h-2 bg-red-500/20 [&>div]:bg-red-500" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground min-h-[150px] flex items-center justify-center">
                          <p>Click the button below to analyze your profiles.</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button onClick={handleAnalyze} disabled={isAnalyzing} type="button">
                        {isAnalyzing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        {analysisResult ? 'Re-analyze Profiles' : 'Analyze Profiles'}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex space-x-1">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
        </div>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
         <div className="flex justify-end pt-4 border-t">
            <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
