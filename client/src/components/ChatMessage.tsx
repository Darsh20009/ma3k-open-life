import React from "react";
import { Brain } from "lucide-react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  // Function to format code blocks
  const formatContent = (content: string) => {
    // Simple regex to detect code blocks surrounded by ```
    const codeBlockRegex = /```([\s\S]*?)```/g;
    
    // Split by code blocks
    const parts = content.split(codeBlockRegex);
    
    if (parts.length === 1) {
      // No code blocks, return plain text with line breaks
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
    
    // Process and render with code blocks
    const result: React.ReactNode[] = [];
    let isCodeBlock = false;
    
    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        // Regular text part
        if (part.trim()) {
          result.push(
            <p key={`text-${index}`} className="whitespace-pre-wrap mb-2">
              {part}
            </p>
          );
        }
      } else {
        // Code block part
        result.push(
          <pre key={`code-${index}`} className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 mb-4 text-left overflow-auto dir-ltr">
            <code className="dark:text-gray-300">{part}</code>
          </pre>
        );
      }
    });
    
    return <>{result}</>;
  };

  return (
    <div
      className={cn(
        "chat-message flex mb-4",
        message.role === "user" ? "justify-end" : ""
      )}
    >
      <div
        className={cn(
          "max-w-[80%] md:max-w-[70%] py-2 px-4 rounded-lg",
          message.role === "user"
            ? "bg-primary text-white"
            : "bg-white dark:bg-gray-800 shadow-sm"
        )}
      >
        {message.role === "assistant" && (
          <div className="flex items-center mb-1">
            <Brain className="text-accent mr-2 h-4 w-4" />
            <span className="font-medium text-accent">Open Life</span>
          </div>
        )}
        <div className={message.role === "user" 
          ? "text-white" 
          : "text-gray-800 dark:text-gray-200"
        }>
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
}
