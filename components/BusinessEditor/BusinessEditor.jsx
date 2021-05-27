import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { firestore, arrayUnion, arrayRemove } from '../../firebase/config';
import { toSlug } from '../../lib/utils';

export default function BusinessEditor({ slug, handleClose }) {
  const [business, setBusiness] = useState({});
  const [catInput, setCatInput] = useState('');
  const [isRepeated, setIsrepeated] = useState(false);
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
    docRef.update({
      categories: arrayRemove(item)
    });
  };

  useEffect(() => {
    const docRef = firestore.collection('businesses').doc(slug);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        const docData = doc.data();
        setBusiness(docData);
      }
    });
    return unsubscribe;
  }, [slug]);
  return (
    <div>
      <hr />
      <button type='button' onClick={handleClose}>
        X
      </button>
      <h2>{business.name}</h2>
      <h4>Categorías</h4>
      <ul>
        {business.categories?.map((item) => (
          <li key={item}>
            {item}
            <button type='button' onClick={() => handleRemoveCategory(item)}>
              X
            </button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type='text'
          value={catInput}
          onChange={(e) => handleCatInputChange(e)}
        />
        <button type='button' onClick={handleAddCategory} disabled={!catInput}>
          Añadir categoría
        </button>
        {isRepeated && <p>Ya existe esa categoría</p>}
      </div>
      <hr />
      <h4>Platos</h4>
      {business.categories?.map((category) => {
        if (business.items && business.items[toSlug(category)]) {
          return (
            <div key={category}>
              <h5>{category}</h5>
              {business.items[toSlug(category)].map((item) => (
                <pre key={item.uuid}>{JSON.stringify(item, null, 2)}</pre>
              ))}
            </div>
          );
        }
        return '';
      })}
      <hr />
      {business.categories ? (
        <div>
          <h4>Añadir plato</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Categoría
              <select
                {...register('category', { required: true })}
                defaultValue=''
              >
                <option disabled value=''>
                  selecciona una categoría
                </option>
                {business.categories?.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nombre
              <input type='text' {...register('name', { required: true })} />
            </label>
            <label>
              Descripción
              <textarea type='text' {...register('description')} />
            </label>
            <label>
              Precio
              <input type='number' {...register('price', { required: true })} />
            </label>
            <button type='submit'>Añadir</button>
          </form>
        </div>
      ) : (
        <p>Añade alguna categoría primero</p>
      )}
    </div>
  );
}
