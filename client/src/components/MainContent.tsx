import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { Message } from "@/types";
import { LoaderPinwheel } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Chat } from "@/types";
import { Brain } from "lucide-react";

interface MainContentProps {
  chatId: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  chat?: Chat;
}

export default function MainContent({ 
  chatId, 
  messages, 
  setMessages, 
  isLoading,
  chat
}: MainContentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      setIsProcessing(true);
      setError(null);
      
      // First send the user message
      const userMsgRes = await apiRequest("POST", "/api/messages", {
        chatId,
        content,
        role: "user"
      });
      const userMsg = await userMsgRes.json();
      setMessages(prev => [...prev, userMsg]);
      
      // Then get the AI response
      const aiRes = await apiRequest("POST", "/api/chat", {
        chatId,
        message: content
      });
      
      return aiRes.json();
    },
    onSuccess: (aiMessage) => {
      setMessages(prev => [...prev, aiMessage]);
      queryClient.invalidateQueries({ queryKey: [`/api/chats/${chatId}/messages`] });
    },
    onError: (error: any) => {
      // Check for specific errors
      if (error.response?.data?.message) {
        // Handle API response errors
        if (error.response.data.message.includes("DeepSeek API")) {
          setError("حدث خطأ في خدمة الذكاء الاصطناعي. قد يكون المفتاح غير صالح أو الرصيد غير كافٍ.");
        } else {
          setError(error.response.data.message);
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("حدث خطأ أثناء معالجة الرسالة");
      }
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const handleSendMessage = (content: string) => {
    if (content.trim() && !isProcessing) {
      sendMessage.mutate(content);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header title={chat?.title || "محادثة جديدة"} />
      
      {/* Chat area */}
      <div ref={chatAreaRef} className="chat-area flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          // Welcome message when no messages
          <div className="max-w-2xl mx-auto mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-center text-primary mb-2">مرحباً بك في Open Life</h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">يمكنك سؤالي عن أي شيء بدون قيود. أنا هنا للإجابة على أسئلتك ومساعدتك.</p>
          </div>
        ) : (
          // Messages
          messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
            />
          ))
        )}
        
        {/* Processing indicator */}
        {isProcessing && (
          <div className="chat-message ai-message flex mb-4">
            <div className="max-w-[80%] md:max-w-[70%] bg-white dark:bg-gray-800 rounded-lg py-2 px-4 shadow-sm">
              <div className="flex items-center mb-1">
                <Brain className="text-accent mr-2 h-4 w-4" />
                <span className="font-medium text-accent">Open Life</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                جاري التفكير<span className="dot-animation">...</span>
              </p>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-4 max-w-2xl mx-auto">
            <AlertTitle>حدث خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      
      {/* Chat input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isProcessing || isLoading} 
      />
    </div>
  );
}
