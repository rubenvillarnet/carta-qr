import { useState, useEffect, createContext, useContext } from "react";
import { firestore, auth } from "../firebase/config";

export const UserContext = createContext();

export default function UserContextComp({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscriber = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const { uid } = user;
          const userDoc = await firestore.doc(`users/${uid}`).get();
          const { name, email } = userDoc.data();
          if (name && email) {
            setUser({ uid, name, email });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUser(false);
      }
    });

    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loadingUser, setLoadingUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
