import { getUnixTime } from 'date-fns'
import { User } from 'firebase/auth'
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	increment,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore'
import { Classroom, Item, Player } from '../types'
import { db } from './firebase'

export async function syncUsers(user: User) {
	const userRef = doc(db, 'users', user.uid)
	const data = {
		email: user.email,
	}
	await setDoc(userRef, data, { merge: true })
}

// Create new classroom with user as teacher
export async function addClassroom(name: string, user: User) {
	// Update classrooms collection with new classroom
	const newClassroom = {
		name: name,
		playerList: [user.uid],
		teacherList: [user.uid],
		// studentList: [],
	}
	// NOTE: I made a slight change here. Instead of storing the teacher in the playersList,
	// I'm storing it in a separate field called teacher. This is because I want to be able to differntiate the classes
	// owned by each user easily when displaying "created classrooms."

	const classroomRef = await addDoc(collection(db, 'classrooms'), newClassroom)

	// Update created classroom with new player
	const newPlayerRef = doc(db, classroomRef.path + '/players', user.uid)
	await setDoc(newPlayerRef, {
		avatar: 0,
		money: 0,
		name: 'Adventurer',
		role: 'teacher',
		id: user.uid,
	})

	/* Update user's classrooms list. Not useful at the moment but we may keep
   for later. Don't delete for now */
	// const userRef = doc(db, 'users', user.uid);
	// await updateDoc(userRef, {
	//    classrooms: arrayUnion(classroomRef.id)
	// })

	return
}

// Get classrooms that the current user is in
export async function getClassrooms(user: User) {
	const q = query(collection(db, 'classrooms'), where('playerList', 'array-contains', user.uid))

	const querySnapshot = await getDocs(q)

	const classrooms = querySnapshot.docs.map((doc) => ({
		...doc.data(),
		id: doc.id,
	}))

	return classrooms
}

// Add user to existing classroom and set as student
export async function joinClassroom(classID: string, user: User) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)

	// Check if class exists
	if (!classroomSnap.exists()) {
		return 'Code invalid, please make sure you are entering the right code'
	}

	// Check if student already in class
	const classroomData = classroomSnap.data()
	const playerList = classroomData.playerList

	if (playerList.includes(user.uid)) {
		return 'You are already in this class!'
	}

	// Update classroom.playerList
	playerList.push(user.uid)
	// studentList.push(user.uid);
	await updateDoc(classroomRef, {
		playerList: playerList,
		// studentList: studentList
	})

	console.log('updated classroom playerList')

	// Update classroom with new player
	const newPlayerRef = doc(db, `classrooms/${classID}/players`, user.uid)
	await setDoc(newPlayerRef, {
		avatar: 0,
		money: 0,
		name: 'Adventurer',
		role: 'student',
		id: user.uid,
	})

	return 'Successfully joined ' + classroomData.name + '!'
}

// For a user in a classroom, return user's player data
export async function getPlayerData(classID: string, userID: string): Promise<Player | null> {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)

	if (!classroomSnap.exists()) {
		return null
	}

	const playerRef = doc(db, `classrooms/${classID}/players/${userID}`)
	const playerSnap = await getDoc(playerRef)

	if (playerSnap.exists()) {
		const playerData = { ...playerSnap.data(), id: playerSnap.id } as Player
		return playerData
	} else {
		return null
	}
}

export async function getUserData(userID: string) {
	const userRef = doc(db, `users/${userID}`)
	const userSnap = await getDoc(userRef)

	if (!userSnap.exists()) {
		return null
	}

	return userSnap.data()
}

// for a task, get the task data
export async function getTaskData(classID: string, taskID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)

	if (!classroomSnap.exists()) {
		return null
	}

	const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
	const taskSnap = await getDoc(taskRef)

	if (taskSnap.exists()) {
		const taskData = taskSnap.data()
		return taskData
	} else {
		return null
	}
}

// Mutation to handle task update
export async function updateTask(
	classroomID: string,
	task: {
		name: string
		due: number
		reward: number
		id: string
	},
) {
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${task.id}`), {
		name: task.name,
		due: task.due,
		reward: task.reward,
	})
}
// Mutation to update player data
export async function updatePlayer(
	userID: string,
	classroomID: string,
	newPlayer: {
		name: string
	},
) {
	const playerRef = doc(db, `classrooms/${classroomID}/players/${userID}`)

	await updateDoc(playerRef, {
		name: newPlayer.name,
	})
}

// Mutation to delete tasks
export async function deleteTask(classroomID: string, taskID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`))
}
// Mutation to delete repeatable
export async function deleteRepeatable(classroomID: string, repeatableID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`))
}

export async function completeTask(classroomID: string, taskID: string, playerID: string) {
	// Remove `playerID` from assigned array
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), {
		assigned: arrayRemove(playerID),
	})
	// Add `playerID` to completed array
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), {
		completed: arrayUnion(playerID),
	})

	const docRef = doc(db, `classrooms/${classroomID}/tasks/${taskID}/completionTimes/${playerID}`)
	// Add completion timestamp
	await setDoc(docRef, {
		time: serverTimestamp(),
	})
}

export async function completeRepeatable(
	classroomID: string,
	repeatableID: string,
	playerID: string,
) {
	const completionsDocRef = doc(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
	)
	const docSnap = await getDoc(completionsDocRef)
	if (!docSnap.exists()) {
		await setDoc(
			doc(
				db,
				`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
			),
			{
				completions: 0,
			},
		)
	}
	// increment completions
	const prev = await docSnap.data()
	console.log(prev)
	updateDoc(
		doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`),
		{
			completions: increment(1),
		},
	)
}

export async function addTask(
	classID: string,
	task: {
		name: string
		description: string
		reward: number
		due: number
	},
	teacherID: string,
) {
	// Update assignedTasks collection for every member in class except teacher
	const classRef = doc(db, 'classrooms', classID)
	const classSnap = await getDoc(classRef)

	if (!classSnap.exists()) {
		// doc.data() will be undefined in this case
		return 'No such document!'
	}

	// Update tasks collection
	await addDoc(collection(db, `classrooms/${classID}/tasks`), {
		name: task.name,
		description: task.description,
		reward: task.reward,
		created: getUnixTime(new Date()),
		due: task.due,
		assigned: classSnap.data().playerList.filter((id: string) => id !== teacherID), // filter out the teacher's id
		completed: [],
		confirmed: [],
	})
}

export async function addRepeatable(
	classID: string,
	repeatable: {
		name: string
		description: string
		reward: number
		maxCompletions: number
	},
	teacherID: string,
) {
	// Update assignedTasks collection for every member in class except teacher
	const classRef = doc(db, 'classrooms', classID)
	const classSnap = await getDoc(classRef)

	if (!classSnap.exists()) {
		// doc.data() will be undefined in this case
		return 'No such document!'
	}

	// Update tasks collection
	const repeatableRef = await addDoc(collection(db, `classrooms/${classID}/repeatables`), {
		name: repeatable.name,
		description: repeatable.description,
		reward: repeatable.reward,
		created: getUnixTime(new Date()),
		maxCompletions: repeatable.maxCompletions,
		assigned: classSnap.data().playerList.filter((id: string) => id !== teacherID), // filter out the teacher's id
	})

	// add subcollections
	// ! When Cole implemented this it was task.classSnap.data()... but I removed the task field becuase I figured it was a bug. Possibly take a second look at this
	classSnap
		.data()
		.playerList.filter((playerID: string) => playerID !== teacherID)
		.forEach(async (playerID: string) => {
			await addDoc(
				collection(db, `classrooms/${classID}/repeatables/${repeatableRef.id}/lastRefresh`),
				{
					id: playerID,
					// Set lastRefresh to most recent Sunday Midnight instead
					lastRefresh: getSunday(),
				},
			)
			await addDoc(
				collection(db, `classrooms/${classID}/repeatables/${repeatableRef.id}/playerCompletions`),
				{
					id: playerID,
					completions: 0,
				},
			)
		})
}

// Remove player ID from completed array and add to confirmed array.
export async function confirmTask(classID: string, studentID: string, taskID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}

	const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
	const taskSnap = await getDoc(taskRef)
	if (taskSnap.exists()) {
		updateDoc(taskRef, {
			completed: arrayRemove(studentID),
			confirmed: arrayUnion(studentID),
		})
	}

	const playerRef = doc(db, `classrooms/${classID}/players/${studentID}`)
	const playerSnap = await getDoc(playerRef)
	if (playerSnap.exists() && taskSnap.exists()) {
		updateDoc(playerRef, {
			money: parseInt(playerSnap.data().money + taskSnap.data().reward),
		})
	}
}

// Remove player ID from completed array and add to assigned array.
export async function denyTask(classID: string, studentID: string, taskID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		// console.error("Could not find classroom")
		return 'Could not find classroom'
	}
	const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
	const taskSnap = await getDoc(taskRef)
	if (taskSnap.exists()) {
		updateDoc(taskRef, {
			completed: arrayRemove(studentID),
			assigned: arrayUnion(studentID),
		})
	}
}

export async function purchaseItem(classID: string, studentID: string, item: Item) {
	// isCustom should be a boolean denoting whether the item being purchased is an item created for a particular classroom/
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}
	const playerRef = doc(db, `classrooms/${classID}/players/${studentID}`)
	const playerSnap = await getDoc(playerRef)
	if (playerSnap.exists()) {
		const balance = playerSnap.data().money

		const inv = collection(db, `classrooms/${classID}/players/${studentID}/inventory`)
		const invSnapshot = (await getDocs(inv)).docs

		for (const i in invSnapshot) {
			if (
				invSnapshot[i].data().itemId === item.id &&
				invSnapshot[i].data().type === item.type &&
				(!invSnapshot[i].data().subtype || invSnapshot[i].data().subtype === item.subtype)
			) {
				return 'Already owned!'
			}
		}

		if (balance < item.price) {
			return 'Not enough money!'
		}

		const newItem = {
			itemId: item.id,
			type: item.type,
			subtype: item.subtype || null,
		}

		await addDoc(inv, newItem)

		await updateDoc(playerRef, {
			money: playerSnap.data().money - item.price,
		})

		return 'Success!'
	}
}

// Mutation to add Pin
export async function addPin(userID: string, classID: string) {
	console.log(userID)
	console.log(classID)
	const userRef = doc(db, `users/${userID}`)
	const pinnedSnap = await getDoc(userRef)
	if (pinnedSnap.exists()) {
		const pinnedClassrooms = pinnedSnap.data().pinned
		if (pinnedClassrooms) {
			pinnedClassrooms.push(classID)
			console.log(pinnedClassrooms)
			updateDoc(userRef, {
				pinned: pinnedClassrooms,
			})
		} else {
			updateDoc(userRef, {
				pinned: [classID],
			})
		}
	}
}

// Mutation to delete Pin
export async function deletePin(userID: string, classID: string) {
	const userRef = doc(db, `users/${userID}`)
	const pinnedSnap = await getDoc(userRef)
	if (pinnedSnap.exists()) {
		const pinned = pinnedSnap.data().pinned
		const index = pinned.indexOf(classID)
		if (index > -1) {
			pinned.splice(index, 1)
		}
		if (pinnedSnap.exists()) {
			updateDoc(userRef, {
				pinned: pinned,
			})
		}
	}
}

// Mutation to deny repeatable completion
export async function denyRepeatable(classroomID: string, playerID: string, repeatableID: string) {
	const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
	const repeatableSnap = await getDoc(repeatableRef)
	if (repeatableSnap.exists()) {
		const completionsRef = doc(
			db,
			`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
		)
		const completionsSnap = await getDoc(completionsRef)
		if (completionsSnap.exists() && completionsSnap.data().completions > 0) {
			updateDoc(completionsRef, {
				completions: increment(-1),
			})
		}
	}
}

// Mutation to confirm repeatable completion
export async function confirmRepeatable(
	classroomID: string,
	playerID: string,
	repeatableID: string,
) {
	console.log('confirming repeatable')
	const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
	const repeatableSnap = await getDoc(repeatableRef)
	if (repeatableSnap.exists()) {
		// increment confirmations
		const confirmationsRef = doc(
			db,
			`classrooms/${classroomID}/repeatables/${repeatableID}/playerConfirmations/${playerID}`,
		)
		const confirmationsSnap = await getDoc(confirmationsRef)
		if (!confirmationsSnap.exists()) {
			await setDoc(confirmationsRef, {
				confirmations: 1,
			})
		} else {
			updateDoc(confirmationsRef, {
				confirmations: increment(1),
			})
		}

		// decrement completions
		const completionsRef = doc(
			db,
			`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
		)
		const completionsSnap = await getDoc(completionsRef)
		if (completionsSnap.exists() && completionsSnap.data().completions > 0) {
			updateDoc(completionsRef, {
				completions: increment(-1),
			})
		}

		// increment money
		const playerRef = doc(db, `classrooms/${classroomID}/players/${playerID}`)
		const playerSnap = await getDoc(playerRef)
		if (playerSnap.exists()) {
			updateDoc(playerRef, {
				money: parseInt(playerSnap.data().money + repeatableSnap.data().reward),
			})
		}

		// increment streaks
		const streaksRef = doc(
			db,
			`classrooms/${classroomID}/repeatables/${repeatableID}/streaks/${playerID}`,
		)
		const streaksSnap = await getDoc(streaksRef)
		if (!streaksSnap.exists()) {
			await setDoc(streaksRef, {
				streak: 1,
			})
		} else {
			updateDoc(streaksRef, {
				streak: increment(1),
			})
		}
	}
}

// Helper function to get last sunday
function getSunday() {
	const today = new Date()
	const day = today.getDay()
	const diff = today.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
	return new Date(today.setDate(diff))
}

// Mutation to refresh all repeatables for given classroom
export async function refreshAllRepeatables(classroomID: string, playerID: string) {
	const classroomRef = doc(db, 'classrooms', classroomID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}
	// refresh all repeatables
	const repeatablesRef = collection(db, `classrooms/${classroomID}/repeatables`)
	const repeatablesSnap = await getDocs(repeatablesRef)
	repeatablesSnap.forEach(async (repeatable) => {
		await refreshRepeatable(classroomID, playerID, repeatable.id)
	})
}

// Mutation to refresh repeatable
async function refreshRepeatable(classroomID: string, playerID: string, repeatableID: string) {
	const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
	const repeatableSnap = await getDoc(repeatableRef)

	if (repeatableSnap.exists()) {
		const lastRefreshRef = doc(
			db,
			`classrooms/${classroomID}/repeatables/${repeatableID}/lastRefresh/${playerID}`,
		)
		const lastRefreshSnap = await getDoc(lastRefreshRef)
		if (lastRefreshSnap.exists()) {
			// If more than a week has passed since last refresh
			if (lastRefreshSnap.data().lastRefresh >= getSunday()) {
				// 1. Set the player completions to 0
				const completionsRef = doc(
					db,
					`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
				)
				const completionsSnap = await getDoc(completionsRef)
				if (completionsSnap.exists()) {
					updateDoc(completionsRef, {
						completions: 0,
					})
				}

				// 2. Set the confirmations to 0
				const confirmationsRef = doc(
					db,
					`classrooms/${classroomID}/repeatables/${repeatableID}/playerConfirmations/${playerID}`,
				)
				const confirmationsSnap = await getDoc(confirmationsRef)
				if (confirmationsSnap.exists()) {
					updateDoc(confirmationsRef, {
						confirmations: 0,
					})
				}
			}
		}
	}
}

export async function updateAvatar(player: Player, newItem: Item, classroom: Classroom) {
	const playerRef = doc(db, `classrooms/${classroom.id}/players/${player.id}`)
	console.log(newItem)

	const newEquip =
		newItem.type === 'body'
			? {
					avaBody: newItem.id,
			  }
			: newItem.type === 'hair'
			? {
					avaHair: newItem.id,
					avaHairSubtype: newItem.subtype,
			  }
			: newItem.type === 'shirt'
			? {
					avaShirt: newItem.id,
			  }
			: newItem.type === 'pants'
			? {
					avaPants: newItem.id,
			  }
			: newItem.type === 'shoes'
			? {
					avaShoes: newItem.id,
			  }
			: null
	if (newEquip) {
		await updateDoc(playerRef, newEquip)
		return `Successfully equipped ${newItem.name}!`
	}
	return 'There was an error equipping.'
}
