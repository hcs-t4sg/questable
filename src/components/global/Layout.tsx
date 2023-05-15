import { Box, Container } from '@mui/material'
import React from 'react'
import ClassroomSidebar from './ClassroomSidebar'
import Toolbar from '@mui/material/Toolbar'
import { UserRole } from '../../types'
import background from '/src/assets/background.png'

export default function Layout({
	children,
	classroom,
	role,
}: React.PropsWithChildren<{ classroom?: boolean; role?: UserRole }>) {
	// const mobile = useMediaQuery('(max-width:400px)')

	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
				// backgroundImage: { background },
			}}
		>
			{classroom && role && <ClassroomSidebar role={role} />}
			<Box
				component='main'
				sx={{
					// backgroundColor: (theme) =>
					// 	theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
					backgroundImage: `url(${background})`,
					backgroundSize: 'cover',
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
					imageRendering: 'pixelated',
				}}
			>
				<Toolbar />
				<Container maxWidth='lg' sx={{ mt: 4, mb: 4, opacity: 1 }}>
					{children}
				</Container>
			</Box>
		</Box>
	)
}
