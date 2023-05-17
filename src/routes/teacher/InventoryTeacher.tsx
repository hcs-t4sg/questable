import React from 'react'
// import ReactDOM from "react-dom"
// import InventoryItemCard from '../../components/student/InventoryItemCard'
import { Classroom, Item, Player } from '../../types'
import {
	getBodyItems,
	getHairItems,
	getPantsItems,
	getShirtItems,
	getShoesItems,
} from '../../utils/items'
import InventoryDisplay from '../../components/global/InventoryDisplay'

const hairs: Item[] = getHairItems()
const shirts: Item[] = getShirtItems()
const pants: Item[] = getPantsItems()
const shoes: Item[] = getShoesItems()

export default function InventoryTeacher({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const inventoryObjects = hairs.concat(shirts, pants, shoes)

	console.log(inventoryObjects)
	console.log(getBodyItems())

	return (
		<InventoryDisplay
			player={player}
			classroom={classroom}
			inventoryObjects={inventoryObjects}
		></InventoryDisplay>
	)
}
