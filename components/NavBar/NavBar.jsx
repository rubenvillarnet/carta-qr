import React from "react";
import Link from "next/link";
import { logout } from "../../firebase/auth";
import { useUser } from "../../context/userContext";

export default function NavBar() {
  const { user } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      {user && <p>Hola, {user.name}</p>}
      <ul>
        <li>
          <Link href="/">Inicio</Link>
        </li>
        {!user ? (
          <>
            <li>
              <Link href="/iniciar-sesion">Iniciar sesión</Link>
            </li>
            <li>
              <Link href="/registro">Regístrate</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/mi-perfil">Mi perfil</Link>
            </li>
            <li>
              <span onClick={handleLogout}>Cerrar sesión</span>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}
