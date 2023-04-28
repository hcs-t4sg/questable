import Button from '@mui/material/Button'
import { Item, Outfit } from '../../types'
import { ItemInfoCard } from '../global/ItemInfoCard'

export function OnboardingItemCard({
	item,
	bodyOutfit,
	selectItemCallback,
	isEquipped,
}: {
	item: Item
	itemPrice?: string
	bodyOutfit?: Outfit
	selectItemCallback: () => void
	isEquipped: boolean
}) {
	// const handleEquip = async () => {
	// 	const res = await updateAvatar(player, item, classroom)
	// 	window.alert(res)
	// 	window.location.reload()
	// }

	return (
		<ItemInfoCard item={item} bodyOutfit={bodyOutfit}>
			<Button
				variant='contained'
				color={isEquipped ? 'primary' : 'success'}
				size='small'
				onClick={selectItemCallback}
			>
				{isEquipped ? 'Equipped' : 'Equip'}
			</Button>
		</ItemInfoCard>
	)
}
