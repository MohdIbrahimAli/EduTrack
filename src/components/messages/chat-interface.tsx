
'use client';

import { useState, useContext } from 'react';
import type { Conversation, Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, UserCircle, MessageSquareDashed, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; 
import { UserRoleContext } from '@/context/UserRoleContext';


interface ChatInterfaceProps {
  initialConversations: Conversation[];
}

export function ChatInterface({ initialConversations }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialConversations.length > 0 ? initialConversations[0].id : null
  );
  const [newMessage, setNewMessage] = useState('');
  
  const context = useContext(UserRoleContext);

  if (!context || context.isLoadingRole) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  const { currentUser } = context;

  if (!currentUser) {
    // This case should be handled by layout redirecting to login,
    // but as a fallback:
    return <p className="p-4 text-center text-destructive">User not authenticated. Please log in.</p>;
  }


  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name || "User",
      avatarUrl: currentUser.avatarUrl,
      dataAiHint: currentUser.dataAiHint,
      timestamp: new Date().toISOString(),
      text: newMessage.trim(),
      isOwnMessage: true, 
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        const updatedMessages = [...conv.messages, message];
        return {
          ...conv,
          messages: updatedMessages,
          lastMessagePreview: message.text,
          lastMessageTimestamp: message.timestamp,
          unreadCounts: {
            ...(conv.unreadCounts || {}),
            [currentUser.id]: 0,
          }
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    setNewMessage('');
  };
  
  const getOtherParticipantDetails = (conv: Conversation) => {
    const otherParticipantId = conv.participantIds.find(id => id !== currentUser.id);
    return otherParticipantId ? conv.participantDetails[otherParticipantId] : { name: "Unknown Contact", avatarUrl: undefined, role: 'parent' as 'parent' | 'teacher' };
  };


  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] border rounded-lg shadow-lg overflow-hidden bg-card">
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg font-semibold text-primary">Conversations</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100%-4rem)] p-2">
          {conversations.map(conv => {
            const contactDetails = getOtherParticipantDetails(conv);
            const unreadCountForCurrentUser = conv.unreadCounts ? conv.unreadCounts[currentUser.id] || 0 : 0;
            return (
                <Button
                key={conv.id}
                variant="ghost"
                className={cn(
                    "w-full justify-start h-auto p-3 mb-1 rounded-md text-left",
                    selectedConversationId === conv.id && "bg-accent text-accent-foreground"
                )}
                onClick={() => setSelectedConversationId(conv.id)}
                >
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={contactDetails.avatarUrl} alt={contactDetails.name} data-ai-hint={contactDetails.name.split(' ')[0] || "person"} />
                    <AvatarFallback>{contactDetails.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                    <p className="font-semibold truncate">{contactDetails.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessagePreview}</p>
                </div>
                {unreadCountForCurrentUser > 0 && (
                    <Badge variant="destructive" className="ml-auto shrink-0">{unreadCountForCurrentUser}</Badge>
                )}
                </Button>
            );
        })}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="p-4 border-b flex-row items-center gap-3">
               <Avatar className="h-10 w-10">
                <AvatarImage src={getOtherParticipantDetails(selectedConversation).avatarUrl} alt={getOtherParticipantDetails(selectedConversation).name} data-ai-hint={getOtherParticipantDetails(selectedConversation).name.split(' ')[0] || "person"}/>
                <AvatarFallback>{getOtherParticipantDetails(selectedConversation).name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold text-primary">{getOtherParticipantDetails(selectedConversation).name}</CardTitle>
                <p className="text-xs text-muted-foreground">Last active: {format(parseISO(selectedConversation.lastMessageTimestamp), "PPp")}</p>
              </div>
            </CardHeader>
            <ScrollArea className="flex-grow p-4 space-y-4 bg-background/30">
              {selectedConversation.messages.map(msg => {
                const isOwn = msg.senderId === currentUser.id;
                return (
                    <div
                    key={msg.id}
                    className={cn(
                        "flex items-end gap-2 max-w-[75%]",
                        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                    >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatarUrl} alt={msg.senderName} data-ai-hint={msg.dataAiHint || "person"} />
                        <AvatarFallback>{msg.senderName.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div
                        className={cn(
                        "p-3 rounded-lg shadow",
                        isOwn
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-secondary text-secondary-foreground rounded-bl-none"
                        )}
                    >
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn(
                            "text-xs mt-1",
                            isOwn ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                        )}>
                        {format(parseISO(msg.timestamp), "p")}
                        </p>
                    </div>
                    </div>
                );
            })}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2 bg-card">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow"
              />
              <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-background/30">
            <MessageSquareDashed className="h-24 w-24 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Select a conversation</h3>
            <p className="text-sm text-muted-foreground">Choose a contact from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
