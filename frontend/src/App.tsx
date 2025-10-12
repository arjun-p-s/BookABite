import { Box } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" display="flex" alignItems="center" justifyContent="center">
        <LoginPage />
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
