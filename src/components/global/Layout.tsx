import { Box, Container, Toolbar, useMediaQuery } from '@mui/material'
import React from 'react'
import ClassroomSidebar from './ClassroomSidebar'
import { UserRole } from '../../types'
import background from '/src/assets/background.png'
import BottomAppBar from './BottomBar'

export default function Layout({
	children,
	classroom,
	role,
}: React.PropsWithChildren<{ classroom?: boolean; role?: UserRole }>) {
	const mobile = useMediaQuery('(max-width:950px)')

	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
				// backgroundImage: { background },
			}}
		>
			{classroom && role && !mobile && <ClassroomSidebar role={role} />}
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
				<Toolbar />
				<Container maxWidth='lg' sx={{ mt: 4, mb: 4, opacity: 1 }}>
					{children}
				</Container>
				{mobile && (
					<Box className='spacer' sx={{ height: 40 }}>
						{' '}
					</Box>
				)}
				{classroom && role && mobile && <BottomAppBar role={role} />}
			</Box>
		</Box>
	)
}
