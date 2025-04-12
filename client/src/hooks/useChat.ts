import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@/types";

export default function useChat(chatId: number) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch messages for the chat
  const { data, isLoading, error } = useQuery<Message[]>({
    queryKey: [`/api/chats/${chatId}/messages`],
    enabled: !isNaN(chatId)
  });

  // Update messages when data changes
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  return { messages, setMessages, isLoading, error };
}
