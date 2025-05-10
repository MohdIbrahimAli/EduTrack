import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_NOTIFICATIONS } from "@/lib/placeholder-data";
import type { SchoolNotification } from "@/types";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

function NotificationIcon({ type }: { type: SchoolNotification['type'] }) {
  switch (type) {
    case 'absence':
      return <Bell className="h-5 w-5 text-yellow-500" />;
    case 'announcement':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function NotificationsPage() {
  const sortedNotifications = [...MOCK_NOTIFICATIONS].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Notifications</h1>
      {sortedNotifications.length > 0 ? (
        <div className="space-y-6">
          {sortedNotifications.map((notification) => (
            <Card key={notification.id} className={`shadow-lg rounded-lg overflow-hidden ${notification.read ? 'opacity-70 bg-muted/30' : 'bg-card'}`}>
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <NotificationIcon type={notification.type} />
                    <CardTitle className="text-lg font-semibold text-primary">{notification.title}</CardTitle>
                  </div>
                  {!notification.read && (
                     <Badge variant="destructive" className="text-xs shrink-0">New</Badge>
                  )}
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(notification.date), "MMMM dd, yyyy 'at' hh:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-foreground">{notification.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md rounded-lg text-center py-12">
          <CardContent className="flex flex-col items-center gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-xl font-medium text-muted-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">You have no new notifications.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
