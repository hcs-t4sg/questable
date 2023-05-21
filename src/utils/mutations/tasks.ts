import {
	Timestamp,
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	increment,
	serverTimestamp,
	setDoc,
	updateDoc,
	writeBatch,
} from 'firebase/firestore'
import { CompletedTask } from '../../types'
import { db } from '../firebase'

// Firestore mutations for one-time task functionality
// TODO: These mutations were written under the paradigm that tasks would only be assigned to players in the classroom at moment of the tasks creation. However, we later modified some logic such that players joining the classroom after the creation of the task could still view and complete that task if not overdue. With some careful thought, the logic of these mutations could be improved to remove some artifacts from the old approach (i.e. the assigned array) and remove some repetitions/redundancies related to how players without existing documents/properties are handled

// Mutation to create a new task
export async function addTask(
	classID: string,
	task: {
		name: string
		description: string
		reward: number
		due: Timestamp
		gcrCourseID?: string
		gcrID?: string
		gcrName?: string
	},
	teacherID: string,
) {
	// Reference given classroom
	const classRef = doc(db, 'classrooms', classID)
	const classSnap = await getDoc(classRef)

	if (!classSnap.exists()) {
		// doc.data() will be undefined in this case
		return 'No such document!'
	}
	// TODO: This can be refactored to avoid repetition (such that gcrCourseID are set to null if not specified), but you should also check to make sure that setting such fields to null in the db, instead of just having those fields not exist, doesn't make any difference for other logic.
	// Workflow for adding a GCR-linked task
	if (task.gcrCourseID && task.gcrID && task.gcrName) {
		// Update tasks collection
		await addDoc(collection(db, `classrooms/${classID}/tasks`), {
			name: task.name,
			description: task.description,
			reward: task.reward,
			created: serverTimestamp(),
			due: task.due,
			gcrCourseID: task.gcrCourseID,
			gcrID: task.gcrID,
			gcrName: task.gcrName,
			assigned: classSnap.data().playerList.filter((id: string) => id !== teacherID), // filter out the teacher's id
			completed: [],
			confirmed: [],
		})
	} else {
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

// Mutation to delete tasks
export async function deleteTask(classroomID: string, taskID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`))
}

// Mutation to queue task completion
export async function completeTask(classroomID: string, taskID: string, playerID: string) {
	// Remove `playerID` from assigned array
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), {
		assigned: arrayRemove(playerID),
	})
	// Add `playerID` to completed array
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), {
		completed: arrayUnion(playerID),
	})
	// Add completion timestamp
	const docRef = doc(db, `classrooms/${classroomID}/tasks/${taskID}/completionTimes/${playerID}`)
	await setDoc(docRef, {
		time: serverTimestamp(),
	})
}

// Mutation to remove/unsend a queued task completion
export async function unsendTask(classroomID: string, taskID: string, playerID: string) {
	// Remove `playerID` from assigned array
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), {
		assigned: arrayUnion(playerID),
	})
	// Add `playerID` to completed array
	await updateDoc(doc(db, `classrooms/${classroomID}/tasks/${taskID}`), {
		completed: arrayRemove(playerID),
	})
}

// Mutation to confirm one or more task completions
export async function confirmTasks(tasks: CompletedTask[], classID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}

	const batch = writeBatch(db)
	for (const i in tasks) {
		const taskRef = doc(db, `classrooms/${classID}/tasks/${tasks[i].id}`)
		const taskSnap = await getDoc(taskRef)
		if (taskSnap.exists()) {
			// Move player from completed array to confirmed array
			batch.update(taskRef, {
				completed: arrayRemove(tasks[i].player.id),
				confirmed: arrayUnion(tasks[i].player.id),
			})
		}
		// Increment player money and xp for confirmed task completion
		const playerRef = doc(db, `classrooms/${classID}/players/${tasks[i].player.id}`)
		const playerSnap = await getDoc(playerRef)
		if (playerSnap.exists() && taskSnap.exists()) {
			batch.update(playerRef, {
				money: increment(taskSnap.data().reward),
				xp: increment(taskSnap.data().reward),
			})
		}
	}

	await batch.commit()
}

// Remove player ID from completed array and add to assigned array.
export async function denyTask(classID: string, studentID: string, taskID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}
	const taskRef = doc(db, `classrooms/${classID}/tasks/${taskID}`)
	const taskSnap = await getDoc(taskRef)
	if (taskSnap.exists()) {
		// Move player from completed array back to assigned array
		updateDoc(taskRef, {
			completed: arrayRemove(studentID),
			assigned: arrayUnion(studentID),
		})
	}
}

// Mutation to get the time at which a player completed a given task
export async function getPlayerTaskCompletionTime(
	classID: string,
	taskID: string,
	playerID: string,
) {
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
