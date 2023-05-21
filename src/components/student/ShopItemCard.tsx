import Button from '@mui/material/Button'
import { Classroom, Item, Outfit, Player } from '../../types'
import { purchaseItem } from '../../utils/mutations/shop'
import { ItemInfoCardWrapper } from '../global/ItemInfoCardWrapper'
import { useSnackbar } from 'notistack'

// Card for a particular item in shop

export function ShopItemCard({
	item,
	player,
	classroom,
	itemPrice,
	bodyOutfit,
}: {
	item: Item
	player: Player
	classroom: Classroom
	itemPrice: string
	bodyOutfit?: Outfit // Optional prop for displaying body items. Pass in the player's current outfit
}) {
	const { enqueueSnackbar } = useSnackbar()

	const handlePurchase = async () => {
		const res = await purchaseItem(classroom.id, player.id, item)
		enqueueSnackbar(res, { variant: res === 'Success!' ? 'success' : 'error' })
	}

	return (
		<ItemInfoCardWrapper item={item} itemPrice={itemPrice} bodyOutfit={bodyOutfit}>
			<Button variant='contained' color='success' size='small' onClick={handlePurchase}>
				Purchase
			</Button>
		</ItemInfoCardWrapper>
	)
}
