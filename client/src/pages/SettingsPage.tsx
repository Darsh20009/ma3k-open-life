import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Code, ExternalLink, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="flex flex-col h-screen">
      <Header title="الإعدادات" />
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="about">حول الموقع</TabsTrigger>
              <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-4">
              <Card className="border-none shadow-sm dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Info className="text-primary mr-2 h-5 w-5" />
                    <CardTitle className="text-2xl">حول موقع Open Life</CardTitle>
                  </div>
                  <CardDescription className="dark:text-gray-400">
                    معلومات عامة حول الموقع والتقنيات المستخدمة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">ما هو Open Life؟</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Open Life هو موقع ذكاء اصطناعي متقدم يتيح للمستخدمين إجراء محادثات بدون قيود.
                      يستخدم الموقع تقنيات الذكاء الاصطناعي المتطورة لتقديم إجابات دقيقة ومفيدة على مختلف الأسئلة والاستفسارات.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">المميزات الرئيسية</h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                      <li>محادثات غير محدودة وبدون قيود على المحتوى</li>
                      <li>حفظ سجل المحادثات للرجوع إليها لاحقًا</li>
                      <li>واجهة مستخدم سهلة الاستخدام ومتوفرة باللغة العربية</li>
                      <li>دعم الوضع المظلم للقراءة المريحة</li>
                      <li>إمكانية استخدام الموقع من جميع الأجهزة</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">الفريق</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Code className="text-primary mr-2 h-5 w-5 mt-1" />
                        <div>
                          <p className="font-medium dark:text-gray-200">المصمم والمبرمج: يوسف درويش</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">مطور ومصمم الواجهة الرئيسية</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Heart className="text-red-500 mr-2 h-5 w-5 mt-1" />
                        <div>
                          <p className="font-medium dark:text-gray-200">التنفيذ: شركة ma3k</p>
                          <a 
                            href="https://ma3k.odoo.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline flex items-center text-sm"
                          >
                            زيارة موقع الشركة <ExternalLink className="h-3 w-3 mr-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">التقنيات المستخدمة</h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                      <li>واجهة المستخدم: React مع TypeScript</li>
                      <li>الخادم: Node.js مع Express</li>
                      <li>قاعدة البيانات: PostgreSQL</li>
                      <li>الذكاء الاصطناعي: AIML API</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-center">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <Brain className="h-5 w-5 mr-2 text-primary" />
                        <span>© {new Date().getFullYear()} Open Life - جميع الحقوق محفوظة</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card className="border-none shadow-sm dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>الملف الشخصي</CardTitle>
                  <CardDescription>
                    إدارة معلومات حسابك وإعدادات الملف الشخصي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">اسم المستخدم:</p>
                        <p className="text-gray-700 dark:text-gray-300">{user.username}</p>
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="outline" className="w-full sm:w-auto" disabled>
                          تغيير كلمة المرور
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        يرجى تسجيل الدخول لعرض معلومات الملف الشخصي
                      </p>
                      <Button asChild variant="default">
                        <a href="/auth">تسجيل الدخول</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}