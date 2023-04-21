import Button from '@mui/material/Button'
import { Classroom, Item, Outfit, Player } from '../../types'
import { updateAvatar } from '../../utils/mutations'
import { ItemInfoCard } from '../global/ItemInfoCard'

export function OnboardingItemCard({
	item,
	player,
	classroom,
	bodyOutfit,
}: {
	item: Item
	player: Player
	classroom: Classroom
	itemPrice?: string
	bodyOutfit?: Outfit
}) {
	const handleEquip = async () => {
		const res = await updateAvatar(player, item, classroom)
		window.alert(res)
		window.location.reload()
		// User should only be allowed to equip one outfit...
	}

	return (
		<ItemInfoCard item={item} bodyOutfit={bodyOutfit}>
			<Button variant='contained' color='success' size='small' onClick={handleEquip}>
				Equip
			</Button>
		</ItemInfoCard>
	)
}
