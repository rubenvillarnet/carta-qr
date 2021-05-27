import { auth } from "./config";
import { createUserDocument } from "./user";

export const signup = async ({ name, email, password }) => {
  const resp = await auth.createUserWithEmailAndPassword(email, password);
  const { user } = resp;
  await user.updateProfile({ displayName: name });
  await createUserDocument(user);
  return user;
};

export const logout = () => {
  return auth.signOut();
};

export const login = async ({ email, password }) => {
  const resp = await auth.signInWithEmailAndPassword(email, password);

  return resp.user;
};
