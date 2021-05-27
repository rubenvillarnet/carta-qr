import { useRouter } from 'next/router';
import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import BusinessCreator from '../components/BusinessCreator/BusinessCreator';
import BusinessEditor from '../components/BusinessEditor/BusinessEditor';
import { useUser } from '../context/userContext';
import { firestore } from '../firebase/config';

export default function MiPerfilPage() {
  const { user, loadingUser } = useUser();
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [businessToEdit, setBusinessToEdit] = useState(null);
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

  const handleEditBusiness = (slug) => {
    setBusinessToEdit(slug);
  };

  const handleCloseEditor = () => {
    setBusinessToEdit(null);
  };

  const handleRemoveBusiness = async (slug) => {
    setIsLoading(true);
    try {
      await firestore.collection('businesses').doc(slug).delete();
      setBusinesses(businesses.filter((item) => item.slug !== slug));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingUser || isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <Container maxW='3xl' mt='9'>
      <h1>Mi perfil</h1>
      <p>Nombre: {user?.name}</p>
      <p>Correo electrónico: {user?.email}</p>
      {businesses?.length ? (
        businesses.map((item) => (
          <div key={item.slug}>
            <p>{item.name}</p>
            <p>
              <a
                href={`${process.env.NEXT_PUBLIC_HOSTNAME}/${item.slug}`}
                target='_blank'
                rel='noreferrer'
              >
                {process.env.NEXT_PUBLIC_HOSTNAME}/{item.slug}
              </a>
            </p>
            <QRCode
              value={`${process.env.NEXT_PUBLIC_HOSTNAME}/${item.slug}`}
              size={256}
            />
            <p>{item.description}</p>
            {!businessToEdit && (
              <div>
                <button
                  type='button'
                  onClick={() => handleEditBusiness(item.slug)}
                >
                  Editar
                </button>
                <button
                  type='button'
                  onClick={() => handleRemoveBusiness(item.slug)}
                >
                  X
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <BusinessCreator handleAddBusiness={handleAddBusiness} />
      )}
      {businessToEdit && (
        <BusinessEditor slug={businessToEdit} handleClose={handleCloseEditor} />
      )}
    </Container>
  );
}
