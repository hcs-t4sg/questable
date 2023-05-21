import InventoryDisplay from '../../components/global/InventoryDisplay'
import { Classroom, Item, Player } from '../../types'
import {
	getHairItems,
	getAllPantsItems,
	getAllShirtItems,
	getAllShoesItems,
} from '../../utils/items'

const hairs: Item[] = getHairItems()
const shirts: Item[] = getAllShirtItems()
const pants: Item[] = getAllPantsItems()
const shoes: Item[] = getAllShoesItems()

// Route for teacher inventory

export default function InventoryTeacher({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	// Teacher inventory contains all purchasable items (hair, shirts, pants, shoes). Note that all bodies and eye colors are available to both students and teachers (not purchasable), which is why they are not generated here.
	const allPurchasableItems = hairs.concat(shirts, pants, shoes)

	return (
		<InventoryDisplay
			player={player}
			classroom={classroom}
			inventoryObjects={allPurchasableItems}
		/>
	)
}
