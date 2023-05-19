import { User } from 'firebase/auth'
import { doc, getDoc, runTransaction, updateDoc } from 'firebase/firestore'
import { Classroom, Item, Player } from '../../types'
import { db } from '../firebase'

// Firestore mutations for user and player management

export async function syncUsers(user: User) {
	const userRef = doc(db, 'users', user.uid)

	try {
		await runTransaction(db, async (transaction) => {
			const userDoc = await transaction.get(userRef)
			if (!userDoc.exists()) {
				transaction.set(userRef, {
					email: user.email,
					onboarded: [],
				})
			}
		})
	} catch (e) {
		console.log('Transaction failed: ', e)
	}
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

// Mutation to update player data
export async function updatePlayer(
	userID: string,
	classroomID: string,
	newPlayerData: {
		name?: string
		money?: number
	},
) {
	const playerRef = doc(db, `classrooms/${classroomID}/players/${userID}`)

	await updateDoc(playerRef, newPlayerData)
}

export async function updateAvatar(player: Player, newItem: Item, classroom: Classroom) {
	const playerRef = doc(db, `classrooms/${classroom.id}/players/${player.id}`)

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
			: newItem.type === 'eyes'
			? {
					avaEyes: newItem.id,
			  }
			: null
	if (newEquip) {
		await updateDoc(playerRef, newEquip)
		return `Successfully equipped ${newItem.name}!`
	}
	return 'There was an error equipping.'
}
