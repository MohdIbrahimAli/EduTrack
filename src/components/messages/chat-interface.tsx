'use client';

import { useState } from 'react';
import type { Conversation, Message } from '@/types';
import { MOCK_USER } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, UserCircle, MessageSquareDashed } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  initialConversations: Conversation[];
}

export function ChatInterface({ initialConversations }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialConversations.length > 0 ? initialConversations[0].id : null
  );
  const [newMessage, setNewMessage] = useState('');

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: MOCK_USER.id,
      senderName: MOCK_USER.name,
      avatarUrl: MOCK_USER.avatarUrl,
      dataAiHint: MOCK_USER.dataAiHint,
      timestamp: new Date().toISOString(),
      text: newMessage.trim(),
      isOwnMessage: true,
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessagePreview: message.text,
          lastMessageTimestamp: message.timestamp,
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    setNewMessage('');
    // In a real app, this would also send the message to the backend
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] border rounded-lg shadow-lg overflow-hidden bg-card">
      {/* Conversation List */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg font-semibold text-primary">Conversations</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100%-4rem)] p-2">
          {conversations.map(conv => (
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
                <AvatarImage src={conv.teacherAvatarUrl} alt={conv.teacherName} data-ai-hint={conv.dataAiHint || "teacher portrait"} />
                <AvatarFallback>{conv.teacherName.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate">{conv.teacherName}</p>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessagePreview}</p>
              </div>
              {conv.unreadCount > 0 && (
                <Badge variant="destructive" className="ml-auto shrink-0">{conv.unreadCount}</Badge>
              )}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="p-4 border-b flex-row items-center gap-3">
               <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.teacherAvatarUrl} alt={selectedConversation.teacherName} data-ai-hint={selectedConversation.dataAiHint || "teacher portrait"}/>
                <AvatarFallback>{selectedConversation.teacherName.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold text-primary">{selectedConversation.teacherName}</CardTitle>
                <p className="text-xs text-muted-foreground">Last active: {format(parseISO(selectedConversation.lastMessageTimestamp), "PPp")}</p>
              </div>
            </CardHeader>
            <ScrollArea className="flex-grow p-4 space-y-4 bg-background/30">
              {selectedConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2 max-w-[75%]",
                    msg.isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatarUrl} alt={msg.senderName} data-ai-hint={msg.dataAiHint || "person"} />
                    <AvatarFallback>{msg.senderName.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "p-3 rounded-lg shadow",
                      msg.isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn(
                        "text-xs mt-1",
                        msg.isOwnMessage ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                    )}>
                      {format(parseISO(msg.timestamp), "p")}
                    </p>
                  </div>
                </div>
              ))}
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
            <p className="text-sm text-muted-foreground">Choose a teacher from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
