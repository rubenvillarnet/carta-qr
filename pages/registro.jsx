import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading
} from '@chakra-ui/react';

import { signup } from '../firebase/auth';
import { useUser } from '../context/userContext';

export default function RegistroPage() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser, user, loadingUser } = useUser();

  const onSubmit = async (values) => {
    setIsLoading(true);
    let newUser;
    try {
      newUser = await signup(values);
      reset();
    } catch (error) {
      console.log(error);
    }
    if (newUser) {
      const { uid, email, displayName } = newUser;
      setUser({
        uid,
        email,
        name: displayName
      });
      router.push(`/mi-perfil`);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && user) {
      router.push('/mi-perfil');
    }
  }, [loadingUser, user, router]);

  if (loadingUser) {
    return <p>Cargando...</p>;
  }
  return (
    <Flex minH='100vh' align='center' justify='center' bg='gray.50'>
      <Stack spacing={8} mx='auto' maxW='lg' minW='sm' py={12} px={6}>
        <Stack align='center'>
          <Heading fontSize='4xl'>Regístrate</Heading>
        </Stack>
        <Box rounded='lg' bg='white' boxShadow='lg' p={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id='email'>
                <FormLabel>Nombre</FormLabel>
                <Input type='text' {...register('name')} />
              </FormControl>
              <FormControl id='email'>
                <FormLabel>Correo electrónico</FormLabel>
                <Input type='email' {...register('email')} />
              </FormControl>
              <FormControl id='password'>
                <FormLabel>Contraseña</FormLabel>
                <Input type='password' {...register('password')} />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  type='submit'
                  bg='blue.400'
                  color='white'
                  _hover={{
                    bg: 'blue.500'
                  }}
                >
                  Enviar
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
