import { Box } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import RestaurantBookingPage from "./pages/RestaurantBookingPage";

const App = () => {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" width="100%">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/booking" element={<RestaurantBookingPage />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;