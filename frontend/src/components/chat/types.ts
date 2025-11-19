export type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export type ChatState = {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
};

