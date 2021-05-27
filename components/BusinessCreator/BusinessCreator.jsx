import React, { useState } from 'react';
import {
  Input,
  Box,
  Button,
  Heading,
  Alert,
  AlertIcon,
  Collapse,
  FormControl,
  FormLabel,
  Textarea
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useUser } from '../../context/userContext';

import { firestore, serverTimestamp } from '../../firebase/config';
import { toSlug } from '../../lib/utils';

export default function BusinessCreator({ handleAddBusiness }) {
  const { register, handleSubmit, reset, watch } = useForm();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const watchName = watch('name');

  const onSubmit = async (values) => {
    setIsLoading(true);
    const { name, description } = values;
    const ref = firestore.collection('businesses').doc(toSlug(name));
    const data = {
      name,
      description,
      slug: toSlug(name),
      uid: user.uid,
      items: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    try {
      await ref.set(data);
      reset();
      handleAddBusiness(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading as='h3' size='lg' color='blue.500'>
        Añade tu negocio
      </Heading>
      {isLoading && <p>Enviando...</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb='4'>
          <FormLabel>Nombre</FormLabel>
          <Input type='text' {...register('name', { required: true })} />
        </FormControl>
        <Collapse in={watchName}>
          <Alert status='info' mt='2'>
            <AlertIcon />
            {watchName &&
              `${process.env.NEXT_PUBLIC_HOSTNAME}/${toSlug(watchName)}`}
          </Alert>
        </Collapse>
        <FormControl mb='4'>
          <FormLabel>Descripción</FormLabel>
          <Textarea type='text' {...register('description')} />
        </FormControl>
        <Button colorScheme='blue' type='submit'>
          Añadir
        </Button>
      </form>
    </Box>
  );
}
