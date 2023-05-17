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
	Timestamp,
	updateDoc,
	where,
} from 'firebase/firestore'
import { Classroom, CompletionTime, ForumPost, Item, Player } from '../types'
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
		throw new Error('Code invalid, please make sure you are entering the right code')
	}

	// Check if student already in class
	const classroomData = classroomSnap.data()
	const playerList = classroomData.playerList

	if (playerList.includes(user.uid)) {
		throw new Error('You are already in this class!')
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
	// TODO remove useless avatar field
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

export async function getPlayerTaskCompletion(classID: string, taskID: string, playerID: string) {
	const completionTimeRef = doc(
		db,
		`classrooms/${classID}/tasks/${taskID}/completionTimes`,
		playerID,
	)
	const completionTimeSnap = await getDoc(completionTimeRef)
	if (completionTimeSnap.exists()) {
		const completionTime = completionTimeSnap.data().time
		return completionTime
	} else {
		return null
	}
}

// * Deprecated for now but may need later
// export async function getRepeatableCompletionCount(
// 	classID: string,
// 	repeatableID: string,
// 	playerID: string,
// ) {
// 	console.log(classID)
// 	console.log(repeatableID)
// 	console.log(playerID)
// 	const completionsRef = doc(
// 		db,
// 		`classrooms/${classID}/repeatables/${repeatableID}/playerCompletions`,
// 		playerID,
// 	)
// 	const completionsSnap = await getDoc(completionsRef)
// 	console.log('snap')
// 	console.log(completionsSnap)
// 	if (completionsSnap.exists()) {
// 		console.log('yeet')
// 		console.log(completionsSnap.data())
// 		const completionsData = completionsSnap.data().completions
// 		return completionsData
// 	} else {
// 		return null
// 	}
// }

export async function getRepeatableCompletionTimes(classroomID: string, repeatableID: string) {
	const completionTimesQuery = query(
		collection(db, `classrooms/${classroomID}/repeatables/${repeatableID}/completionTimes`),
	)
	const completionTimesSnap = await getDocs(completionTimesQuery)

	const completionTimes = completionTimesSnap.docs.map((doc) => ({
		...doc.data(),
		id: doc.id,
	}))

	return completionTimes as CompletionTime[]
}

// Mutation to handle task update
export async function updateTask(
	classroomID: string,
	task: {
		name: string
		description: string
		due: Timestamp
		reward: number
		id: string
	},
) {
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${task.id}`), {
		name: task.name,
		description: task.description,
		due: task.due,
		reward: task.reward,
	})
}

// Mutation to handle repeatable update
export async function updateRepeatable(
	classroomID: string,
	repeatable: {
		name: string
		description: string
		id: string
	},
) {
	await updateDoc(doc(db, `classrooms/${classroomID}/repeatables/${repeatable.id}`), {
		name: repeatable.name,
		description: repeatable.description,
	}).catch(console.error)
}

// Mutation to update player data
export async function updatePlayer(
	userID: string,
	classroomID: string,
	newPlayer: {
		name: string
	},
) {
	console.log(userID)
	console.log(classroomID)
	console.log(newPlayer)
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
	// Fetch repeatable and error if invalid repeatable ID
	const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
	const repeatableSnap = await getDoc(repeatableRef)
	if (!repeatableSnap.exists()) {
		throw new Error('Repeatable not found')
	}

	// Fetch player repeatable completions
	const completionsDocRef = doc(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
	)
	const completionsSnap = await getDoc(completionsDocRef)

	// Fetch player repeatable confirmations
	const confirmationsDocRef = doc(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/playerConfirmations/${playerID}`,
	)
	const confirmationsSnap = await getDoc(confirmationsDocRef)
	let confirmations
	if (confirmationsSnap.exists()) {
		confirmations = confirmationsSnap.data().confirmations ?? 0
	} else {
		confirmations = 0
	}

	if (completionsSnap.exists()) {
		// Error if max completions queued
		if (
			completionsSnap.data().completions + confirmations >=
			repeatableSnap.data().maxCompletions
		) {
			throw new Error('You have queued the maximum number of completions')
		}

		// Error if max completions have been confirmed
		if (confirmations >= repeatableSnap.data().maxCompletions) {
			throw new Error('The maximum number of completions has been confirmed by the teacher')
		}

		updateDoc(completionsDocRef, {
			completions: increment(1),
		})
	} else {
		await setDoc(completionsDocRef, {
			completions: 1,
		})
	}

	// Log the completion time
	const completionTimesRef = collection(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/completionTimes`,
	)
	addDoc(completionTimesRef, {
		playerID,
		time: serverTimestamp(),
	})

	// Increment the requestCount
	updateDoc(repeatableRef, {
		requestCount: increment(1),
	})
}

export async function addTask(
	classID: string,
	task: {
		name: string
		description: string
		reward: number
		due: Timestamp
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
		created: serverTimestamp(),
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
		created: serverTimestamp(),
		maxCompletions: repeatable.maxCompletions,
		assigned: classSnap.data().playerList.filter((id: string) => id !== teacherID), // filter out the teacher's id
		requestCount: 0,
	})

	// add subcollections
	// ! When Cole implemented this it was task.classSnap.data()... but I removed the task field becuase I figured it was a bug. Possibly take a second look at this
	classSnap
		.data()
		.playerList.filter((playerID: string) => playerID !== teacherID)
		.forEach(async (playerID: string) => {
			await setDoc(
				doc(db, `classrooms/${classID}/repeatables/${repeatableRef.id}/lastRefresh`, playerID),
				{
					// Set lastRefresh to most recent Sunday Midnight instead
					lastRefresh: lastSunday(),
				},
			)
			await setDoc(
				doc(
					db,
					`classrooms/${classID}/repeatables/${repeatableRef.id}/playerCompletions`,
					playerID,
				),
				{
					completions: 0,
				},
			)
			await setDoc(
				doc(
					db,
					`classrooms/${classID}/repeatables/${repeatableRef.id}/playerConfirmations`,
					playerID,
				),
				{
					confirmations: 0,
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
	// Update
	if (!playerSnap.exists()) {
		return 'Could not find player'
	} else {
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
export async function denyRepeatable(
	classroomID: string,
	playerID: string,
	repeatableID: string,
	completionTimeID: string,
) {
	// First refresh repeatable to obtain its most up to date version
	await refreshRepeatable(classroomID, playerID, repeatableID)

	const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
	const repeatableSnap = await getDoc(repeatableRef)

	if (!repeatableSnap.exists()) {
		return Error('Repeatable not found')
	}

	// Get the corresponding completion time
	const completionTimeRef = doc(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/completionTimes/${completionTimeID}`,
	)
	const completionTimeSnap = await getDoc(completionTimeRef)
	if (!completionTimeSnap.exists()) {
		return Error('Corresponding completion time not found')
	}

	// Decrement completions
	const completionsRef = doc(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
	)
	const completionsSnap = await getDoc(completionsRef)
	if (
		completionsSnap.exists() &&
		completionsSnap.data().completions > 0 &&
		completionTimeSnap.data().time.toDate() >= lastSunday()
	) {
		updateDoc(completionsRef, {
			completions: increment(-1),
		})
	}

	// Delete the corresponding completion time
	deleteDoc(completionTimeRef)

	// Decrement the requestCount
	updateDoc(repeatableRef, {
		requestCount: increment(-1),
	})
}

// TODO Rewrite confirm and deny repeatable so that they don't have to refetch the completion time, as it should already be passed in in the confirmation table
// Mutation to confirm repeatable completion
export async function confirmRepeatable(
	classroomID: string,
	playerID: string,
	repeatableID: string,
	completionTimeID: string,
) {
	// First refresh repeatable to obtain its most up to date version
	await refreshRepeatable(classroomID, playerID, repeatableID)

	console.log('confirming repeatable')
	const repeatableRef = doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`)
	const repeatableSnap = await getDoc(repeatableRef)

	if (!repeatableSnap.exists()) {
		return Error('Repeatable not found')
	}

	// Get the corresponding completion time
	const completionTimeRef = doc(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/completionTimes/${completionTimeID}`,
	)
	const completionTimeSnap = await getDoc(completionTimeRef)
	if (!completionTimeSnap.exists()) {
		return Error('Corresponding completion time not found')
	}

	// ! Time checking may not be accurate if lastSunday has not been rewritten
	// Confirmation and completion augmentation should only occur for repeatable completions in the current refresh cycle
	// ! Potential for confirmations and completions to fall out of sync here if completion is made at the exact moment of the refresh cycle turnover. Add a failsafe to maintain confirmations and completions? Or think more deeply about this logic?
	if (completionTimeSnap.data().time.toDate() >= lastSunday()) {
		// increment confirmations
		const confirmationsRef = doc(
			db,
			`classrooms/${classroomID}/repeatables/${repeatableID}/playerConfirmations/${playerID}`,
		)
		const confirmationsSnap = await getDoc(confirmationsRef)
		if (confirmationsSnap.exists()) {
			updateDoc(confirmationsRef, {
				confirmations: increment(1),
			})
		} else {
			setDoc(confirmationsRef, {
				confirmations: 1,
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
	}

	// increment money
	const playerRef = doc(db, `classrooms/${classroomID}/players/${playerID}`)
	const playerSnap = await getDoc(playerRef)
	if (playerSnap.exists()) {
		updateDoc(playerRef, {
			money: playerSnap.data().money + repeatableSnap.data().reward,
		})
	}

	// increment streaks
	const streaksRef = doc(
		db,
		`classrooms/${classroomID}/repeatables/${repeatableID}/streaks/${playerID}`,
	)
	const streaksSnap = await getDoc(streaksRef)
	if (!streaksSnap.exists()) {
		setDoc(streaksRef, {
			streak: 1,
		})
	} else {
		updateDoc(streaksRef, {
			streak: increment(1),
		})
	}

	// Remove the corresponding completion time
	deleteDoc(completionTimeRef)

	// Decrement the requestCount variable
	updateDoc(repeatableRef, {
		requestCount: increment(-1),
	})
}

// Helper function to get last sunday 11:59 in current timezone
function lastSunday() {
	const date = new Date()
	date.setDate(date.getDate() - date.getDay())
	date.setHours(0, 0, 0, 0)
	return date
}

// Mutation to refresh all repeatables for given classroom
export async function refreshAllRepeatables(classroomID: string, playerID: string) {
	const classroomRef = doc(db, 'classrooms', classroomID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}
	// refresh all repeatables to which player has been assigned
	const repeatablesQuery = query(
		collection(db, `classrooms/${classroomID}/repeatables`),
		where('assigned', 'array-contains', playerID),
	)
	const repeatablesSnap = await getDocs(repeatablesQuery)

	// TODO see if you can rewrite these calls to run in parallel
	await Promise.all(
		repeatablesSnap.docs.map(async (doc) => {
			await refreshRepeatable(classroomID, playerID, doc.id)
		}),
	)
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

		if (!lastRefreshSnap.exists()) {
			return Error('Last refresh not found')
		}

		// If more than a week has passed since last refresh
		// ! will need to check if this equality holds (account for imprecisions)
		// Should be < because if it's <=, then refresh will trigger every time (which is not desired)
		if (lastRefreshSnap.data().lastRefresh.toDate() < lastSunday()) {
			// 1. Set the player completions to 0
			const completionsRef = doc(
				db,
				`classrooms/${classroomID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
			)
			setDoc(completionsRef, {
				completions: 0,
			})

			// 2. Set the confirmations to 0
			const confirmationsRef = doc(
				db,
				`classrooms/${classroomID}/repeatables/${repeatableID}/playerConfirmations/${playerID}`,
			)
			setDoc(confirmationsRef, {
				confirmations: 0,
			})

			// Update the last refresh
			setDoc(lastRefreshRef, {
				lastRefresh: lastSunday(),
			})
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

export async function addForumPost(
	thread: {
		title: string
		postType: 0 | 1 | 2 | 3
		content: string
		author: Player
	},
	classroom: Classroom,
) {
	const classRef = collection(db, `classrooms/${classroom.id}/forumPosts`)
	await addDoc(classRef, {
		title: thread.title,
		postType: thread.postType,
		content: thread.content,
		author: thread.author.id,
		postTime: serverTimestamp(),
		likes: 0,
	})
	console.log('Successfully Added Thread')
}

export async function addComment(
	comment: {
		content: string
		author: Player
	},
	classroom: Classroom,
	forumPost: ForumPost,
) {
	const commentRef = collection(
		db,
		`classrooms/${classroom.id}/forumPosts/${forumPost.id}/comments`,
	)
	await addDoc(commentRef, {
		author: comment.author.id,
		content: comment.content,
		likes: 0,
		postTime: serverTimestamp(),
	})
}

export async function onboardClassroom(userID: string, classID: string) {
	console.log(userID)
	console.log(classID)
	const userRef = doc(db, `users/${userID}`)
	const onboardedSnap = await getDoc(userRef)

	// Add the classroom ID to the user's list of onboarded classrooms
	if (onboardedSnap.exists()) {
		const onboardedClassrooms = onboardedSnap.data().onboarded
		if (onboardedClassrooms) {
			onboardedClassrooms.push(classID)
			updateDoc(userRef, {
				onboarded: onboardedClassrooms,
			})
		} else {
			updateDoc(userRef, {
				onboarded: [classID],
			})
		}
	}
}
