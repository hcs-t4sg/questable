import { Box } from '@mui/system'
import { Outfit } from '../../types'

/* Renders the player's avatar sprite.

Keep in mind that the sprite stretches to fill its parent container. When using this, you must place <Avatar /> inside a SQUARE parent MUI component with a defined width!

Ex:
<Box sx={{ width: '40px', height: '40px', }}>
*/
export default function Avatar({ outfit }: { outfit: Outfit }) {
	return (
		<Box
			sx={{
				width: '140%',
				position: 'relative',
				marginTop: '-40%',
				marginLeft: '-20%',
			}}
		>
			{outfit.body.renderStatic()}
			{outfit.hair.renderStatic()}
			{outfit.shirt.renderStatic()}
			{outfit.pants.renderStatic()}
			{outfit.shoes.renderStatic()}
			{outfit.eyes.renderStatic()}
		</Box>
	)
}
