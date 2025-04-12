import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ChatPage from "@/pages/ChatPage";
import AuthPage from "@/pages/auth-page";
import SettingsPage from "@/pages/SettingsPage";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { useEffect } from "react";

// تهيئة وضع الثيم الداكن استنادًا إلى إعدادات المستخدم
function DarkModeInitializer() {
  useEffect(() => {
    // التحقق من وجود إعدادات مخزنة
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // استخدم إعدادات النظام كقيمة افتراضية
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <ProtectedRoute path="/chat/:id" component={ChatPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DarkModeInitializer />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
