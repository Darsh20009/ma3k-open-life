import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, HelpCircle, User, LogOut, Settings } from "lucide-react";
import useMobile from "@/hooks/use-mobile";
import ThemeSwitcher from "./theme-switcher";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const isMobile = useMobile();
  const { user, logoutMutation } = useAuth();
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary flex items-center lg:hidden">
            <Brain className="text-accent mr-2 h-5 w-5" />
            <span>Open Life</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm dark:text-gray-300 hidden md:inline-block">
                مرحباً، {user.username}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logoutMutation.mutate()}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline-block">تسجيل الخروج</span>
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline-block">تسجيل الدخول</span>
              </Button>
            </Link>
          )}
          
          <Link href="/settings">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm hidden sm:inline-flex"
            >
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline-block">الإعدادات</span>
            </Button>
          </Link>
          
          <Link href="/help">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm hidden sm:inline-flex"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              المساعدة
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
