import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc, arrayUnion, query, where, getDocs, getDoc } from "firebase/firestore";

export async function syncUsers(user) {
   const userRef = doc(db, 'users', user.uid);
   const data = {
      email: user.email
   }
   await setDoc(userRef, data, { merge: true });
}

export async function addClassroom(name, user) {

   // Update classrooms collection with new classroom
   const newClassroom = {
      name: name,
      playerList: [user.uid],
   }
   const classroomRef = await addDoc(collection(db, "classrooms"), newClassroom);

   // Update created classroom with new player
   const classroomPlayersRef = collection(classroomRef, "players");
   await addDoc(classroomPlayersRef, {
      avatar: 0,
      money: 0,
      name: "Adventurer",
      role: "teacher",
      user: user.uid
   });

   // Add ID of created classroom to user.classrooms in users collection
   const userRef = doc(db, 'users', user.uid);
   await updateDoc(userRef, {
      classrooms: arrayUnion(classroomRef.id)
   })

}

export async function getClassrooms(user) {
   const q = query(collection(db, "classrooms"), where("playerList", "array-contains", user.uid));

   const querySnapshot = await getDocs(q);

   const classrooms = querySnapshot.map(doc => ({ ...doc.data(), id: doc.id }));

   return classrooms;
}

export async function joinClassroom(classID, user) {

   const classroomRef = doc(db, "classrooms", classID);
   const classroomSnap = await getDoc(classroomRef);
   console.log(classroomSnap.data());
   // Check if class exists
   if (!classroomSnap.exists()) {
      return "Code invalid, please make sure you are entering the right code"
   }

   // Check if student already in class
   const classroomData = classroomSnap.data();
   let playerList = classroomData.playerList;

   if (playerList.includes(user.uid)) {
      return "You are already in this class!"
   }

   // Update classroom.playerList
   playerList.push(user.uid);
   await updateDoc(classroomRef, {
      playerList: playerList
   });

   console.log("updated classroom playerList");

   // Update classroom with new player
   const classroomPlayersRef = collection(classroomRef, "players");
   await addDoc(classroomPlayersRef, {
      avatar: 0,
      money: 0,
      name: "Adventurer",
      role: "student",
      user: user.uid
   });

   return "Successfully joined " + classroomData.name + "!"
}