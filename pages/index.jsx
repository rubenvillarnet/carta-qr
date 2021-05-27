import Head from 'next/head';
import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Carta QR</title>
        <meta name='description' content='Carta QR' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container maxW='3xl'>
        <Stack
          as={Box}
          textAlign='center'
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight='110%'
          >
            Crea tu carta QR <br />
            <Text as='span' color='blue.400'>
              en minutos
            </Text>
          </Heading>
          <Text color='gray.500'>
            Sólo tienes que crear tu cuenta, añadir los platos de carta,
            descargar el código QR, ¡y listo!
          </Text>
          <Stack
            direction='column'
            spacing={3}
            align='center'
            alignSelf='center'
            position='relative'
          >
            <Button
              colorScheme='blue'
              bg='blue.400'
              px={6}
              _hover={{
                bg: 'blue.500'
              }}
            >
              <Link href='/registro'>Regístrate</Link>
            </Button>
            <Button variant='link' colorScheme='blue' size='sm'>
              <Link href='/iniciar-sesion'>O inicia sesión</Link>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
