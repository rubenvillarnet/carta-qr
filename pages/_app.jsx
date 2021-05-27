import NavBar from "../components/NavBar/NavBar";
import UserProvider from "../context/userContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <NavBar />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
