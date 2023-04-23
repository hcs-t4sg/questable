import Button from '@mui/material/Button'
import { Classroom, Item, Outfit, Player } from '../../types'
import { updateAvatar } from '../../utils/mutations'
import { ItemInfoCard } from '../global/ItemInfoCard'

export function InventoryItemCard({
	item,
	player,
	classroom,
	bodyOutfit,
}: {
	item: Item
	player: Player
	classroom: Classroom
	itemPrice?: string
	bodyOutfit?: Outfit // Optional prop for displaying body items. Pass in the player's current outfit
}) {
	const handleEquip = async () => {
		const res = await updateAvatar(player, item, classroom)
		window.alert(res)
		window.location.reload()
	}

	return (
		<ItemInfoCard item={item} bodyOutfit={bodyOutfit}>
			<Button variant='contained' color='success' size='small' onClick={handleEquip}>
				Equip
			</Button>
		</ItemInfoCard>
	)
}
