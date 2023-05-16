import * as React from 'react'
import { Box, CssBaseline, Toolbar, IconButton, List, AppBar } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { UserRole } from '../../types'
import { MainListItemsStudent, MainListItemsTeacher } from './listItems'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function BottomAppBar({ role }: { role: UserRole }) {
	const [open, setOpen] = React.useState(false)
	const toggleDrawer = () => {
		setOpen(!open)
	}

	return (
		<React.Fragment>
			<CssBaseline />
			<AppBar position='fixed' color='primary' sx={{ top: 'auto', bottom: 0 }}>
				<Toolbar>
					<IconButton onClick={toggleDrawer} color='inherit' aria-label='open drawer'>
						<KeyboardArrowUpIcon />
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
				</Toolbar>
			</AppBar>
			<MuiDrawer
				variant='temporary'
				open={open}
				anchor='bottom'
				onClose={() => setOpen(false)}
				PaperProps={{
					sx: {
						backgroundColor: '#4a2511',
					},
				}}
			>
				<List component='nav'>
					{role === 'teacher' ? (
						<MainListItemsTeacher />
					) : role === 'student' ? (
						<MainListItemsStudent />
					) : null}
				</List>
			</MuiDrawer>
		</React.Fragment>
	)
}
