"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({
      onToolCall: (toolCall) => {
        console.log("[TOOL CALL]:", toolCall);
      },
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <header className="flex items-center justify-center py-4 border-b">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI Chatbot
        </h1>
      </header>

      <Card className="flex-1 my-4 p-4 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div className="space-y-2">
                <Bot className="h-12 w-12 mx-auto text-primary/60" />
                <h3 className="text-lg font-semibold">
                  How can I help you today?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ask me anything and I&apos;ll do my best to assist you.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-4",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-background">
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </Card>

      {error && (
        <div className="text-destructive text-sm mb-2">
          Error: {error.message}. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const form = e.currentTarget.form;
              if (form) form.requestSubmit();
            }
          }}
        />

        <Button
          type="submit"
          size="icon"
          disabled={status === "streaming" || !input.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
