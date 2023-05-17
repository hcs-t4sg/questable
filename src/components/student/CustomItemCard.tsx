import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Classroom, CustomShopItems, Player } from '../../types'
import { purchaseCustomItem } from '../../utils/mutations'

import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'

import blue3 from '/src/assets/spriteSheets/potions/blue3.png'
import green3 from '/src/assets/spriteSheets/potions/green3.png'
import purple3 from '/src/assets/spriteSheets/potions/purple3.png'
import red3 from '/src/assets/spriteSheets/potions/red3.png'

export function iconPotion(priceAmount: number) {
	const iconMatch =
		priceAmount === 50
			? blue3
			: priceAmount === 100
			? green3
			: priceAmount === 150
			? purple3
			: priceAmount === 200
			? red3
			: ' '
	return (
		<Box
			component='img'
			sx={{
				imageRendering: 'pixelated',
				maxHeight: { xs: 140, md: 200 },
				maxWidth: { xs: 140, md: 200 },
				minWidth: '28px',
				minHeight: '31.5px',
				position: 'relative',
			}}
			alt='Potion'
			src={iconMatch}
			height='120%'
			width='100%'
		/>
	)
}

interface Props {
	item: CustomShopItems
	player: Player
	classroom: Classroom
	type: 'shop' | 'inventory'
	isBody: boolean
}

export function CustomItemCard(props: Props) {
	const { enqueueSnackbar } = useSnackbar()

	console.log('item')
	console.log(props.item)

	const ItemBox = styled(Box)({
		top: 20,
		left: '18%',
		position: 'relative',
		width: '150px',
		height: '120px',
	})

	const ItemTypography = styled(Typography)({
		marginTop: '15px',
		color: '#5c5c5c',
	})

	const handlePurchase = () => {
		// const res = await purchaseCustomItem(props.classroom.id, props.player.id, props.item)
		// enqueueSnackbar(res, { variant: res === 'Success!' ? 'success' : 'error' })
		purchaseCustomItem(props.classroom.id, props.player.id, props.item)
			.then((value) => {
				enqueueSnackbar(value, { variant: 'success' })
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar(err.message, { variant: 'error' })
			})
	}

	return (
		<Card sx={{ maxWidth: 345 }}>
			<ItemBox marginBottom={5}>{iconPotion(props.item.price)}</ItemBox>
			<CardContent>
				<Typography variant='body2' sx={{ fontWeight: 'medium', color: 'green' }} component='div'>
					Custom Reward
				</Typography>
				<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }} variant='body1' component='div'>
					{props.item.name}
				</Typography>
				<ItemTypography variant='body1' sx={{ fontWeight: 'bold' }}>
					{props.item.price}g
				</ItemTypography>
				<ItemTypography variant='body2'>{props.item.description}</ItemTypography>
			</CardContent>
			<CardActions>
				<Button variant='contained' color='success' size='small' onClick={handlePurchase}>
					Purchase
				</Button>
			</CardActions>
		</Card>
	)
}
