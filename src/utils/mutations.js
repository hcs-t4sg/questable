import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where, arrayUnion, serverTimestamp, increment } from "firebase/firestore";
import { db } from './firebase';
import { getUnixTime } from 'date-fns';

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
      playerList: [],
      teacher: user.uid,
   }
   // NOTE: I made a slight change here. Instead of storing the teacher in the playersList,
   // I'm storing it in a separate field called teacher. This is because I want to be able to differntiate the classes
   // owned by each user easily when displaying "created classrooms."

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


export async function getUserData(userID) {
   const userRef = doc(db, `users/${userID}`);
   const userSnap = await getDoc(userRef);

   if (!userSnap.exists()) {
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
// Mutation to delete repeatable
export async function deleteRepeatable(classroomID, repeatableID) {
   await deleteDoc(doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`));
}

export async function completeTask(classroomID, taskID, playerID) {
   // Remove `playerID` from assigned array
   await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), { assigned: arrayRemove(playerID) });
   // Add `playerID` to completed array
   await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), { completed: arrayUnion(playerID) });

   const docRef = doc(db, `classrooms/${classroomID}/tasks/${taskID}/completionTimes/${playerID}`);
   // Add completion timestamp
   await setDoc(docRef, {
      time: serverTimestamp()
   })
}

export async function completeRepeatable(classroomID, repeatableID, playerID) {
   const completionsDocRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/completions/${playerID}`);
   const docSnap = await getDoc(completionsDocRef);
   if (!docSnap.exists()) {
      await setDoc(doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/completions/${playerID}`), {
         completions: 0
      });
   }
   // increment completions
   let prev = await docSnap.data();
   console.log(prev);
   updateDoc(doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/completions/${playerID}`), {
      completions: increment(1)
   })
}


export async function addTask(classID, task, teacherID) {
   // Update assignedTasks collection for every member in class except teacher
   const classRef = doc(db, "classrooms", classID);
   const classSnap = await getDoc(classRef);

   if (!classSnap.exists()) {
      // doc.data() will be undefined in this case
      return "No such document!"
   }

   // Update tasks collection
   await addDoc(collection(db, `classrooms/${classID}/tasks`), {
      name: task.name,
      description: task.description,
      reward: parseInt(task.reward),
      created: getUnixTime(new Date()),
      due: task.due,
      assigned: classSnap.data().playerList.filter((id) => (id !== teacherID)), // filter out the teacher's id
      completed: [],
      confirmed: []
   });

}

export async function addRepeatable(classID, task, teacherID) {
   // Update assignedTasks collection for every member in class except teacher
   const classRef = doc(db, "classrooms", classID);
   const classSnap = await getDoc(classRef);

   if (!classSnap.exists()) {
      // doc.data() will be undefined in this case
      return "No such document!"
   }


   // Update tasks collection
   const repeatableRef = await addDoc(collection(db, `classrooms/${classID}/repeatables`), {
      name: task.name,
      description: task.description,
      reward: parseInt(task.reward),
      created: getUnixTime(new Date()),
      maxCompletions: task.maxCompletions,
      assigned: classSnap.data().playerList.filter((id) => (id !== teacherID)), // filter out the teacher's id
   });

   // add subcollections
   task.classSnap.data().playerList.filter((id) => (id !== teacherID)).forEach(async (element) => {
      await addDoc(collection(db, `classrooms/${classID}/repeatables/${repeatableRef.id}/lastRefresh`), {
         id: element.id,
         // TODO Set lastRefresh to most recent Sunday Midnight instead
         lastRefresh: getUnixTime(new Date())
      });
      await addDoc(collection(db, `classrooms/${classID}/repeatables/${repeatableRef.id}/completions`), {
         id: element.id,
         completions: 0
      });
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

// Mutation to deny repeatable completion
export async function denyRepeatable(classroomID, playerID, repeatableID) {
   const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
   const repeatableSnap = await getDoc(repeatableRef)
   if (repeatableSnap.exists()) {

      const completionsRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/completions/${playerID}`);
      const completionsSnap = await getDoc(completionsRef);
      if (completionsSnap.exists() && completionsSnap.data().completions > 0) {
         updateDoc(completionsRef, {
            completions: increment(-1)
         })
      }
   }
}

// Mutation to confirm repeatable completion
export async function confirmRepeatable(classroomID, playerID, repeatableID) {
   console.log("confirming repeatable")
   const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
   const repeatableSnap = await getDoc(repeatableRef)
   if (repeatableSnap.exists()) {

      // TODO check that confirmations is less than MaxCompletions. If not satisfied, just return

      // increment confirmations
      const confirmationsRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/confirmations/${playerID}`);
      const confirmationsSnap = await getDoc(confirmationsRef);
      if (!confirmationsSnap.exists()) {
         await setDoc(confirmationsRef, {
            confirmations: 1
         })
      } else {
         updateDoc(confirmationsRef, {
            confirmations: increment(1)
         })
      }

      // decrement completions
      const completionsRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/completions/${playerID}`);
      const completionsSnap = await getDoc(completionsRef);
      if (completionsSnap.exists() && completionsSnap.data().completions > 0) {
         updateDoc(completionsRef, {
            completions: increment(-1)
         })
      }

      // increment money
      const playerRef = doc(db, `classrooms/${classroomID}/players/${playerID}`)
      const playerSnap = await getDoc(playerRef)
      if (playerSnap.exists()) {
         updateDoc(playerRef, {
            money: parseInt(playerSnap.data().money + repeatableSnap.data().reward)
         })
      }

      // increment streaks
      const streaksRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/streaks/${playerID}`);
      const streaksSnap = await getDoc(streaksRef);
      if (!streaksSnap.exists()) {
         await setDoc(streaksRef, {
            streak: 1
         })
      } else {
         updateDoc(streaksRef, {
            streak: increment(1)
         })
      }
   }
}


// Mutation to refresh repeatable
// TODO: ADD THIS FUNCTION
export async function refreshRepeatable(classroomID, playerID, repeatableID) {
   const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
   const repeatableSnap = await getDoc(repeatableRef)

   if (repeatableSnap.exists()) {
      const lastRefreshRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/lastRefresh/${playerID}`);
      const lastRefreshSnap = await getDoc(lastRefreshRef);

      // TODO If more than a week has passed since last refresh (the most recent sunday is not the last refresh), then:
      // 1. Set the player completions to 0
      // 2. Set the confirmations to 0





      // if (!lastRefreshSnap.exists()) {
      //    await setDoc(lastRefreshRef, {
      //       lastRefresh: getUnixTime(new Date())
      //    })
      // }

      // if (lastRefreshSnap.exists()) {
      //    updateDoc(lastRefreshRef, {
      //       lastRefresh: getUnixTime(new Date())
      //    })
      // }

   }
}