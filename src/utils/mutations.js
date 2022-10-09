import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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
      const playerData = playerSnap.data();
      return playerData
   } else {
      return null
   }
}
//for a task, get the task data
export async function getTaskData(classID, taskID)
{
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
export async function updateTask(classroomID, task)
{  
   await updateDoc(doc(db, `classrooms/${classroomID}/tasks/task.id`), {
      name: task.name,
      due: task.due,
      reward: task.reward,
   });
}

//Mutation to delete tasks
export async function deleteTask(classroomID, taskID)
{
   await deleteDoc(doc(db, `classrooms/${classroomID}/tasks/taskID`));
}

export async function completeTask(classroomID, taskID, playerID)
{
   let task = await getTaskData(classroomID, taskID);
   console.log(task);
   //Remove the player from assigned task array
   task.assigned = task.assigned.filter((id) => {
      return id !== playerID; 
   });
   if(!task.completed.includes(playerID))
   {
      task.completed.push(playerID);
   }

   await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), task);
}