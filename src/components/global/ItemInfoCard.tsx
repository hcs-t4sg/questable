import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { capitalize } from 'lodash'
import { Item, Outfit } from '../../types'

import { styled } from '@mui/system'

export function ItemInfoCard({
	children,
	item,
	itemPrice,
	bodyOutfit,
}: {
	children?: React.ReactNode
	item: Item
	itemPrice?: string // Optional prop that will display item price if passed in
	bodyOutfit?: Outfit // Optional prop for displaying body items. Pass in the player's current outfit
}) {
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

	return (
		<Card sx={{ maxWidth: 345 }}>
			{bodyOutfit ? (
				<ItemBox>
					{item.renderStatic()}
					{bodyOutfit.hair.renderStatic()}
					{bodyOutfit.shirt.renderStatic()}
					{bodyOutfit.pants.renderStatic()}
					{bodyOutfit.shoes.renderStatic()}
				</ItemBox>
			) : (
				<ItemBox>{item.renderStatic()}</ItemBox>
			)}
			<CardContent>
				<Typography variant='body2' sx={{ fontWeight: 'medium', color: 'green' }} component='div'>
					{capitalize(item.type)}
				</Typography>
				<Typography sx={{ marginTop: '15px', fontWeight: 'bold' }} variant='body1' component='div'>
					{item.name}
				</Typography>
				{itemPrice ? (
					<ItemTypography variant='body1' sx={{ fontWeight: 'bold' }}>
						{itemPrice}
					</ItemTypography>
				) : null}
				<ItemTypography variant='body2'>{item.description}</ItemTypography>
			</CardContent>
			<CardActions>{children}</CardActions>
		</Card>
	)
}
