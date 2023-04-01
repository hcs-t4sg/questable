import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { capitalize } from 'lodash'
import { Classroom, Item, Player } from '../../types'
import { purchaseItem, updateAvatar } from '../../utils/mutations'

import { getHairItems, getPantsItems, getShirtItems, getShoesItems } from '../../utils/items'

import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'

interface Props {
	item: Item
	player: Player
	classroom: Classroom
	itemPrice: string
	type: 'shop' | 'inventory'
	isBody: boolean
}

export function ItemCard(props: Props) {
	const { enqueueSnackbar } = useSnackbar()

	console.log('item')
	console.log(props.item)

	const ItemBox = styled(Box)({
		top: -20,
		left: '18%',
		position: 'relative',
		width: '150px',
		height: '120px',
	})

	const ItemTypography = styled(Typography)({
		marginTop: '15px',
		color: '#5c5c5c',
	})

	const handlePurchase = async () => {
		const res = await purchaseItem(props.classroom.id, props.player.id, props.item)
		enqueueSnackbar(res, { variant: res === 'Success!' ? 'success' : 'error' })
	}

	const handleEquip = async () => {
		const res = await updateAvatar(props.player, props.item, props.classroom)
		window.alert(res)
		window.location.reload()
	}

	const confirmActions =
		props.type === 'shop' ? (
			<>
				<Button variant='contained' color='success' size='small' onClick={handlePurchase}>
					Purchase
				</Button>
			</>
		) : (
			<Button variant='contained' color='success' size='small' onClick={handleEquip}>
				Equip
			</Button>
		)

	const hairs = getHairItems()
	const shirts = getShirtItems()
	const pants = getPantsItems()
	const shoes = getShoesItems()

	const defaultOutfit = (
		<>
			{hairs[0].renderStatic()}
			{shirts[0].renderStatic()}
			{pants[0].renderStatic()}
			{shoes[0].renderStatic()}
		</>
	)

	return (
		<Card sx={{ maxWidth: 345 }}>
			{props.isBody ? (
				<ItemBox>
					{props.item.renderStatic()}
					{defaultOutfit}
				</ItemBox>
			) : (
				<ItemBox>{props.item.renderStatic()}</ItemBox>
			)}
			<CardContent>
				<Typography variant='body2' sx={{ fontWeight: 'medium', color: 'green' }} component='div'>
					{capitalize(props.item.type)}
				</Typography>
				<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }} variant='body1' component='div'>
					{props.item.name}
				</Typography>
				{props.type === 'shop' ? (
					<ItemTypography variant='body1' sx={{ fontWeight: 'bold' }}>
						{props.itemPrice}
					</ItemTypography>
				) : null}
				<ItemTypography variant='body2'>{props.item.description}</ItemTypography>
			</CardContent>
			<CardActions>{confirmActions}</CardActions>
		</Card>
	)
}
