import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeSwitcher() {
  // قراءة الثيم المحفوظ أو استخدام إعدادات النظام
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // التحقق إذا كان المستخدم قد اختار موضوعًا سابقًا
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    // استخدم إعدادات النظام إذا لم يتم اختيار موضوع
    if (!savedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    } else {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // تطبيق الثيم على الصفحة
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // حفظ الثيم في localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "تفعيل الوضع المظلم" : "تفعيل الوضع المضيء"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}