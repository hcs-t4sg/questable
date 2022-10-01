import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from './firebase';

export async function syncUsers(user) {
   const userRef = doc(db, 'users', user.uid);
   const data = {
      email: user.email
   }
   await setDoc(userRef, data, { merge: true });
}

// Create new classroom with user as teacher
export async function addClassroom(name, user) {

   // Update classrooms collection with new classroom
   const newClassroom = {
      name: name,
      playerList: [user.uid],
   }
   const classroomRef = await addDoc(collection(db, "classrooms"), newClassroom);

   // Update created classroom with new player
   const newPlayerRef = doc(db, classroomRef.path + '/players', user.uid);
   await setDoc(newPlayerRef, {
      avatar: 0,
      money: 0,
      name: "Adventurer",
      role: "teacher",
   });

   /* Update user's classrooms list. Not useful at the moment but we may keep 
   for later. Don't delete for now */
   // const userRef = doc(db, 'users', user.uid);
   // await updateDoc(userRef, {
   //    classrooms: arrayUnion(classroomRef.id)
   // })

   return;
}

// Get classrooms that the current user is in
export async function getClassrooms(user) {

   const q = query(collection(db, "classrooms"), where("playerList", "array-contains", user.uid));

   const querySnapshot = await getDocs(q);

   const classrooms = querySnapshot.map(doc => ({ ...doc.data(), id: doc.id }));

   return classrooms;
}

// Add user to existing classroom and set as student
export async function joinClassroom(classID, user) {

   const classroomRef = doc(db, "classrooms", classID);
   const classroomSnap = await getDoc(classroomRef);

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
   const newPlayerRef = doc(db, `classrooms/${classID}/players`, user.uid);
   await setDoc(newPlayerRef, {
      avatar: 0,
      money: 0,
      name: "Adventurer",
      role: "student",
   });

   return "Successfully joined " + classroomData.name + "!"
}

// For a user in a classroom, return user's player data
export async function getPlayerData(classID, user) {

   const classroomRef = doc(db, "classrooms", classID);
   const classroomSnap = await getDoc(classroomRef);

   if (!classroomSnap.exists()) {
      return null
   }

   const playerRef = doc(db, `classrooms/${classID}/players/${user}`)
   const playerSnap = await getDoc(playerRef);

   if (playerSnap.exists()) {
      const playerData = playerSnap.data();
      return playerData
   } else {
      return null
   }
}

export async function updatePlayer(player, userID, classroomID, newPlayer) {
   const playerRef = doc(db, `classrooms/${classroomID}/players/${userID}`)
   const playerSnap = await getDoc(playerRef)

   await updateDoc(playerRef, {
      name: newPlayer.name,
      avatar: newPlayer.avatar,
      money: newPlayer.money,
      role: newPlayer.role,
   })
}