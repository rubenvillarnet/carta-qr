import React from 'react';
import NextLink from 'next/link';
import { Flex, Text, HStack, Button, Box, Link } from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';

import { logout } from '../../firebase/auth';
import { useUser } from '../../context/userContext';

export default function NavBar() {
  const { user } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <Flex
      as='nav'
      justify='space-between'
      padding={4}
      borderBottom={1}
      borderStyle='solid'
      borderColor='gray.200'
    >
      {user ? (
        <Text color='gray.800'>Hola, {user.name}</Text>
      ) : (
        <Link as={NextLink} href='/' color='gray.800' fontSize='2rem'>
          CartaQR
        </Link>
      )}
      <HStack spacing='1rem'>
        {!user ? (
          <>
            <Text color='gray.800'>
              <Link as={NextLink} href='/iniciar-sesion'>
                Iniciar sesión
              </Link>
            </Text>
            <Button bg='blue.400' color='white' _hover={{ bg: 'blue.300' }}>
              <Link as={NextLink} href='/registro'>
                Regístrate
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Text color='gray.800'>
              <Link as={NextLink} href='/mi-perfil'>
                Mi perfil
              </Link>
            </Text>
            <Text color='red'>
              <button type='button' onClick={handleLogout}>
                Cerrar sesión
              </button>
            </Text>
          </>
        )}
      </HStack>
    </Flex>
  );
}
