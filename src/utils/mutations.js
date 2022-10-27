import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where, arrayUnion } from "firebase/firestore";
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
      id: user.uid,
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
      id: user.uid,
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
      const playerData = { ...playerSnap.data(), id: playerSnap.id };
      return playerData
   } else {
      return null
   }
}


export async function getUserData(userID)
{
   const userRef = doc(db, `users/${userID}`);
   const userSnap = await getDoc(userRef);

   if(!userSnap.exists())
   {
      return null;
   }

   return userSnap.data();
}

//for a task, get the task data
export async function getTaskData(classID, taskID) {
   const classroomRef = doc(db, "classrooms", classID);
   const classroomSnap = await getDoc(classroomRef);

   if (!classroomSnap.exists()) {
      return null
   }

   const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`);
   const taskSnap = await getDoc(taskRef);

   if (taskSnap.exists()) {
      const taskData = taskSnap.data();
      return taskData
   } else {
      return null
   }
}

//Mutation to handle task update
export async function updateTask(classroomID, task) {
   await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${task.id}`), {
      name: task.name,
      due: task.due,
      reward: task.reward,
   });
}
// Mutation to update player data
export async function updatePlayer(userID, classroomID, newPlayer) {
   const playerRef = doc(db, `classrooms/${classroomID}/players/${userID}`)

   await updateDoc(playerRef, {
      name: newPlayer.name,
      avatar: newPlayer.avatar
 })
}

//Mutation to delete tasks
export async function deleteTask(classroomID, taskID) {
   await deleteDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`));
}

export async function completeTask(classroomID, taskID, playerID) {
   // Add `playerID` to completed array
   console.log(taskID)
   await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), { completed: arrayUnion(playerID) });
   // Remove `playerID` from assigned array
   await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), { assigned: arrayRemove(playerID) });
}

export async function addTask(classID, task, teacherID) {
   // Update assignedTasks collection for every member in class except teacher
   const classRef = doc(db, "classrooms", classID);
   const classSnap = await getDoc(classRef);

   if (!classSnap.exists()) {
      // doc.data() will be undefined in this case
      return "No such document!"
   }

   console.log(task);

   // Update tasks collection
   await addDoc(collection(db, `classrooms/${classID}/tasks`), {
      name: task.name,
      description: task.description,
      reward: parseInt(task.reward),
      created: Date.now(),
      due: task.date,
      assigned: classSnap.data().playerList.filter((id)=>(id !== teacherID)), // filter out the teacher's id
      completed: [],
      confirmed: []
   });

}

// Remove player ID from completed array and add to confirmed array.
export async function confirmTask(classID, studentID, taskID) {
   const classroomRef = doc(db, 'classrooms', classID)
   const classroomSnap = await getDoc(classroomRef)
   if (!classroomSnap.exists()) {
      return "Could not find classroom"
   }

   const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
   const taskSnap = await getDoc(taskRef)
   if (taskSnap.exists()) {
      updateDoc(taskRef, {
         completed: arrayRemove(studentID),
         confirmed: arrayUnion(studentID)
      })
   }

   const playerRef = doc(db, `classrooms/${classID}/players/${studentID}`)
   const playerSnap = await getDoc(playerRef)
   if (playerSnap.exists()) {
      updateDoc(playerRef, {
         money: parseInt(playerSnap.data().money + taskSnap.data().reward)
      })
   }
}

// Remove player ID from completed array and add to assigned array.
export async function denyTask(classID, studentID, taskID) {
   const classroomRef = doc(db, 'classrooms', classID)
   const classroomSnap = await getDoc(classroomRef)
   if (!classroomSnap.exists()) {
      // console.error("Could not find classroom")
      return "Could not find classroom"
   }
   const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
   const taskSnap = await getDoc(taskRef)
   if (taskSnap.exists()) {
      updateDoc(taskRef, {
         completed: arrayRemove(studentID),
         assigned: arrayUnion(studentID)
      })
   }
}