import React, { useState } from 'react';
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
    <div>
      <h3>Añade tu negocio</h3>
      {isLoading && <p>Enviando...</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Nombre del negocio
          <input type='text' {...register('name')} />
          <textarea {...register('description')} cols='30' rows='10' />
          <div>
            {watchName &&
              `${process.env.NEXT_PUBLIC_HOSTNAME}/${toSlug(watchName)}`}
          </div>
          <button type='submit'>Añadir</button>
        </label>
      </form>
    </div>
  );
}
