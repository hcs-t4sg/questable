import Box from '@mui/material/Box'
// import Button, { ButtonTypeMap } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
// import Typography from '@mui/material/Typography'
import { Classroom, Item, Player } from '../../types'

import { styled } from '@mui/system'

// Props
interface Props {
	item: Item
	player: Player
	classroom: Classroom
	itemPrice: string
	handleFunction: () => Promise<void>
	button: any
	typography: any
}

// The display for a card
export function ItemCard(props: Props) {
	// const selectItem = a
	console.log('item')
	console.log(props.item)

	// handleFunction
	{
		props.handleFunction
	}

	// Styled box
	const ItemBox = styled(Box)({
		top: -20,
		left: '18%',
		position: 'relative',
		width: '150px',
		height: '120px',
	})

	return (
		<Card sx={{ maxWidth: 345 }}>
			<ItemBox>{props.item.renderStatic()}</ItemBox>
			<CardContent>{props.typography}</CardContent>
			<CardActions>{props.button}</CardActions>
		</Card>
	)
}
