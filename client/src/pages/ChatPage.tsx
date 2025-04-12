import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ChatSidebar from "@/components/ChatSidebar";
import MainContent from "@/components/MainContent";
import { useToast } from "@/hooks/use-toast";
import { Chat, Message } from "@/types";
import useChat from "@/hooks/useChat";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const chatId = parseInt(id);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { messages, setMessages, isLoading: chatLoading } = useChat(chatId);

  // Get current chat
  const { data: chat, isLoading: isChatLoading, error: chatError } = useQuery<Chat>({
    queryKey: [`/api/chats/${chatId}`],
    enabled: !isNaN(chatId)
  });

  // Get all chats for the sidebar
  const { data: chats, isLoading: isChatsLoading } = useQuery<Chat[]>({
    queryKey: ['/api/chats'],
  });

  // Create new chat mutation
  const createChat = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/chats", { title });
      return res.json();
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
      setLocation(`/chat/${newChat.id}`);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء محادثة جديدة",
        variant: "destructive",
      });
    }
  });

  // Handle navigation errors
  useEffect(() => {
    if (chatError) {
      toast({
        title: "خطأ",
        description: "المحادثة غير موجودة",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [chatError, setLocation, toast]);

  // Redirect to home if chat ID is invalid
  useEffect(() => {
    if (isNaN(chatId)) {
      setLocation("/");
    }
  }, [chatId, setLocation]);

  const handleNewChat = () => {
    createChat.mutate("محادثة جديدة");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar 
        chats={chats || []} 
        currentChatId={chatId}
        isLoading={isChatsLoading}
        onNewChat={handleNewChat}
      />
      
      <MainContent 
        chatId={chatId}
        messages={messages}
        setMessages={setMessages}
        isLoading={isChatLoading || chatLoading}
        chat={chat}
      />
    </div>
  );
}
