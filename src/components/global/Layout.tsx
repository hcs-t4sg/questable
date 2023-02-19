import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import React from 'react'
import ClassroomSidebar from './ClassroomSidebar'
import Toolbar from '@mui/material/Toolbar'
import { UserRole } from '../../types'

export default function Layout({
	children,
	classroom,
	role,
}: React.PropsWithChildren<{ classroom?: boolean; role?: UserRole }>) {
	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
			}}
		>
			{classroom && role && <ClassroomSidebar role={role} />}
			<Box
				component='main'
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
				}}
			>
				<Toolbar />
				<Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
					{children}
				</Container>
			</Box>
		</Box>
	)
}