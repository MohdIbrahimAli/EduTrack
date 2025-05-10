
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, MessageCircleQuestion, BookOpenCheck } from "lucide-react";

const faqs = [
  {
    id: "faq1",
    question: "How do I report an absence for my child?",
    answer: "Navigate to the 'Report Absence' section from the dashboard or sidebar. Fill in your child's name, date of absence, reason, and any additional details. You can use the AI assistant to help draft the notification.",
  },
  {
    id: "faq2",
    question: "Where can I see my child's attendance history?",
    answer: "Select your child from the dashboard or sidebar, then go to their 'Attendance' section. You can view attendance in a calendar, daily log, or monthly summary format.",
  },
  {
    id: "faq3",
    question: "How do I check my child's assignments and grades?",
    answer: "For each child, there are 'Assignments' and 'Progress Reports' sections. Assignments show upcoming and past work, while Progress Reports provide term grades and teacher feedback.",
  },
  {
    id: "faq4",
    question: "Can I contact my child's teachers through the portal?",
    answer: "Yes, the 'Messages' section allows you to communicate with your child's teachers. Select the teacher you wish to message and start a conversation.",
  },
  {
    id: "faq5",
    question: "What if I forget my password?",
    answer: "On the login page, there should be a 'Forgot Password?' link. Clicking this will guide you through the process of resetting your password via email. (This feature is conceptual for the current version).",
  },
  {
    id: "faq6",
    question: "Is my data secure?",
    answer: "We take data security seriously. All communication is encrypted, and we follow best practices to protect your personal information. For more details, please refer to our Privacy Policy (conceptual).",
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <LifeBuoy className="h-16 w-16 text-accent mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-primary">Help & Support</h1>
        <p className="text-lg text-muted-foreground mt-2">Find answers to common questions about the EduAttend Parent Portal.</p>
      </div>

      <Card className="max-w-3xl mx-auto shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
            <MessageCircleQuestion className="h-6 w-6"/> Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem value={faq.id} key={faq.id}>
                <AccordionTrigger className="text-left hover:text-accent font-medium text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto mt-8 shadow-xl rounded-lg">
        <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
                <BookOpenCheck className="h-6 w-6"/> Contact Us
            </CardTitle>
            <CardDescription>Still need help? Reach out to our support team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <p className="text-foreground">If you can't find the answer you're looking for, please contact school administration or our support team:</p>
            <p className="text-foreground"><span className="font-medium">Email:</span> support@eduattend.example.com (Conceptual)</p>
            <p className="text-foreground"><span className="font-medium">Phone:</span> (123) 456-7890 (Conceptual)</p>
        </CardContent>
      </Card>
    </div>
  );
}
