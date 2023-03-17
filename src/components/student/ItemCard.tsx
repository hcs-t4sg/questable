import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Classroom, Item, Player } from '../../types'
import { capitalize } from 'lodash'
import { purchaseItem, updateAvatar } from '../../utils/mutations'
import { useState } from 'react'

import { styled } from '@mui/system'

interface Props {
	item: Item
	player: Player
	classroom: Classroom
	itemPrice: string
	type: 'shop' | 'inventory'
}

export function ItemCard(props: Props) {
	const [text, setText] = useState('')

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
		// || null
		console.log(res)

		if (res) {
			setText(res)
		}
	}

	const handleEquip = async () => {
		const res = await updateAvatar(props.player, props.item, props.classroom)
		window.alert(res)
		window.location.reload()
	}

	const confirmActions =
		props.type === 'shop' ? (
			<>
				<Typography
					sx={{
						color: text !== 'Success!' ? '#B53737' : 'green',
						marginBottom: '5px',
					}}
					variant='subtitle2'
				>
					{text}
				</Typography>
				<Button variant='contained' color='success' size='small' onClick={handlePurchase}>
					Purchase
				</Button>
			</>
		) : (
			<Button variant='contained' color='success' size='small' onClick={handleEquip}>
				Equip
			</Button>
		)

	return (
		<Card sx={{ maxWidth: 345 }}>
			<ItemBox>{props.item.renderStatic()}</ItemBox>
			<CardContent>
				<Typography variant='body1' sx={{ fontWeight: 'medium', color: 'green' }} component='div'>
					{capitalize(props.item.type)}
				</Typography>
				<Typography sx={{ marginTop: '15px' }} variant='body1' component='div'>
					{props.item.name}
				</Typography>
				{props.type === 'shop' ? (
					<ItemTypography variant='body1'>Price: {props.itemPrice}</ItemTypography>
				) : null}
				<ItemTypography variant='body1'>{props.item.description}</ItemTypography>
			</CardContent>
			<CardActions>{confirmActions}</CardActions>
		</Card>
	)
}
