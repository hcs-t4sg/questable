import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc, arrayUnion } from "firebase/firestore";

export async function syncUsers(user) {
   const userRef = doc(db, 'users', user.uid);
   const data = {
      email: user.email
   }
   await setDoc(userRef, data, { merge: true });
}

export async function addClassroom(name) {
   const newClassroom = {
      name: name,
   }

   const classroomRef = await addDoc(collection(db, "classrooms"), newClassroom);



}