import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Link,
  ButtonGroup,
  useDisclosure
} from '@chakra-ui/react';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import BusinessCreator from '../components/BusinessCreator/BusinessCreator';
import BusinessEditor from '../components/BusinessEditor/BusinessEditor';
import { useUser } from '../context/userContext';
import { firestore } from '../firebase/config';
import Layout from '../components/Layout/Layout';

export default function MiPerfilPage() {
  const { user, loadingUser } = useUser();
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [businessToEdit, setBusinessToEdit] = useState(null);
  const [businessToRemove, setBusinessToRemove] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push('/iniciar-sesion');
    }
  }, [loadingUser, user, router]);

  useEffect(() => {
    async function getBusinesess() {
      if (user) {
        const ref = firestore
          .collection('businesses')
          .where('uid', '==', user.uid);
        try {
          const response = (await ref.get()).docs.map((doc) => doc.data());
          setBusinesses(response);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    getBusinesess();
  }, [user]);

  const handleAddBusiness = (newBusiness) => {
    setBusinesses([...businesses, newBusiness]);
  };

  const handleOpenDeleteModal = (slug) => setBusinessToRemove(slug);
  const handlCloseDeleteModal = () => setBusinessToRemove(null);

  const handleEditBusiness = (slug) => {
    setBusinessToEdit(slug);
  };

  const handleCloseEditor = () => {
    setBusinessToEdit(null);
  };

  const handleRemoveBusiness = async () => {
    setIsLoading(true);
    try {
      await firestore.collection('businesses').doc(businessToRemove).delete();
      setBusinesses(
        businesses.filter((item) => item.slug !== businessToRemove)
      );
      handlCloseDeleteModal();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout loading={isLoading}>
      <Container maxW='3xl' mt='9'>
        <Box
          borderBottom='1px'
          borderStyle='solid'
          borderColor='gray.300'
          py='2'
          mb='4'
        >
          <Heading as='h1' mb='4' fontSize='2xl' textAlign='center'>
            Mi perfil
          </Heading>
          <Text>
            <Text as='span' fontWeight='bold'>
              Nombre:
            </Text>{' '}
            {user?.name}
          </Text>
          <Text>
            <Text as='span' fontWeight='bold'>
              Correo electrónico:
            </Text>{' '}
            {user?.email}
          </Text>
        </Box>
        <Box>
          <Heading as='h3' mb='4' fontSize='xl'>
            Mis negocios
          </Heading>
        </Box>
        {businesses?.length ? (
          businesses.map((item) => (
            <Box
              key={item.slug}
              borderWidth='1px'
              borderRadius='lg'
              p='4'
              shadow='lg'
              mb='6'
            >
              <Heading as='h4' mb='2' fontSize='lg'>
                {item.name}
              </Heading>
              <Text color='gray.600'>{item.description}</Text>
              <Link
                href={`${process.env.NEXT_PUBLIC_HOSTNAME}/${item.slug}`}
                target='_blank'
                rel='noreferrer'
                color='blue.500'
              >
                {process.env.NEXT_PUBLIC_HOSTNAME}/{item.slug}
              </Link>
              <ButtonGroup my='6'>
                <Button
                  type='button'
                  onClick={() => handleEditBusiness(item.slug)}
                  colorScheme='blue'
                >
                  Editar
                </Button>
                <Button
                  type='button'
                  onClick={() => handleOpenDeleteModal(item.slug)}
                  colorScheme='red'
                >
                  Eliminar
                </Button>
              </ButtonGroup>
              <QRCode
                value={`${process.env.NEXT_PUBLIC_HOSTNAME}/${item.slug}`}
                size={512}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          ))
        ) : (
          <BusinessCreator handleAddBusiness={handleAddBusiness} />
        )}
        {businessToEdit && (
          <BusinessEditor
            slug={businessToEdit}
            handleClose={handleCloseEditor}
          />
        )}
      </Container>
      <Modal isOpen={!!businessToRemove} onClose={handlCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar negocio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              ¿Estás seguro de que quieres eliminar el negocio?. Esta acción no
              se puede deshacer
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleRemoveBusiness}>
              Eliminar
            </Button>
            <Button variant='ghost' onClick={handlCloseDeleteModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}
