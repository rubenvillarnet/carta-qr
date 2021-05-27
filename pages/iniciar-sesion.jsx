import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { login } from "../firebase/auth";
import { useUser } from "../context/userContext";

export default function IniciarSesionPage() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setLoadingUser, user, loadingUser } = useUser();

  const onSubmit = async (values) => {
    setIsLoading(true);
    let user;
    try {
      user = await login(values);
      reset();
    } catch (error) {
      console.log(error);
    }
    if (user.uid) {
      setLoadingUser(true);
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
      <h1>Iniciar sesión</h1>
      {isLoading && <p>Enviando...</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
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
