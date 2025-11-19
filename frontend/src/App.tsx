import { Box } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import RestaurantBookingPage from "./pages/RestaurantBookingPage";
import RestaurantListingPage from "./pages/RestaurantListingPage";
import RestaurantRegistrationPage from "./pages/RestaurantRegistrationPage";
import { ChatProvider, useChat } from "./contexts/ChatContext";
import ChatPanel from "./components/chat/ChatPanel";
import FloatingActionButton from "./components/chat/FloatingActionButton";

const AppContent = () => {
  const { isOpen, messages, isLoading, openChat, closeChat, sendMessage } = useChat();

  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" width="100%">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/booking" element={<RestaurantBookingPage />} />
          <Route path="/restaurants" element={<RestaurantListingPage />} />
          <Route path="/register" element={<RestaurantRegistrationPage />} />
        </Routes>
      </Box>
      <Footer />
      <FloatingActionButton onClick={openChat} isOpen={isOpen} />
      <ChatPanel
        isOpen={isOpen}
        messages={messages}
        isLoading={isLoading}
        onClose={closeChat}
        onSendMessage={sendMessage}
      />
    </Box>
  );
};

const App = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default App;