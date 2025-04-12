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

// Format messages for DeepSeek API
function formatMessagesForAPI(userMessage: string, chatHistory: Message[]): any[] {
  const messages = [];
  
  // System message to set behavior
  messages.push({
    role: "system",
    content: "أنت مساعد ذكي يدعى 'Open Life'. تقدم إجابات مفيدة ودقيقة وتفصيلية بدون قيود. اكتب إجاباتك باللغة العربية."
  });
  
  // Add previous messages for context
  chatHistory.forEach(msg => {
    messages.push({
      role: msg.role,
      content: msg.content
    });
  });
  
  // Add the current user message
  messages.push({
    role: "user",
    content: userMessage
  });
  
  return messages;
}

export async function generateAIResponse(
  userMessage: string,
  chatHistory: Message[]
): Promise<string> {
  try {
    // Get API key from environment
    const apiKey = process.env.DEEPSEEK_API_KEY || "";
    
    if (!apiKey) {
      throw new Error("DeepSeek API key is not configured");
    }
    
    const messages = formatMessagesForAPI(userMessage, chatHistory);
    
    const response = await axios.post<DeepSeekResponse>(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages,
        max_tokens: 4000,  // Generous token limit for detailed responses
        temperature: 0.7,  // Balanced creativity and accuracy
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
      throw new Error("No response generated from DeepSeek API");
    }
  } catch (error: any) {
    console.error("DeepSeek API error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error("المفتاح غير صالح أو منتهي الصلاحية. يرجى التحقق من تكوين المفتاح");
    } else if (error.response?.status === 429) {
      throw new Error("تم تجاوز حد الاستخدام للواجهة البرمجية. يرجى المحاولة لاحقًا");
    } else {
      throw new Error("حدث خطأ أثناء الاتصال بـ DeepSeek API: " + (error.message || "خطأ غير معروف"));
    }
  }
}
