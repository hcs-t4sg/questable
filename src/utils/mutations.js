import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, arrayRemove, arrayUnion } from "firebase/firestore";
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

export async function addTask(classID, task, user) {
   // Update tasks collection
   const taskRef = await addDoc(collection(db, `classrooms/${classID}/tasks`), {
      name: task.name,
      description: task.description,
      reward: task.reward,
      created: Date.now(),
      due: task.due,
   });

   // Update assignedTasks collection for every member in class except teacher
   const docRef = doc(db, "classrooms", classID);
   const docSnap = await getDoc(docRef);

   if (docSnap.exists()) {
      var listOfPlayers = docSnap.data().playerList;
      for (var i = 0; i < listOfPlayers.length; i++) {
         if (listOfPlayers[i] != user.uid) {
            await addDoc(collection(db, `classrooms/${classID}/assignedTasks`), {
               player: listOfPlayers[i],
               assignedTask: taskRef.id,
            });
         }
      }
   } else {
   // doc.data() will be undefined in this case
   console.log("No such document!");
   }
}

// Remove player ID from completed array and add to confirmed array.
export async function confirmTask(classID, studentID, taskID){
   const classroomRef = doc(db, 'classrooms', classID)
   const classroomSnap = await getDoc(classroomRef)
   if (!classroomSnap.exists()) {
      return "Could not find classroom"
   }

   const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
   const taskSnap = await getDoc(taskRef)
   if(taskSnap.exists()) {
      updateDoc(taskRef, {
         completed: arrayRemove(studentID),
         confirmed: arrayUnion(studentID)
      })
   }
}

// Remove player ID from completed array.
export async function denyTask(classID, studentID, taskID){
   const classroomRef = doc(db, 'classrooms', classID)
   const classroomSnap = await getDoc(classroomRef)
   if (!classroomSnap.exists()) {
      // console.error("Could not find classroom")
      return "Could not find classroom"
   }
   const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
   const taskSnap = await getDoc(taskRef)
   if(taskSnap.exists()) {
      updateDoc(taskRef, {
         completed: arrayRemove(studentID)
      })
   }
}