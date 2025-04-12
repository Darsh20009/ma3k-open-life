import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Send, MailQuestion, AlertCircle } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

// تحديد مخطط التحقق من صحة نموذج الاتصال
const contactFormSchema = z.object({
  name: z.string().min(3, { message: "يجب أن يحتوي الاسم على 3 أحرف على الأقل" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  subject: z.string().min(5, { message: "يجب أن يحتوي العنوان على 5 أحرف على الأقل" }),
  message: z.string().min(10, { message: "يجب أن تحتوي الرسالة على 10 أحرف على الأقل" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function HelpPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  
  // إعداد نموذج الاتصال
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.username || "",
      email: "",
      subject: "",
      message: ""
    },
  });
  
  // معالجة إرسال نموذج الاتصال
  const onSubmit = async (data: ContactFormValues) => {
    setIsSending(true);
    try {
      // هنا يمكن إضافة منطق لإرسال البريد إلى ma3k.2025@gmail.com
      // في الوقت الحالي نقوم بمحاكاة عملية الإرسال
      console.log("Sending email to ma3k.2025@gmail.com", data);
      
      // محاكاة التأخير في الإرسال
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن.",
        variant: "default",
      });
      
      // إعادة تعيين النموذج
      form.reset({
        name: user?.username || "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "حدث خطأ أثناء إرسال الرسالة",
        description: "يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="المساعدة" />
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* قسم الأسئلة الشائعة */}
          <Card className="border-none shadow-sm dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center mb-2">
                <AlertCircle className="text-primary mr-2 h-5 w-5" />
                <CardTitle className="text-2xl">الأسئلة الشائعة</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-400">
                إليك بعض الإجابات على الأسئلة المتكررة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold dark:text-gray-200">ما هو Open Life؟</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Open Life هو منصة ذكاء اصطناعي متقدمة تتيح للمستخدمين إجراء محادثات طبيعية بدون قيود.
                    يمكنك طرح أي سؤال والحصول على إجابات مفيدة ودقيقة.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold dark:text-gray-200">هل يمكنني استخدام Open Life مجانًا؟</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    نعم، يمكنك استخدام Open Life مجانًا. نحن نقدم خدمتنا للجميع دون أي تكلفة.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold dark:text-gray-200">كيف يمكنني حفظ المحادثات؟</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    للاستفادة من ميزة حفظ المحادثات، يجب عليك إنشاء حساب وتسجيل الدخول. 
                    بعد ذلك، سيتم حفظ جميع محادثاتك تلقائيًا ويمكنك الرجوع إليها في أي وقت.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold dark:text-gray-200">هل بياناتي آمنة؟</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    نعم، نحن نأخذ خصوصية وأمان بياناتك على محمل الجد. 
                    لا نشارك بياناتك الشخصية مع أي طرف ثالث دون موافقتك.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* نموذج الاتصال */}
          <Card className="border-none shadow-sm dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center mb-2">
                <MailQuestion className="text-primary mr-2 h-5 w-5" />
                <CardTitle className="text-2xl">اتصل بنا</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-400">
                هل لديك سؤال أو استفسار؟ يرجى ملء النموذج أدناه وسنرد عليك في أقرب وقت ممكن.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">الاسم</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="أدخل اسمك" 
                              {...field} 
                              className="dark:bg-gray-800 dark:text-white"
                              disabled={isSending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="أدخل بريدك الإلكتروني" 
                              type="email" 
                              {...field} 
                              className="dark:bg-gray-800 dark:text-white"
                              disabled={isSending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">الموضوع</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل موضوع الرسالة" 
                            {...field} 
                            className="dark:bg-gray-800 dark:text-white"
                            disabled={isSending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">الرسالة</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="اكتب رسالتك هنا..." 
                            {...field} 
                            className="min-h-[150px] dark:bg-gray-800 dark:text-white"
                            disabled={isSending}
                          />
                        </FormControl>
                        <FormDescription className="text-xs dark:text-gray-400">
                          سيتم إرسال رسالتك إلى فريق الدعم على البريد الإلكتروني ma3k.2025@gmail.com
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>جاري الإرسال...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* معلومات الاتصال */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                <span>Open Life - من تصميم وتنفيذ <a href="https://ma3k.odoo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">شركة ma3k</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}