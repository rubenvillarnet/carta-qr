import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { signup } from "../firebase/auth";
import { useUser } from "../context/userContext";

export default function RegistroPage() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser, user, loadingUser } = useUser();

  const onSubmit = async (values) => {
    setIsLoading(true);
    let newUser;
    try {
      newUser = await signup(values);
      reset();
    } catch (error) {
      console.log(error);
    }
    if (newUser) {
      const { uid, email, displayName } = newUser;
      setUser({
        uid,
        email,
        name: displayName,
      });
      router.push(`/mi-perfil`);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && user) {
      router.push("/mi-perfil");
    }
  }, [loadingUser, user]);

  if (loadingUser) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Regístrate</h1>
      {isLoading && <p>Enviando...</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Nombre
          <input type="text" {...register("name")} />
        </label>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Correo electrónico
          <input type="email" {...register("email")} />
        </label>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Contraseña
          <input type="password" {...register("password")} />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
