import { Box, Stack, Typography } from '@mui/material'
import bunny from '../../assets/loadingAnimations/bunny-loading.gif'
import chicken from '../../assets/loadingAnimations/chicken-loading.gif'
import cow from '../../assets/loadingAnimations/cow-loading.gif'
import ghost from '../../assets/loadingAnimations/ghost-loading.gif'
import pig from '../../assets/loadingAnimations/pig-loading.gif'
import sheep from '../../assets/loadingAnimations/sheep-loading.gif'
import { sample } from 'lodash'

export default function Loading({
	children,
	indicator,
}: {
	children?: React.ReactNode
	indicator?: 'bunny' | 'chicken' | 'cow' | 'ghost' | 'pig' | 'sheep'
}) {
	const indicatorImports = [bunny, chicken, cow, ghost, pig, sheep]

	const randomIndicator = sample(indicatorImports)

	return (
		<Stack alignItems='center'>
			<Box>
				<Box
					component='img'
					src={indicator ?? randomIndicator}
					sx={{
						width: '5vw',
						imageRendering: 'pixelated',
					}}
				/>
			</Box>
			<Typography variant='body1'>{children}</Typography>
		</Stack>
	)
}
