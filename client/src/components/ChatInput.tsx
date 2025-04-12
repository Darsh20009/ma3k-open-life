import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearInput = () => {
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="اكتب سؤالك أو طلبك هنا..."
              style={{ 
                maxHeight: "200px", 
                minHeight: "50px"
              }}
              disabled={disabled}
            />
            {input && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2 bottom-2 text-gray-400 hover:text-gray-600"
                onClick={clearInput}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-blue-600 text-white rounded-lg p-3 transition-colors"
            disabled={!input.trim() || disabled}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <div className="text-xs text-gray-500 text-center mt-2">
          Open Life يعتمد على AIML API ويقدم إجابات بدون قيود
        </div>
      </div>
    </div>
  );
}
