import { ChakraProvider } from '@chakra-ui/react';
import NavBar from '../components/NavBar/NavBar';
import UserProvider from '../context/userContext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <UserProvider>
        <NavBar />
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
