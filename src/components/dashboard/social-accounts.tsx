import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Linkedin, Code } from 'lucide-react';

export function SocialAccounts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="size-5" />
          Social & Coding Profiles
        </CardTitle>
        <CardDescription>
          Link your profiles to get a more accurate skill analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="flex items-center gap-3">
            <Github className="size-5 text-muted-foreground" />
            <Input id="github" placeholder="https://github.com/username" />
          </div>
          <div className="flex items-center gap-3">
            <Linkedin className="size-5 text-muted-foreground" />
            <Input id="linkedin" placeholder="https://linkedin.com/in/username" />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="leetcode" className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M14.63 19.5L21.5 12.5L14.63 5.5" />
                <path d="M9.37 19.5L2.5 12.5L9.37 5.5" />
              </svg>
            </Label>
            <Input id="leetcode" placeholder="https://leetcode.com/username" />
          </div>
          <div className="flex justify-end">
            <Button>Analyze Profiles</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
