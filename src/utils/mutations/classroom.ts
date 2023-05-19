import { User } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

// Firestore mutations for generic class management functionality

// Create new classroom with user as teacher
export async function addClassroom(name: string, user: User) {
	// Update classrooms collection with new classroom
	const newClassroom = {
		name: name,
		playerList: [user.uid],
		teacherList: [user.uid],
		doLeaderboard: true,
		leaderboardSize: 3,
		doForumPostEditing: true,
	}
	// NOTE: I made a slight change here. Instead of storing the teacher in the playersList,
	// I'm storing it in a separate field called teacher. This is because I want to be able to differntiate the classes
	// owned by each user easily when displaying "created classrooms."

	const classroomRef = await addDoc(collection(db, 'classrooms'), newClassroom)

	// Update created classroom with new player
	const newPlayerRef = doc(db, classroomRef.path + '/players', user.uid)
	await setDoc(newPlayerRef, {
		money: 0,
		name: 'Adventurer',
		role: 'teacher',
		id: user.uid,
	})

	return
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
	await updateDoc(classroomRef, {
		playerList: playerList,
	})

	// Update classroom with new player
	const newPlayerRef = doc(db, `classrooms/${classID}/players`, user.uid)
	await setDoc(newPlayerRef, {
		money: 0,
		xp: 0,
		name: 'Adventurer',
		role: 'student',
		id: user.uid,
	})

	return 'Successfully joined ' + classroomData.name + '!'
}

export async function onboardClassroom(userID: string, classID: string) {
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

// Mutation to add Pin
export async function addPin(userID: string, classID: string) {
	const userRef = doc(db, `users/${userID}`)
	const pinnedSnap = await getDoc(userRef)
	if (pinnedSnap.exists()) {
		const pinnedClassrooms = pinnedSnap.data().pinned
		if (pinnedClassrooms) {
			pinnedClassrooms.push(classID)
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

// Mutation to toggle Leaderboard
export async function updateDoLeaderboard(
	classroomID: string,
	newDoLeaderboard: {
		doLeaderboard: boolean
	},
) {
	const classRef = doc(db, `classrooms/${classroomID}`)

	await updateDoc(classRef, {
		doLeaderboard: newDoLeaderboard.doLeaderboard,
	})
}

// Mutation to change leaderboard size
export async function updateLeaderboardSize(
	classroomID: string,
	newLeaderboardSize: {
		leaderboardSize: number | string
	},
) {
	const classRef = doc(db, `classrooms/${classroomID}`)

	await updateDoc(classRef, {
		leaderboardSize: newLeaderboardSize.leaderboardSize,
	})
}
