import { Flex, VStack, useColorModeValue } from '@chakra-ui/react';
import { Nav } from './components/Nav/Nav';
import Footer from './components/Footer';
import { Home } from './pages/home/Home';
import { Outlet } from 'react-router-dom';
import './global.css';

export const App = () => (
  <Flex
    flex={1}
    direction="column"
    bgGradient={useColorModeValue(
      'linear(to-r, purple.100, white, purple.100)',
      'linear(to-r, gray.800, blackAlpha.900, gray.800)'
    )}
  >
    <Nav></Nav>
    <Outlet />
    <Footer />
  </Flex>
);
