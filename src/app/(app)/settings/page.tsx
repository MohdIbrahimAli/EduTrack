'use client'; // For potential client-side interactions like theme toggling

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Palette, UserCircle, LogOut, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function SettingsPage() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('system'); // 'light', 'dark', 'system'

  // Effect to load theme from localStorage (if implemented)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setCurrentTheme(storedTheme);
      // Apply theme to HTML element if necessary
      // document.documentElement.classList.remove('light', 'dark');
      // document.documentElement.classList.add(storedTheme);
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    // localStorage.setItem('theme', theme);
    // document.documentElement.classList.remove('light', 'dark');
    // if (theme !== 'system') {
    //   document.documentElement.classList.add(theme);
    // } else {
      // Apply system theme logic, e.g., matchMedia
    // }
    toast({ title: "Theme settings are illustrative", description: "Full theme switching requires deeper integration." });
  };
  
  const handleNotificationToggle = (type: 'email' | 'push', value: boolean) => {
    if (type === 'email') setEmailNotifications(value);
    if (type === 'push') setPushNotifications(value);
    toast({ title: `Mock ${type} notifications ${value ? 'enabled' : 'disabled'}` });
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Settings</h1>
      <div className="grid gap-8 md:grid-cols-1"> {/* Simplified to single column for better structure */}
        
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notification Preferences
            </CardTitle>
            <CardDescription>Manage how you receive notifications from EduAttend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
              <Label htmlFor="email-notifications" className="font-medium text-foreground">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={(value) => handleNotificationToggle('email', value)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
              <Label htmlFor="push-notifications" className="font-medium text-foreground">Push Notifications (Mobile)</Label>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={(value) => handleNotificationToggle('push', value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
              <Palette className="h-5 w-5" /> Theme Settings
            </CardTitle>
            <CardDescription>Customize the appearance of the application. (Illustrative)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row gap-2">
              <Button variant={currentTheme === 'light' ? 'default' : 'outline'} onClick={() => handleThemeChange('light')} className="flex-1">Light Mode</Button>
              <Button variant={currentTheme === 'dark' ? 'default' : 'outline'} onClick={() => handleThemeChange('dark')} className="flex-1">Dark Mode</Button>
              <Button variant={currentTheme === 'system' ? 'default' : 'outline'} onClick={() => handleThemeChange('system')} className="flex-1">System Default</Button>
            </div>
             <p className="text-xs text-muted-foreground text-center">Note: Full theme switching is a visual placeholder in this version.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
              <UserCircle className="h-5 w-5" /> Account Management
            </CardTitle>
            <CardDescription>Manage your account details and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password (Coming Soon)
            </Button>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Account (Coming Soon)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers. This feature is not functional in this demo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast({ title: "Feature Unavailable", description: "Account deletion is not implemented in this demo."})}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
