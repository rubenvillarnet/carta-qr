import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

import { useUser } from '../../context/userContext';
import NavBar from '../NavBar/NavBar';

export default function Layout({ children, loading }) {
  const { loadingUser } = useUser();

  if (loadingUser || loading) {
    return (
      <Center h='100vh'>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </Center>
    );
  }
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
