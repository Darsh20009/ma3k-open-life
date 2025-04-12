import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Plus, MessageSquare, Settings, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Chat } from "@/types";
import useMobile from "@/hooks/use-mobile";

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: number;
  isLoading: boolean;
  onNewChat: () => void;
}

export default function ChatSidebar({ chats, currentChatId, isLoading, onNewChat }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  // Close sidebar on mobile when changing chats
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [currentChatId, isMobile]);

  // Always show sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  return (
    <>
      {/* Sidebar backdrop for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:relative z-30 h-full flex flex-col bg-white border-l border-gray-200 w-64 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } ${isMobile ? "lg:relative" : ""}`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary flex items-center">
              <Brain className="text-accent mr-2 h-5 w-5" />
              <span>Open Life</span>
            </h1>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* New chat button */}
        <div className="p-4">
          <Button 
            className="w-full bg-primary hover:bg-blue-600 text-white rounded-lg"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4 mr-2" /> محادثة جديدة
          </Button>
        </div>
        
        {/* Chat history */}
        <div className="flex-1 overflow-y-auto p-2">
          <h2 className="text-xs uppercase text-gray-500 font-semibold px-2 mb-2">المحادثات السابقة</h2>
          
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton className="h-6 w-full" />
              </div>
            ))
          ) : chats.length > 0 ? (
            // Chat history items
            chats.map((chat) => (
              <Link 
                key={chat.id} 
                href={`/chat/${chat.id}`}
              >
                <a className={`chat-history-item hover:bg-gray-100 rounded-lg p-2 cursor-pointer mb-1 transition-colors flex items-center ${
                  chat.id === currentChatId ? "bg-gray-100" : ""
                }`}>
                  <MessageSquare className="text-gray-400 mr-2 h-4 w-4" />
                  <div className="truncate text-sm">{chat.title}</div>
                </a>
              </Link>
            ))
          ) : (
            // Empty state
            <div className="text-center p-4 text-gray-500 text-sm">
              لا توجد محادثات سابقة
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </Button>
        </div>
      </div>

      {/* Show sidebar button on mobile */}
      {isMobile && !isOpen && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-3 right-3 z-10 lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
