import { Box, Card, CardActions, CardContent, Typography, useMediaQuery } from '@mui/material'
import { capitalize } from 'lodash'
import { Item, Outfit } from '../../types'

import { styled } from '@mui/system'
import { Eyes } from '../../utils/items'

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
	const mobile = useMediaQuery('(max-width:400px')

	const ItemBox = styled(Box)({
		top: -20,
		left: '18%',
		position: 'relative',
		width: !mobile ? '150px' : '75px',
		height: !mobile ? '120px' : '60px',
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
					{bodyOutfit.eyes.renderStatic()}
				</ItemBox>
			) : item instanceof Eyes ? (
				item.renderSwatch()
			) : (
				<ItemBox>{item.renderStatic()}</ItemBox>
			)}
			<CardContent>
				<Typography
					variant='body2'
					sx={{ fontWeight: 'medium', color: 'green', fontSize: !mobile ? '13px' : '10px' }}
					component='div'
				>
					{capitalize(item.type)}
				</Typography>
				<Typography
					sx={{ marginTop: '15px', fontWeight: 'bold', fontSize: !mobile ? '13px' : '8px' }}
					variant='body1'
					component='div'
				>
					{item.name}
				</Typography>
				{itemPrice ? (
					<ItemTypography
						variant='body1'
						sx={{ fontWeight: 'bold', fontSize: !mobile ? '13px' : '10px' }}
					>
						{itemPrice}
					</ItemTypography>
				) : null}
				<ItemTypography sx={{ fontSize: !mobile ? '13px' : '10px' }} variant='body2'>
					{item.description}
				</ItemTypography>
			</CardContent>
			<CardActions>{children}</CardActions>
		</Card>
	)
}
