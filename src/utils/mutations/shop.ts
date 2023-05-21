import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { CustomShopItems, Item } from '../../types'
import { db } from '../firebase'
import { getPlayerData } from './users'

// Firestore mutations for shop functionality

// Mutation to purchase shop item
export async function purchaseItem(classID: string, studentID: string, item: Item) {
	// Fetch classroom data
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}

	// Fetch player data
	const playerRef = doc(db, `classrooms/${classID}/players/${studentID}`)
	const playerSnap = await getDoc(playerRef)
	if (!playerSnap.exists()) {
		return 'Could not find player'
	}

	const inv = collection(db, `classrooms/${classID}/players/${studentID}/inventory`)
	const invSnapshot = await getDocs(inv)

	// Check if player already owns item
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

	// Check if player balance sufficient
	const balance = playerSnap.data().money
	if (balance < item.price) {
		return 'Not enough money!'
	}

	const newItem = {
		itemId: item.id,
		type: item.type,
		subtype: item.subtype || null,
	}

	await addDoc(inv, newItem)

	// Deduct item cost from player balance
	await updateDoc(playerRef, {
		money: playerSnap.data().money - item.price,
	})

	return 'Success!'
}

// Mutation to create custom shop rewards
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

	// Update custom shop items collection
	await addDoc(collection(db, `classrooms/${classID}/customShopItems`), {
		name: reward.name,
		description: reward.description,
		price: reward.price,
		isActive: reward.isActive,
	})
}

// Mutation to Update Custom reward visibility (whether it is displayed to students or not)
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

// Mutation to purchase a custom shop item
export async function purchaseCustomItem(
	classID: string,
	studentID: string,
	item: CustomShopItems,
) {
	// Fetch classroom data
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		throw new Error('Could not find classroom')
	}

	// Fetch player data
	const player = await getPlayerData(classID, studentID)
	if (!player) {
		throw new Error('Could not find player')
	}

	// Check if player balance is sufficient
	const balance = player.money
	if (balance < item.price) {
		throw new Error('Not enough money!')
	}

	// Update player balance
	const playerRef = doc(db, `classrooms/${classID}/players/${studentID}`)
	await updateDoc(playerRef, {
		money: player.money - item.price,
	})

	// Submit new request to purchased custom rewards
	// Note that data pertaining to a purchased reward is logged as-is at the moment of purchase and not kept in sync with the reward in the customShopItems collection. This is intentional such that teachers editing reward details will not retroactively affect existing purchases of that reward
	const newRequest = {
		rewardName: item.name,
		rewardDescription: item.description,
		rewardPrice: item.price,
		playerID: studentID,
		playerName: player.name,
	}
	const reqs = collection(db, `classrooms/${classID}/rewardRequests`)
	await addDoc(reqs, newRequest)

	return 'Success!'
}

// Mutation to delete custom shop item
export async function deleteItem(classroomID: string, itemID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/customShopItems/${itemID}`))
}

// Mutation to confirm custom reward purchase
export async function confirmReward(classID: string, studentID: string, rewardID: string) {
	const classroomRef = doc(db, 'classrooms', classID)
	const classroomSnap = await getDoc(classroomRef)
	if (!classroomSnap.exists()) {
		return 'Could not find classroom'
	}

	// Remove the reward request from teacher's view
	const rewardRef = doc(db, `classrooms/${classID}/rewardRequests/${rewardID}`)
	const rewardSnap = await getDoc(rewardRef)
	if (rewardSnap.exists()) {
		deleteDoc(rewardRef)
	}
}
