import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Box,
  Button,
  Heading,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  Flex,
  IconButton,
  Text,
  Alert,
  AlertIcon,
  Collapse,
  Select,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Center,
  HStack
} from '@chakra-ui/react';
import {
  AddIcon,
  CloseIcon,
  TriangleDownIcon,
  TriangleUpIcon
} from '@chakra-ui/icons';

import { firestore, arrayUnion, arrayRemove } from '../../firebase/config';
import { toSlug } from '../../lib/utils';
import DeletePopover from '../DeletePopover/DeletePopover';

export default function BusinessEditor({ slug, handleClose }) {
  const [business, setBusiness] = useState({});
  const [catInput, setCatInput] = useState('');
  const [isRepeated, setIsrepeated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (values) => {
    const { category, ...rest } = values;
    const newItem = {
      ...rest,
      uuid: uuidv4()
    };
    const updatedItems = { ...business.items };
    updatedItems[toSlug(category)] =
      business.items && business.items[toSlug(category)]
        ? [...business.items[toSlug(category)], newItem]
        : [newItem];
    const docRef = firestore.collection('businesses').doc(slug);
    docRef.update({
      items: updatedItems
    });
    reset();
  };

  const handleCatInputChange = (e) => {
    setIsrepeated(false);
    setCatInput(e.target.value);
  };

  const isEmpty = () => {
    let hasItems = false;
    business.categories?.forEach((category) => {
      if (
        business.items &&
        business.items[toSlug(category)] &&
        business.items[toSlug(category)].length
      ) {
        hasItems = true;
      }
    });
    return !hasItems;
  };

  const handleAddCategory = () => {
    if (
      business.categories?.find((item) => toSlug(item) === toSlug(catInput))
    ) {
      setIsrepeated(true);
      return;
    }
    const docRef = firestore.collection('businesses').doc(slug);
    docRef.update({
      categories: arrayUnion(catInput)
    });
    setCatInput('');
  };

  const handleRemoveCategory = (item) => {
    const docRef = firestore.collection('businesses').doc(slug);
    const updatedItems = { ...business.items };
    delete updatedItems[toSlug(item)];
    docRef.update({
      categories: arrayRemove(item),
      items: updatedItems
    });
  };

  const handleDeleteItem = (category, uuid) => {
    console.log({ category, uuid });
    const updatedItems = { ...business.items };
    const updatedCategory = updatedItems[toSlug(category)].filter(
      (item) => item.uuid !== uuid
    );
    updatedItems[toSlug(category)] = updatedCategory;
    const docRef = firestore.collection('businesses').doc(slug);
    docRef.update({
      items: updatedItems
    });
  };

  useEffect(() => {
    const docRef = firestore.collection('businesses').doc(slug);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        const docData = doc.data();
        setBusiness(docData);
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, [slug]);

  if (isLoading) {
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
    <Drawer isOpen={!!slug} placement='right' onClose={handleClose} size='full'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottom='1px' borderColor='gray.400' pb='2' mb='2'>
          Editar negocio
        </DrawerHeader>

        <DrawerBody>
          <Heading textAlign='center' size='lg' mb='6'>
            {business.name}
          </Heading>
          <Accordion allowMultiple>
            <AccordionItem
              borderWidth='1px'
              borderRadius='lg'
              p='4'
              shadow='lg'
              mb='6'
            >
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    Categorías ({business?.categories?.length || '0'})
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack align='start' mb='6'>
                  {business.categories?.map((item, idx) => (
                    <HStack key={item} spacing='0.5rem'>
                      <IconButton
                        size='xs'
                        type='button'
                        colorScheme='green'
                        icon={<TriangleUpIcon />}
                        disabled={idx === 0}
                      />
                      <IconButton
                        size='xs'
                        type='button'
                        colorScheme='green'
                        icon={<TriangleDownIcon />}
                        disabled={business.categories.length - 1 === idx}
                      />
                      <DeletePopover
                        title='Borrar categoría'
                        text='¿Seguro que quieres borrar la categoría? Esto
                            borrará también todos los platos de esta categoría.'
                        handleDelete={() => handleRemoveCategory(item)}
                      >
                        <Tag size='lg' colorScheme='blue' variant='outline'>
                          <TagLabel>{item}</TagLabel>
                          <TagCloseButton />
                        </Tag>
                      </DeletePopover>
                    </HStack>
                  ))}
                </VStack>
                <Text color='green' fontSize='xs'>
                  Añadir categoría
                </Text>
                <Flex>
                  <Input
                    type='text'
                    value={catInput}
                    borderTopRightRadius='0'
                    borderBottomRightRadius='0'
                    onChange={(e) => handleCatInputChange(e)}
                    isInvalid={isRepeated}
                    errorBorderColor='red.300'
                  />
                  <IconButton
                    type='button'
                    onClick={handleAddCategory}
                    disabled={!catInput}
                    colorScheme='green'
                    borderTopLeftRadius='0'
                    borderBottomLeftRadius='0'
                    icon={<AddIcon />}
                  />
                </Flex>
                <Collapse in={isRepeated}>
                  <Alert status='warning' mt='2'>
                    <AlertIcon />
                    Ya existe esa categoría
                  </Alert>
                </Collapse>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          {business.categories ? (
            <Box borderWidth='1px' borderRadius='lg' p='4' shadow='lg' mb='6'>
              <Heading
                size='md'
                as='h3'
                mb='4'
                borderBottom='1px'
                borderColor='gray.400'
                mx='-4'
                px='4'
              >
                Añadir plato
              </Heading>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mb='4'>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    placeholder='selecciona una categoría'
                    {...register('category', { required: true })}
                    defaultValue=''
                  >
                    {business.categories?.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mb='4'>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    type='text'
                    {...register('name', { required: true })}
                  />
                </FormControl>
                <FormControl mb='4'>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea type='text' {...register('description')} />
                </FormControl>
                <FormControl mb='4'>
                  <FormLabel>Precio</FormLabel>
                  <NumberInput precision={2}>
                    <NumberInputField
                      {...register('price', { required: true })}
                    />
                  </NumberInput>
                </FormControl>
                <Button w='100%' colorScheme='green' type='submit'>
                  Añadir
                </Button>
              </form>
            </Box>
          ) : (
            <Alert status='warning' mt='2' mb='6' borderRadius='lg'>
              <AlertIcon />
              Añade alguna categoría primero
            </Alert>
          )}
          {!isEmpty() && (
            <Box borderWidth='1px' borderRadius='lg' p='4' shadow='lg' mb='6'>
              <Heading
                size='md'
                as='h3'
                mb='4'
                borderBottom='1px'
                borderColor='gray.400'
                mx='-4'
                px='4'
              >
                Platos
              </Heading>
              <VStack align='start' mb='6'>
                {business.categories?.map((category) => {
                  if (business.items && business.items[toSlug(category)]) {
                    return (
                      <Box key={category} w='100%' mb='4'>
                        <Heading size='sm' as='h4' mb='4'>
                          {category}
                        </Heading>
                        {business.items[toSlug(category)].map((item) => (
                          <Box
                            borderBottom='1px'
                            borderColor='gray.400'
                            mb='4'
                            key={item.uuid}
                          >
                            <Flex
                              justifyContent='space-between'
                              w='100%'
                              alignItems='flex-start'
                            >
                              <DeletePopover
                                title='Borrar plato'
                                text='¿Seguro que quieres borrar este plato?'
                                handleDelete={() =>
                                  handleDeleteItem(category, item.uuid)
                                }
                              >
                                <IconButton
                                  size='xs'
                                  type='button'
                                  colorScheme='red'
                                  icon={<CloseIcon />}
                                  mr='4'
                                />
                              </DeletePopover>
                              <Heading size='sm' as='h5' mb='4' flex='1'>
                                {item.name}
                              </Heading>
                              <Text
                                fontSize='lg'
                                color='blue.600'
                                fontWeight='bold'
                              >
                                {item.price}€
                              </Text>
                            </Flex>
                            {item.description && (
                              <Text>{item.description}</Text>
                            )}
                          </Box>
                        ))}
                      </Box>
                    );
                  }
                  return <span key={category} />;
                })}
              </VStack>
            </Box>
          )}
          <Flex justify='flex-end'>
            <Button variant='outline' onClick={handleClose}>
              Cancelar
            </Button>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
