import React from 'react';
import Error from 'next/error';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';

import { firestore } from '../firebase/config';
import { toSlug } from '../lib/utils';

export default function BusinessPage({ business, errorCode }) {
  const { name, description, items = {}, categories } = business;
  if (errorCode) {
    if (errorCode) {
      return <Error statusCode={errorCode} />;
    }
  }
  return (
    <Container maxW='3xl' mt='9'>
      <Heading
        fontWeight={600}
        fontSize={{ base: 'xl', sm: '2xl', md: '4xl' }}
        lineHeight='150%'
      >
        {name}
      </Heading>
      <Text color='gray.700' mb={9}>
        {description}
      </Text>
      <Accordion defaultIndex={[0]} allowMultiple>
        {categories?.map(
          (category) =>
            items[toSlug(category)] && (
              <AccordionItem>
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
                    <Box>
                      <Heading fontSize='sm'>{item.name}</Heading>
                      <Text>{item.price}€</Text>
                      {item.description && <Text>{item.description}</Text>}
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
      errorCode: 404
    }
  };
}
