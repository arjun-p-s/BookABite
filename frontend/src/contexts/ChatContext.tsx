import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Message } from "../components/chat/types";

type ChatContextType = {
  open: boolean;
  messages: Message[];
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [open, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("menu") || lowerMessage.includes("food")) {
      return "Our menu features a variety of cuisines including Italian, Chinese, Indian, and more! Would you like to know about specific dishes or dietary options?";
    }
    if (lowerMessage.includes("reservation") || lowerMessage.includes("book") || lowerMessage.includes("table")) {
      return "I can help you book a table! Please let me know:\n- Number of guests\n- Preferred date and time\n- Any special requests (dietary restrictions, celebrations, etc.)";
    }
    if (lowerMessage.includes("hours") || lowerMessage.includes("open") || lowerMessage.includes("time")) {
      return "We're open Monday to Sunday from 11:00 AM to 11:00 PM. We also offer special hours for holidays - feel free to ask!";
    }
    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return "Our prices vary by dish and restaurant. Most main courses range from $15-$35. Would you like specific pricing for a particular dish?";
    }
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! 👋 I'm here to help you with reservations, menu questions, or anything else about BookaBite. What can I assist you with today?";
    }
    
    return "I'm here to help! You can ask me about:\n- Making reservations\n- Menu items and dietary options\n- Restaurant hours and locations\n- Special events and promotions\n\nWhat would you like to know?";
  };

  return (
    <ChatContext.Provider
      value={{
        open,
        messages,
        isLoading,
        openChat,
        closeChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

