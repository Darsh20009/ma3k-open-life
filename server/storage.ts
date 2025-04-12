import { 
  type User, type InsertUser,
  type Chat, type InsertChat,
  type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createChat(chat: InsertChat): Promise<Chat>;
  getChat(id: number): Promise<Chat | undefined>;
  getAllChats(): Promise<Chat[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByChatId(chatId: number): Promise<Message[]>;
}

// تخزين بسيط في الذاكرة
export class MemoryStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private chats: Map<number, Chat> = new Map();
  private messages: Map<number, Message> = new Map();
  private nextUserId = 1;
  private nextChatId = 1;
  private nextMessageId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = { id: this.nextUserId++, ...user };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    const newChat = { id: this.nextChatId++, ...chat };
    this.chats.set(newChat.id, newChat);
    return newChat;
  }

  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async getAllChats(): Promise<Chat[]> {
    return Array.from(this.chats.values());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage = { id: this.nextMessageId++, ...message };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(msg => msg.chatId === chatId);
  }
}

// تصدير نسخة واحدة من التخزين
export const storage = new MemoryStorage();