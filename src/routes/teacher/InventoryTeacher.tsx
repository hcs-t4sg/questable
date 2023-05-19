import InventoryDisplay from '../../components/global/InventoryDisplay'
import { Classroom, Item, Player } from '../../types'
import { getHairItems, getPantsItems, getShirtItems, getShoesItems } from '../../utils/items'

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

	return (
		<InventoryDisplay
			player={player}
			classroom={classroom}
			inventoryObjects={inventoryObjects}
		></InventoryDisplay>
	)
}
