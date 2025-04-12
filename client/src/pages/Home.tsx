import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import ChatSuggestions from "@/components/ChatSuggestions";

export default function Home() {
  const [creating, setCreating] = useState(false);
  const [_, setLocation] = useLocation();

  const createNewChat = async () => {
    if (creating) return;

    try {
      setCreating(true);
      const response = await apiRequest("POST", "/api/chats", { title: "محادثة جديدة" });
      const data = await response.json();
      setLocation(`/chat/${data.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    try {
      setCreating(true);
      const response = await apiRequest("POST", "/api/chats", { title: suggestion });
      const newChat = await response.json();

      // Add the first message to the chat
      await apiRequest("POST", "/api/messages", {
        chatId: newChat.id,
        content: suggestion,
        role: "user"
      });

      setLocation(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error handling suggestion:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-sm">
        <CardContent className="pt-6 pb-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-accent mr-2" />
              <h1 className="text-3xl font-bold text-primary">Open Life</h1>
            </div>
          </div>

          <p className="text-gray-600 text-center mb-8">
            مرحباً بك في Open Life. يمكنك سؤالي عن أي شيء بدون قيود. أنا هنا للإجابة على أسئلتك ومساعدتك.
          </p>

          <div className="flex justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-blue-600 text-white"
              onClick={createNewChat}
              disabled={creating}
            >
              {creating ? "جاري الإنشاء..." : "بدء محادثة جديدة"}
            </Button>
          </div>

          <h2 className="text-lg font-medium text-center mb-4">أو جرب إحدى هذه الاقتراحات</h2>

          <ChatSuggestions onSuggestionClick={handleSuggestionClick} />

          <div className="text-xs text-gray-500 text-center mt-8">
            موقع Open Life هو من تصميم و تنفيذ شركة ma3k
          </div>
        </CardContent>
      </Card>
    </div>
  );
}