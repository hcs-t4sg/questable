import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Classroom, Item, Player } from '../../types'
import { updateAvatar } from '../../utils/mutations'

// The display for an inventory card
export default function InventoryItemCard({
	item,
	player,
	classroom,
}: {
	item: Item
	player: Player
	classroom: Classroom
}) {
	const handleEquip = async () => {
		const res = await updateAvatar(player, item, classroom)
		window.alert(res)
		window.location.reload()
	}

	// const selectItem = a
	console.log('item')
	console.log(item)
	return (
		<Card sx={{ maxWidth: 345 }}>
			<Box
				sx={{
					top: -20,
					left: '18%',
					position: 'relative',
					width: '150px',
					height: '120px',
				}}
			>
				{item.renderStatic()}
			</Box>

			<CardContent>
				<Typography gutterBottom variant='h5' component='div'>
					Type: {item.type}
				</Typography>
				<Typography gutterBottom variant='h5' component='div'>
					Name: {item.name}
				</Typography>
				<Typography gutterBottom variant='h5' component='div'>
					Description: {item.description}
				</Typography>
			</CardContent>

			<CardActions>
				<Button variant='contained' color='success' size='small' onClick={handleEquip}>
					Equip
				</Button>
			</CardActions>
		</Card>
	)
}
