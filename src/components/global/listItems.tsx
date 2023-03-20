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
import { Link } from 'react-router-dom'
import { useState } from 'react'

// Handles list of pages on sidebar. Edit if you want to add more pages

export function MainListItemsTeacher() {
	const [selected, setSelected] = useState<0 | 1 | 2 | 3>(0)

	return (
		<React.Fragment>
			<ListItemButton
				component={Link}
				to='tasks'
				onClick={() => setSelected(0)}
				selected={selected === 0}
			>
				<ListItemIcon>
					<AssignmentIcon />
				</ListItemIcon>
				<ListItemText primary='Tasks' />
			</ListItemButton>
			<ListItemButton
				component={Link}
				to='requests'
				onClick={() => setSelected(1)}
				selected={selected === 1}
			>
				<ListItemIcon>
					<EmailIcon />
				</ListItemIcon>
				<ListItemText primary='Requests' />
			</ListItemButton>
			<ListItemButton
				component={Link}
				to='class-teacher'
				onClick={() => setSelected(2)}
				selected={selected === 2}
			>
				<ListItemIcon>
					<GroupIcon />
				</ListItemIcon>
				<ListItemText primary='Class' />
			</ListItemButton>
			<ListItemButton
				component={Link}
				to='class-settings'
				onClick={() => setSelected(3)}
				selected={selected === 3}
			>
				<ListItemIcon>
					<SettingsIcon />
				</ListItemIcon>
				<ListItemText primary='Class Settings' />
			</ListItemButton>
		</React.Fragment>
	)
}

export function MainListItemsStudent() {
	const [selected, setSelected] = useState<0 | 1 | 2 | 3 | 4>(0)

	return (
		<React.Fragment>
			<ListItemButton
				component={Link}
				to='main'
				onClick={() => setSelected(0)}
				selected={selected === 0}
			>
				<ListItemIcon>
					<FortIcon />
				</ListItemIcon>
				<ListItemText primary='Main' />
			</ListItemButton>
			<ListItemButton
				component={Link}
				to='shop'
				onClick={() => setSelected(1)}
				selected={selected === 1}
			>
				<ListItemIcon>
					<SellIcon />
				</ListItemIcon>
				<ListItemText primary='Shop' />
			</ListItemButton>
			<ListItemButton
				component={Link}
				to='class-student'
				onClick={() => setSelected(2)}
				selected={selected === 2}
			>
				<ListItemIcon>
					<GroupIcon />
				</ListItemIcon>
				<ListItemText primary='Class' />
			</ListItemButton>
			<ListItemButton
				component={Link}
				to='inventory'
				onClick={() => setSelected(3)}
				selected={selected === 3}
			>
				<ListItemIcon>
					<InventoryIcon />
				</ListItemIcon>
				<ListItemText primary='Inventory' />
			</ListItemButton>
			<ListItemButton
				component={Link}
				to='forum'
				onClick={() => setSelected(4)}
				selected={selected === 4}
			>
				<ListItemIcon>
					<ForumIcon />
				</ListItemIcon>
				<ListItemText primary='Forum' />
			</ListItemButton>
		</React.Fragment>
	)
}
