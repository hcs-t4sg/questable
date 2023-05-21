import Button from '@mui/material/Button'
import { Item, Outfit } from '../../types'
import { ItemInfoCardWrapper } from '../global/ItemInfoCardWrapper'

// Card for an item option in onboarding page

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
	return (
		<ItemInfoCardWrapper item={item} bodyOutfit={bodyOutfit}>
			<Button
				variant='contained'
				color={isEquipped ? 'primary' : 'success'}
				size='small'
				onClick={selectItemCallback}
			>
				{isEquipped ? 'Equipped' : 'Equip'}
			</Button>
		</ItemInfoCardWrapper>
	)
}
