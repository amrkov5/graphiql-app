import { FirebaseError, initializeApp } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    return user;
  } catch (err: unknown) {
    const msg: string = (err as FirebaseError).message;
    throw new Error(msg);
  }
};

const getUserName = async (id: string) => {
  const usersCollectionRef = collection(db, 'users');
  const q = query(usersCollectionRef, where('uid', '==', id));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const userData = doc.data();
      return userData.displayName;
    } else {
      throw new Error("User hasn't been found");
    }
  } catch {
    throw new Error('DB Error');
  }
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      displayName: name,
      authProvider: 'local',
      email,
    });
    return user;
  } catch (err: unknown) {
    const msg: string = (err as FirebaseError).message;
    throw new Error(msg);
  }
};

const logout = async () => {
  try {
    const res = await signOut(auth);
  } catch (err: unknown) {
    const msg: string = (err as FirebaseError).message;
    throw new Error(msg);
  }
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  getUserName,
};
