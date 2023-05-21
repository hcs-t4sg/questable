import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import { Toolbar, List, IconButton, Divider } from '@mui/material'

import React from 'react'
import '../../App.css'
import { UserRole } from '../../types'
import { MainListItemsStudent, MainListItemsTeacher } from './listItems'

const drawerWidth = 240

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	'& .MuiDrawer-paper': {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: 'border-box',
		...(!open && {
			overflowX: 'hidden',
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9),
			},
		}),
		backgroundColor: '#4a2511',
	},
}))

// Component for page sidebar in classroom view

export default function ClassroomSidebar({ role }: { role: UserRole }) {
	const [open, setOpen] = React.useState(false)
	const toggleDrawer = () => {
		setOpen(!open)
	}

	return (
		<Drawer
			sx={{ zIndex: (theme) => theme.zIndex.appBar - 1, height: '100vh' }}
			variant='permanent'
			open={open}
		>
			<Toolbar />
			<Toolbar
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					px: [1],
				}}
			>
				<IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
					{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</IconButton>
			</Toolbar>
			<Divider />
			<List component='nav'>
				{role === 'teacher' ? (
					<MainListItemsTeacher />
				) : role === 'student' ? (
					<MainListItemsStudent />
				) : null}
			</List>
		</Drawer>
	)
}
