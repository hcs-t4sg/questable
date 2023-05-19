import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { CustomShopItems, Item } from '../../types'
import { db } from '../firebase'
import { getPlayerData } from './users'

// Firestore mutations for shop functionality

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
		const invSnapshot = await getDocs(inv)

		if (
			invSnapshot.docs.find(
				(doc) =>
					doc.data().itemId === item.id &&
					doc.data().type === item.type &&
					doc.data().subtype === item.subtype,
			)
		) {
			return 'Already owned!'
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

// Mutation to create custom rewards
export async function addReward(
	classID: string,
	reward: {
		name: string
		description: string
		price: number
		isActive: boolean
	},
) {
	const classRef = doc(db, 'classrooms', classID)
	const classSnap = await getDoc(classRef)

	if (!classSnap.exists()) {
		return 'No such document!'
	}

	// Update shop collection
	await addDoc(collection(db, `classrooms/${classID}/customShopItems`), {
		name: reward.name,
		description: reward.description,
		price: reward.price,
		isActive: reward.isActive,
	})
}

// Mutation to Update Reward Visibility
export async function updateReward(
	classroomID: string,
	reward: {
		name: string
		description: string
		price: number
		isActive: boolean
		id: string
	},
) {
	const itemRef = doc(db, `classrooms/${classroomID}/customShopItems/${reward.id}`)

	await updateDoc(itemRef, {
		name: reward.name,
		description: reward.description,
		price: reward.price,
		isActive: reward.isActive,
	})
}

export async function purchaseCustomItem(
	classID: string,
	studentID: string,
	item: CustomShopItems,
) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		throw new Error('Could not find classroom')
	}

	const player = await getPlayerData(classID, studentID)
	// Update
	if (!player) {
		throw new Error('Could not find player')
	}

	const balance = player.money

	if (balance < item.price) {
		throw new Error('Not enough money!')
	}

	const newItem = {
		itemId: item.id,
	}

	const newRequest = {
		rewardName: item.name,
		rewardDescription: item.description,
		rewardPrice: item.price,
		playerID: studentID,
		playerName: player.name,
	}

	const inv = collection(db, `classrooms/${classID}/players/${studentID}/inventory`)
	await addDoc(inv, newItem)

	const playerRef = doc(db, `classrooms/${classID}/players/${studentID}`)
	await updateDoc(playerRef, {
		money: player.money - item.price,
	})

	const reqs = collection(db, `classrooms/${classID}/rewardRequests`)

	await addDoc(reqs, newRequest)

	return 'Success!'
}

// Mutation to delete Custom Item
export async function deleteItem(classroomID: string, itemID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/customShopItems/${itemID}`))
}

// Mutation to confirm reward purchase
export async function confirmReward(classID: string, studentID: string, rewardID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}

	const rewardRef = doc(db, `classrooms/${classID}/rewardRequests/${rewardID}`)
	const rewardSnap = await getDoc(rewardRef)
	if (rewardSnap.exists()) {
		deleteDoc(rewardRef)
	}
}
