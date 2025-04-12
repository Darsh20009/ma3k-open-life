import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertChatSchema, insertMessageSchema } from "@shared/schema";
import { generateAIResponse } from "./aiml";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // إعداد نظام المصادقة
  setupAuth(app);
  // Create a new chat
  app.post("/api/chats", async (req, res) => {
    try {
      const parsedData = insertChatSchema.parse(req.body);
      const chat = await storage.createChat(parsedData);
      res.json(chat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create chat" });
    }
  });

  // Get all chats
  app.get("/api/chats", async (req, res) => {
    try {
      const chats = await storage.getAllChats();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chats" });
    }
  });

  // Get a specific chat
  app.get("/api/chats/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }
      
      const chat = await storage.getChat(id);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      res.json(chat);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat" });
    }
  });

  // Create a new message
  app.post("/api/messages", async (req, res) => {
    try {
      const parsedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(parsedData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Get messages for a chat
  app.get("/api/chats/:id/messages", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }
      
      const messages = await storage.getMessagesByChatId(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // AI chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { chatId, message } = req.body;
      
      if (!chatId || !message) {
        return res.status(400).json({ message: "chatId and message are required" });
      }
      
      // Get chat history for context
      const chatHistory = await storage.getMessagesByChatId(chatId);
      
      // Generate AI response
      const aiResponse = await generateAIResponse(message, chatHistory);
      
      // Save the AI response
      const savedResponse = await storage.createMessage({
        chatId,
        content: aiResponse,
        role: "assistant"
      });
      
      res.json(savedResponse);
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ message: "Failed to generate AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
