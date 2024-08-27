import { FirebaseError, initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
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
  apiKey: 'AIzaSyAAIbETc6OqC7IIaTTszwxTzv7s38fHE_M',
  authDomain: 'api-client-17877.firebaseapp.com',
  projectId: 'api-client-17877',
  storageBucket: 'api-client-17877.appspot.com',
  messagingSenderId: '732007876387',
  appId: '1:732007876387:web:6baa334cd75664deff2e96',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  // try {
  await signInWithEmailAndPassword(auth, email, password);
  //   } catch (err) {
  //     console.error(err);
  //     alert((err as FirebaseError).message);
  //   }
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
  } catch (err) {
    console.error(err);
    alert((err as FirebaseError).message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  getUserName,
};
