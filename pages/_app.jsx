import { ChakraProvider } from '@chakra-ui/react';
import UserProvider from '../context/userContext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
