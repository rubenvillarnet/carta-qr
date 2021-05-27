import React from 'react';
import Error from 'next/error';
import { firestore } from '../firebase/config';

export default function BusinessPage({ business, errorCode }) {
  if (errorCode) {
    if (errorCode) {
      return <Error statusCode={errorCode} />;
    }
  }
  return <pre>{JSON.stringify(business, null, 2)}</pre>;
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
