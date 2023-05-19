import Grid from '@mui/material/Grid'
import { collection, onSnapshot, query } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { db } from '../../utils/firebase'
import InventoryDisplay from '../../components/global/InventoryDisplay'
import Loading from '../../components/global/Loading'
import { Classroom, DatabaseInventoryItem, Item, Player } from '../../types'
import { Hair, Pants, Shirt, Shoes } from '../../utils/items'

export default function InventoryStudent({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const [inventoryItems, setInventoryItems] = React.useState<DatabaseInventoryItem[] | null>(null)

	useEffect(() => {
		const q = query(collection(db, `classrooms/${classroom.id}/players/${player.id}/inventory`))

		const unsub = onSnapshot(q, (snapshot) => {
			const inventoryList = snapshot.docs.map((doc) => doc.data())
			setInventoryItems(inventoryList as DatabaseInventoryItem[])
		})
		return unsub
	}, [player, classroom])

	if (!inventoryItems) {
		return (
			<Grid item xs={12}>
				<Loading>Loading inventory...</Loading>
			</Grid>
		)
	}
	const inventoryObjects: Item[] = []

	console.log(inventoryItems)

	inventoryItems.forEach((item) => {
		if (item.type === 'hair') {
			if (item.subtype) {
				inventoryObjects.push(new Hair(item.itemId, item.subtype))
			}
		} else if (item.type === 'shirt') {
			inventoryObjects.push(new Shirt(item.itemId))
		} else if (item.type === 'pants') {
			inventoryObjects.push(new Pants(item.itemId))
		} else if (item.type === 'shoes') {
			inventoryObjects.push(new Shoes(item.itemId))
		}
	})

	console.log(inventoryObjects)

	return (
		<InventoryDisplay
			player={player}
			classroom={classroom}
			inventoryObjects={inventoryObjects}
		></InventoryDisplay>
	)
}
