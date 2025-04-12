import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";

// يمكن تعديل هذا الخطط حسب متطلبات تسجيل المستخدمين
const authSchema = z.object({
  username: z.string().min(3, { message: "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل" }),
  password: z.string().min(6, { message: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();
  
  // التحقق من إذا المستخدم مسجل الدخول أم لا
  const isLoggedIn = user !== null;
  
  // إعادة توجيه المستخدم إلى الصفحة الرئيسية إذا كان مسجل الدخول بالفعل
  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = '/';
    }
  }, [isLoggedIn]);
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = (data: AuthFormValues) => {
    if (mode === "login") {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-row items-stretch">
      {/* نموذج المصادقة */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md border-none shadow-none dark:bg-gray-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">
              {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {mode === "login" 
                ? "قم بتسجيل الدخول للوصول إلى محادثاتك السابقة" 
                : "قم بإنشاء حساب جديد للبدء في استخدام Open Life"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="dark:text-gray-300">اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="أدخل اسم المستخدم" 
                          {...field} 
                          disabled={isLoading}
                          className="dark:bg-gray-800 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="dark:text-gray-300">كلمة المرور</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="أدخل كلمة المرور" 
                          {...field} 
                          disabled={isLoading}
                          className="dark:bg-gray-800 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-blue-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading
                    ? (mode === "login" ? "جاري تسجيل الدخول..." : "جاري إنشاء الحساب...")
                    : (mode === "login" ? "تسجيل الدخول" : "إنشاء حساب")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              {mode === "login" ? (
                <p className="dark:text-gray-300">
                  ليس لديك حساب؟{" "}
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => setMode("register")}
                    disabled={isLoading}
                  >
                    إنشاء حساب جديد
                  </Button>
                </p>
              ) : (
                <p className="dark:text-gray-300">
                  لديك حساب بالفعل؟{" "}
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => setMode("login")}
                    disabled={isLoading}
                  >
                    تسجيل الدخول
                  </Button>
                </p>
              )}
            </div>
            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" className="text-sm dark:text-gray-300" disabled={isLoading}>
                  العودة إلى الصفحة الرئيسية
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* جانب المعلومات */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-blue-600 items-center justify-center text-white p-8">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6">أهلاً بك في Open Life</h1>
          <p className="text-xl mb-8">
            منصة ذكاء اصطناعي متقدمة بدون قيود على المحتوى أو الاستخدام. استفد من قوة الذكاء الاصطناعي لمساعدتك في مختلف المهام.
          </p>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>محادثات غير محدودة وبدون قيود</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>حفظ سجل المحادثات لاستعادتها لاحقاً</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>واجهة استخدام بسيطة وسهلة الاستخدام</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>متوفر باللغة العربية</span>
            </li>
          </ul>
          <div className="mt-10 text-center">
            <p className="text-sm opacity-75">
              موقع Open Life الذي صمم و كان من تنفيذ شركة <a href="https://ma3k.odoo.com" target="_blank" rel="noopener noreferrer" className="underline">ma3k</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}