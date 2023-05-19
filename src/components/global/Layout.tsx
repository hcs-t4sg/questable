import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { UserRole } from '../../types'
import BottomAppBar from './BottomBar'
import ClassroomSidebar from './ClassroomSidebar'
import background from '/src/assets/background.png'

export default function Layout({
	children,
	classroom,
	role,
}: React.PropsWithChildren<{ classroom?: boolean; role?: UserRole }>) {
	const theme = useTheme()
	const tablet = useMediaQuery(theme.breakpoints.down('tablet'))

	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
			}}
		>
			{classroom && role && !tablet && <ClassroomSidebar role={role} />}
			<Box
				component='main'
				sx={{
					backgroundImage: `url(${background})`,
					backgroundSize: 'cover',
					flexGrow: 1,
					top: 65,
					position: 'fixed',
					bottom: 0,
					width: '100%',
					overflowX: 'scroll',
					overflow: 'auto',
					imageRendering: 'pixelated',
				}}
			>
				<Container maxWidth='lg' sx={{ mt: 4, mb: 4, opacity: 1 }}>
					<Grid container spacing={3}>
						{children}
					</Grid>
				</Container>
				{tablet && (
					<Box className='spacer' sx={{ height: 40 }}>
						{' '}
					</Box>
				)}
				{classroom && role && tablet && <BottomAppBar role={role} />}
			</Box>
		</Box>
	)
}
