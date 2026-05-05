'use client';

import { useState, useRef, useEffect } from 'react';
import { ForumMessage } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User } from 'lucide-react';
import { format } from 'date-fns';

interface CommunityForumProps {
  messages: ForumMessage[];
  eventId: string;
}

export function CommunityForum({ messages: initialMessages, eventId }: CommunityForumProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg: ForumMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'u_current',
      userName: 'You',
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <Card className="h-[600px] flex flex-col border-primary/10 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b border-primary/10">
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Community Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 flex flex-col">
        <ScrollArea className="flex-grow p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-2">
                <Send className="w-8 h-8 opacity-20" />
                <p>Start the conversation! Encourage others attending.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.userId === 'u_current' ? 'flex-row-reverse' : ''}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className={`max-w-[80%] space-y-1 ${msg.userId === 'u_current' ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2 px-1">
                      <p className="text-xs font-bold">{msg.userName}</p>
                      <p className="text-[10px] text-muted-foreground">{format(new Date(msg.createdAt), 'p')}</p>
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${msg.userId === 'u_current'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-background border border-primary/10 rounded-tl-none'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="p-4 bg-background/50 border-t border-primary/10">
          <div className="flex gap-2">
            <Input
              placeholder="Say something inspiring..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="rounded-xl border-primary/20 bg-background/80"
            />
            <Button onClick={handleSend} size="icon" className="rounded-xl bg-primary">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
