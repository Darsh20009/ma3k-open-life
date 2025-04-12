import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Assumed component
import { Brain } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import ChatSuggestions from "@/components/ChatSuggestions";
import { useAuth } from "@/hooks/use-auth"; // Assumed hook


export default function Home() {
  const { user, setAnonymousUsername } = useAuth(); // Added useAuth hook
  const [showNameDialog, setShowNameDialog] = useState(!user?.username);
  const [creating, setCreating] = useState(false);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!user?.username) {
      setShowNameDialog(true);
    }
  }, [user]);

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

  if (showNameDialog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Card className="w-[90%] max-w-md">
          <CardHeader>
            <CardTitle>أهلاً بك في Open Life</CardTitle>
            <CardDescription>الرجاء إدخال اسمك للمتابعة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = new FormData(e.currentTarget).get('username') as string;
              if (name.trim()) {
                setAnonymousUsername(name.trim());
                setShowNameDialog(false);
              }
            }}>
              <div className="space-y-4">
                <Input 
                  name="username"
                  placeholder="أدخل اسمك هنا"
                  required
                  minLength={3}
                />
                <Button type="submit" className="w-full">متابعة</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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