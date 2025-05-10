
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateAbsenceReport, ReportAbsenceFormState } from '@/app/(app)/report-absence/actions';
import { MOCK_CHILDREN } from '@/lib/placeholder-data';
import type { Child } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Check, MessageSquarePlus, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


const initialState: ReportAbsenceFormState = { message: undefined, errors: {}, generatedReport: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate with AI
    </Button>
  );
}

export function ReportAbsenceForm() {
  const [state, formAction] = useFormState(handleGenerateAbsenceReport, initialState);
  const [selectedChild, setSelectedChild] = useState<Child | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.message && !state.errors?.aiError && state.generatedReport) {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
      });
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const handleCopyToClipboard = (textToCopy: string | undefined) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleCopyAndGoToMessages = () => {
    if (state.generatedReport?.notificationText) {
      handleCopyToClipboard(state.generatedReport.notificationText);
      // Navigate to messages page. The user can then paste the copied text.
      router.push('/messages');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-accent" /> AI Absence Reporter
          </CardTitle>
          <CardDescription>
            Let our AI assistant help you draft a professional absence notification for your child's school.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="childId" className="text-foreground font-medium">Child</Label>
              <Select
                name="childId"
                onValueChange={(value) => {
                  const child = MOCK_CHILDREN.find(c => c.id === value);
                  setSelectedChild(child);
                }}
                defaultValue={selectedChild?.id}
              >
                <SelectTrigger id="childId" className="w-full">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CHILDREN.map(child => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} ({child.gradeLevel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Hidden input to pass childName to the action */}
              {selectedChild && <input type="hidden" name="childName" value={selectedChild.name} />}
              {state.errors?.childId && <p className="text-sm text-destructive mt-1">{state.errors.childId[0]}</p>}
            </div>

            <div>
              <Label htmlFor="date" className="text-foreground font-medium">Date of Absence</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(d) => d < new Date(new Date().setDate(new Date().getDate()-1))} // Disable past dates except today
                  />
                </PopoverContent>
              </Popover>
              {date && <input type="hidden" name="date" value={format(date, "yyyy-MM-dd")} />}
              {state.errors?.date && <p className="text-sm text-destructive mt-1">{state.errors.date[0]}</p>}
            </div>

            <div>
              <Label htmlFor="reason" className="text-foreground font-medium">Reason for Absence</Label>
              <Input id="reason" name="reason" placeholder="e.g., Feeling unwell, Doctor's appointment" className="border-input focus:border-accent" />
              {state.errors?.reason && <p className="text-sm text-destructive mt-1">{state.errors.reason[0]}</p>}
            </div>

            <div>
              <Label htmlFor="additionalDetails" className="text-foreground font-medium">Additional Details (Optional)</Label>
              <Textarea id="additionalDetails" name="additionalDetails" placeholder="Any other important information..." className="border-input focus:border-accent" />
              {state.errors?.additionalDetails && <p className="text-sm text-destructive mt-1">{state.errors.additionalDetails[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            {state.errors?.aiError && (
              <Alert variant="destructive">
                <AlertTitle>AI Generation Error</AlertTitle>
                <AlertDescription>{state.errors.aiError[0]}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>

      {state.generatedReport?.notificationText && (
        <Card className="mt-8 shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Generated Notification</CardTitle>
            <CardDescription>Review the AI-generated text. You can copy it or proceed to messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={state.generatedReport.notificationText}
              rows={8}
              className="bg-muted border-muted-foreground/20"
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => handleCopyToClipboard(state.generatedReport?.notificationText)} variant="outline" className="w-full sm:w-auto">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
            <Button onClick={handleCopyAndGoToMessages} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Copy & Go to Messages
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
