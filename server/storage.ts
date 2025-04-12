import { 
  users, type User, type InsertUser,
  chats, type Chat, type InsertChat,
  messages, type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat methods
  createChat(chat: InsertChat): Promise<Chat>;
  getChat(id: number): Promise<Chat | undefined>;
  getAllChats(): Promise<Chat[]>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByChatId(chatId: number): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  
  private userId: number;
  private chatId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.messages = new Map();
    
    this.userId = 1;
    this.chatId = 1;
    this.messageId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Chat methods
  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = this.chatId++;
    const chat: Chat = { 
      ...insertChat, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.chats.set(id, chat);
    return chat;
  }
  
  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }
  
  async getAllChats(): Promise<Chat[]> {
    return Array.from(this.chats.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date().toISOString()
    };
    this.messages.set(id, message);
    
    // Update chat title if it's the first user message
    if (message.role === "user") {
      const chatMessages = await this.getMessagesByChatId(message.chatId);
      if (chatMessages.length === 0) {
        const chat = await this.getChat(message.chatId);
        if (chat) {
          // Truncate long messages to a reasonable title length
          const title = message.content.length > 30 
            ? message.content.substring(0, 30) + "..." 
            : message.content;
          
          const updatedChat = { ...chat, title };
          this.chats.set(chat.id, updatedChat);
        }
      }
    }
    
    return message;
  }
  
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}

export const storage = new MemStorage();
