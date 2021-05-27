import React from 'react';
import Error from 'next/error';
import {
  Box,
  Flex,
  Heading,
  Container,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';

import { firestore } from '../firebase/config';
import { toSlug } from '../lib/utils';

export default function BusinessPage({ business, errorCode }) {
  const { name, description, items = {}, categories } = business || {};
  if (errorCode) {
    if (errorCode) {
      return <Error statusCode={errorCode} />;
    }
  }
  return (
    <Container maxW='3xl' mt='2'>
      <Box bg='green.400' p='4' mb='6' borderRadius='lg'>
        <Heading
          fontWeight={600}
          fontSize='2xl'
          lineHeight='150%'
          textAlign='center'
          color='white'
        >
          {name}
        </Heading>
        <Text color='white' textAlign='center'>
          {description}
        </Text>
      </Box>
      <Accordion defaultIndex={[0]} allowMultiple>
        {categories?.map(
          (category) =>
            items[toSlug(category)] && (
              <AccordionItem
                mb='4'
                borderWidth='1px'
                borderRadius='lg'
                p='4'
                shadow='lg'
              >
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      {category} ({items[toSlug(category)].length})
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {items[toSlug(category)].map((item) => (
                    <Box
                      borderBottom='1px'
                      borderColor='gray.400'
                      mb='4'
                      pb='4'
                    >
                      <Flex
                        justifyContent='space-between'
                        w='100%'
                        alignItems='flex-start'
                      >
                        <Heading fontSize='md'>{item.name}</Heading>
                        <Text fontSize='lg' color='blue.600' fontWeight='bold'>
                          {item.price}€
                        </Text>
                      </Flex>

                      {item.description && (
                        <Text color='gray.400'>{item.description}</Text>
                      )}
                    </Box>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            )
        )}
      </Accordion>
    </Container>
  );
}

export async function getServerSideProps({ query, res }) {
  const { slug } = query;
  const docRef = firestore.collection('businesses').doc(slug);
  const business = await docRef.get();
  if (business.exists) {
    const { createdAt, updatedAt, ...rest } = business.data();
    return {
      props: { business: rest }
    };
  }
  res.statusCode = 404;
  return {
    props: {
      errorCode: 404,
      business: {}
    }
  };
}
