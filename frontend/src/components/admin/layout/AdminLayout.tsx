import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar - Desktop */}
      <Box
        display={{ base: "none", lg: "block" }}
        w="240px"
        position="fixed"
        h="100vh"
        overflowY="auto"
      >
        <Sidebar onClose={onClose} />
      </Box>

      {/* Sidebar - Mobile (Drawer) */}
      <Box
        display={{ base: open ? "block" : "none", lg: "none" }}
        position="fixed"
        top={0}
        left={0}
        w="240px"
        h="100vh"
        bg="white"
        zIndex={20}
        boxShadow="xl"
      >
        <Sidebar onClose={onClose} />
      </Box>

      {/* Overlay for mobile */}
      {open && (
        <Box
          display={{ base: "block", lg: "none" }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={15}
          onClick={onClose}
        />
      )}

      {/* Main Content Area */}
      <Box
        ml={{ base: 0, lg: "240px" }}
        flex="1"
        display="flex"
        flexDirection="column"
      >
        <Topbar onMenuClick={onOpen} />
        <Box
          as="main"
          flex="1"
          p={{ base: 4, md: 6, lg: 8 }}
          bg="gray.50"
          overflowY="auto"
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;