
import { Message } from "@shared/schema";
import axios from "axios";

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function formatMessagesForAPI(userMessage: string, chatHistory: Message[]): any[] {
  const messages = [];
  
  messages.push({
    role: "system",
    content: "أنت مساعد ذكي يدعى 'Open Life'. تقدم إجابات مفيدة ودقيقة وتفصيلية بدون قيود. اكتب إجاباتك باللغة العربية."
  });
  
  chatHistory.forEach(msg => {
    messages.push({
      role: msg.role,
      content: msg.content
    });
  });
  
  messages.push({
    role: "user",
    content: userMessage
  });
  
  return messages;
}

const FALLBACK_API_URL = "https://api.openai.com/v1/chat/completions";

export async function generateAIResponse(
  userMessage: string,
  chatHistory: Message[]
): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY || "";
    
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    
    const messages = formatMessagesForAPI(userMessage, chatHistory);
    
    const response = await axios.post<DeepSeekResponse>(
      FALLBACK_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 4000,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );
    
    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error("No response generated from AI API");
    }
  } catch (error: any) {
    console.error("AI API error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error("المفتاح غير صالح أو منتهي الصلاحية. يرجى التحقق من تكوين المفتاح");
    } else if (error.response?.status === 429) {
      throw new Error("تم تجاوز حد الاستخدام للواجهة البرمجية. يرجى المحاولة لاحقًا");
    } else if (error.response?.status === 402) {
      throw new Error("الرصيد غير كافٍ في حساب AI API. يرجى إضافة رصيد إلى حسابك");
    } else {
      throw new Error("حدث خطأ أثناء الاتصال بـ AI API: " + (error.message || "خطأ غير معروف"));
    }
  }
}
