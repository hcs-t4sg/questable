import {
	addDoc,
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
	writeBatch,
} from 'firebase/firestore'
import { CompletionTime, RepeatableCompletion } from '../../types'
import { db } from '../firebase'

// Helper function to get last sunday 11:59 in current timezone
function lastSunday() {
	const date = new Date()
	date.setDate(date.getDate() - date.getDay())
	date.setHours(0, 0, 0, 0)
	return date
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

// Mutation to delete repeatable
export async function deleteRepeatable(classroomID: string, repeatableID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/repeatables/${repeatableID}`))
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

// TODO Rewrite confirm and deny repeatable so that they don't have to refetch the completion time, as it should already be passed in in the confirmation table
// Mutation to confirm repeatable completion
export async function confirmRepeatables(repeatables: RepeatableCompletion[], classID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		// console.error("Could not find classroom")
		return 'Could not find classroom'
	}

	const batch = writeBatch(db)

	for (const i in repeatables) {
		const playerID = repeatables[i].player.id
		const repeatableID = repeatables[i].repeatable.id
		const completionTimeID = repeatables[i].id

		// First refresh repeatable to obtain its most up to date version
		await refreshRepeatable(classID, playerID, repeatableID)
		const repeatableRef = doc(db, `classrooms/${classID}/repeatables/${repeatableID}`)
		const repeatableSnap = await getDoc(repeatableRef)
		if (!repeatableSnap.exists()) {
			return Error('Repeatable not found')
		}

		// Get the corresponding completion time
		const completionTimeRef = doc(
			db,
			`classrooms/${classID}/repeatables/${repeatableID}/completionTimes/${completionTimeID}`,
		)
		const completionTimeSnap = await getDoc(completionTimeRef)
		if (!completionTimeSnap.exists()) {
			return Error('Corresponding completion time not found')
		}

		// ! Time checking may not be accurate if lastSunday has not been rewritten
		// Confirmation and completion augmentation should only occur for repeatable completions in the current refresh cycle
		if (completionTimeSnap.data().time.toDate() >= lastSunday()) {
			// increment confirmations
			const confirmationsRef = doc(
				db,
				`classrooms/${classID}/repeatables/${repeatableID}/playerConfirmations/${playerID}`,
			)
			const confirmationsSnap = await getDoc(confirmationsRef)
			if (confirmationsSnap.exists()) {
				batch.update(confirmationsRef, { confirmations: increment(1) })
			} else {
				batch.set(confirmationsRef, { confirmations: 1 })
			}

			// decrement completions
			const completionsRef = doc(
				db,
				`classrooms/${classID}/repeatables/${repeatableID}/playerCompletions/${playerID}`,
			)
			const completionsSnap = await getDoc(completionsRef)
			if (completionsSnap.exists() && completionsSnap.data().completions > 0) {
				batch.update(completionsRef, { completions: increment(-1) })
			}
		}

		const playerRef = doc(db, `classrooms/${classID}/players/${playerID}`)
		const playerSnap = await getDoc(playerRef)
		if (playerSnap.exists()) {
			batch.update(playerRef, {
				money: increment(repeatableSnap.data().reward),
				xp: increment(repeatableSnap.data().reward),
			})
		}

		// increment streaks
		const streaksRef = doc(
			db,
			`classrooms/${classID}/repeatables/${repeatableID}/streaks/${playerID}`,
		)
		const streaksSnap = await getDoc(streaksRef)
		if (!streaksSnap.exists()) {
			batch.set(streaksRef, { streaks: 1 })
		} else {
			batch.update(streaksRef, { streak: increment(1) })
		}

		// Remove the corresponding completion time
		batch.delete(completionTimeRef)

		// Decrement the requestCount variable
		batch.update(repeatableRef, { requestCount: increment(-1) })
	}

	await batch.commit()
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

// Firestore mutations for repeatable functionality
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

	await Promise.allSettled(
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

		// Skip the refresh if it has been less than a week since the last refresh
		// Should be >= because if it's >, then refresh will trigger every time (which is not desired)
		if (lastRefreshSnap.exists() && lastRefreshSnap.data().lastRefresh.toDate() >= lastSunday()) {
			return
		}

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
