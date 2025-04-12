import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, HelpCircle } from "lucide-react";
import useMobile from "@/hooks/use-mobile";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const isMobile = useMobile();
  
  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary flex items-center lg:hidden">
            <Brain className="text-accent mr-2 h-5 w-5" />
            <span>Open Life</span>
          </h1>
        </div>
        <div>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 text-sm hidden sm:inline-flex">
            <HelpCircle className="h-4 w-4 mr-1" />
            المساعدة
          </Button>
        </div>
      </div>
    </header>
  );
}
