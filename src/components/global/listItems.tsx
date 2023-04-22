import AssignmentIcon from '@mui/icons-material/Assignment'
import EmailIcon from '@mui/icons-material/Email'
import FortIcon from '@mui/icons-material/Fort'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import SellIcon from '@mui/icons-material/Sell'
import SettingsIcon from '@mui/icons-material/Settings'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ForumIcon from '@mui/icons-material/Forum'
import * as React from 'react'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'

// Handles list of pages on sidebar. Edit if you want to add more pages

const ListItemButtonStyled = styled(ListItemButton)({
	color: 'white',
	'&.Mui-selected': {
		backgroundColor: '#733a1b',
	},
	'&.Mui-focusVisible': {
		backgroundColor: '#733a1b',
	},
	':hover': {
		backgroundColor: '#733a1b',
	},
	'&.Mui-selected:hover': {
		backgroundColor: '#733a1b',
	},
}) as typeof ListItemButton

const ListItemIconStyled = styled(ListItemIcon)({
	color: 'white',
}) as typeof ListItemButton

export function MainListItemsTeacher() {
	const [selected, setSelected] = useState<0 | 1 | 2 | 3 | 4>(0)

	return (
		<React.Fragment>
			<ListItemButtonStyled
				component={Link}
				to='tasks'
				onClick={() => setSelected(0)}
				selected={selected === 0}
			>
				<ListItemIconStyled>
					<AssignmentIcon />
				</ListItemIconStyled>
				<ListItemText primary='Tasks' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='requests'
				onClick={() => setSelected(1)}
				selected={selected === 1}
			>
				<ListItemIconStyled>
					<EmailIcon />
				</ListItemIconStyled>
				<ListItemText primary='Requests' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='class-teacher'
				onClick={() => setSelected(2)}
				selected={selected === 2}
			>
				<ListItemIconStyled>
					<GroupIcon />
				</ListItemIconStyled>
				<ListItemText primary='Class' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='forum'
				onClick={() => setSelected(3)}
				selected={selected === 3}
			>
				<ListItemIconStyled>
					<ForumIcon />
				</ListItemIconStyled>
				<ListItemText primary='Forum' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='teacher-settings'
				onClick={() => setSelected(4)}
				selected={selected === 4}
			>
				<ListItemIconStyled>
					<SettingsIcon />
				</ListItemIconStyled>
				<ListItemText primary='Class Settings' />
			</ListItemButtonStyled>
		</React.Fragment>
	)
}

export function MainListItemsStudent() {
	const [selected, setSelected] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

	return (
		<React.Fragment>
			<ListItemButtonStyled
				component={Link}
				to='tasks'
				onClick={() => setSelected(0)}
				selected={selected === 0}
			>
				<ListItemIconStyled>
					<FortIcon />
				</ListItemIconStyled>
				<ListItemText primary='Tasks' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='shop'
				onClick={() => setSelected(1)}
				selected={selected === 1}
			>
				<ListItemIconStyled>
					<SellIcon />
				</ListItemIconStyled>
				<ListItemText primary='Shop' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='class-student'
				onClick={() => setSelected(2)}
				selected={selected === 2}
			>
				<ListItemIconStyled>
					<GroupIcon />
				</ListItemIconStyled>
				<ListItemText primary='Class' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='inventory'
				onClick={() => setSelected(3)}
				selected={selected === 3}
			>
				<ListItemIconStyled>
					<InventoryIcon />
				</ListItemIconStyled>
				<ListItemText primary='Inventory' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='forum'
				onClick={() => setSelected(4)}
				selected={selected === 4}
			>
				<ListItemIconStyled>
					<ForumIcon />
				</ListItemIconStyled>
				<ListItemText primary='Forum' />
			</ListItemButtonStyled>
			<ListItemButtonStyled
				component={Link}
				to='student-settings'
				onClick={() => setSelected(5)}
				selected={selected === 5}
			>
				<ListItemIconStyled>
					<SettingsIcon />
				</ListItemIconStyled>
				<ListItemText primary='Class Settings' />
			</ListItemButtonStyled>
		</React.Fragment>
	)
}
