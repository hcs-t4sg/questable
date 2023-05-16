import * as React from 'react'
import {
	styled,
	CssBaseline,
	Toolbar,
	IconButton,
	List,
	AppBar,
	Stack,
	ListItemButton,
	ListItemIcon,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { UserRole } from '../../types'
import { MainListItemsStudent, MainListItemsTeacher } from './listItems'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Link } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment'
import EmailIcon from '@mui/icons-material/Email'
import ForumIcon from '@mui/icons-material/Forum'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import SellIcon from '@mui/icons-material/Sell'
import SettingsIcon from '@mui/icons-material/Settings'

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

export default function BottomAppBar({ role }: { role: UserRole }) {
	const [open, setOpen] = React.useState(false)
	const toggleDrawer = () => {
		setOpen(!open)
	}

	const teacherItems = [
		{
			text: 'Tasks',
			link: 'tasks',
			number: 0 as 0 | 1 | 2 | 3 | 4,
			icon: <AssignmentIcon />,
		},
		{
			text: 'Requests',
			link: 'requests',
			number: 1 as 0 | 1 | 2 | 3 | 4,
			icon: <EmailIcon />,
		},
		{
			text: 'Class',
			link: 'class',
			number: 2 as 1 as 0 | 1 | 2 | 3 | 4,
			icon: <GroupIcon />,
		},
		{
			text: 'Forum',
			link: 'forum',
			number: 3 as 0 | 1 | 2 | 3 | 4,
			icon: <ForumIcon />,
		},
		{
			text: 'Class Settings',
			link: 'settings',
			number: 4 as 0 | 1 | 2 | 3 | 4,
			icon: <SettingsIcon />,
		},
	]

	const studentItems = [
		{
			text: 'Quests',
			link: 'tasks',
			number: 0 as 0 | 1 | 2 | 3 | 4 | 5,
			icon: <AssignmentIcon />,
		},
		{
			text: 'Shop',
			link: 'shop',
			number: 1 as 0 | 1 | 2 | 3 | 4 | 5,
			icon: <SellIcon />,
		},
		{
			text: 'Class',
			link: 'class',
			number: 2 as 0 | 1 | 2 | 3 | 4 | 5,
			icon: <GroupIcon />,
		},
		{
			text: 'Inventory',
			link: 'inventory',
			number: 3 as 0 | 1 | 2 | 3 | 4 | 5,
			icon: <InventoryIcon />,
		},
		{
			text: 'Forum',
			link: 'forum',
			number: 4 as 0 | 1 | 2 | 3 | 4 | 5,
			icon: <ForumIcon />,
		},
		{
			text: 'Class Settings',
			link: 'settings',
			number: 5 as 0 | 1 | 2 | 3 | 4 | 5,
			icon: <SettingsIcon />,
		},
	]

	const [selected, setSelected] = React.useState<0 | 1 | 2 | 3 | 4 | 5>(0)
	const items = role === 'teacher' ? teacherItems : studentItems

	React.useEffect(() => {
		let pageSelected = 0 as 0 | 1 | 2 | 3 | 4 | 5
		const pageSlug = window.location.href.split('/').at(-1)

		if (role == 'teacher') {
			switch (pageSlug) {
				case 'tasks':
					pageSelected = 0
					break
				case 'requests':
					pageSelected = 1
					break
				case 'class':
					pageSelected = 2
					break
				case 'posts':
					pageSelected = 3
					break
				case 'settings':
					pageSelected = 4
					break
				default:
					pageSelected = 0
			}
		} else {
			switch (pageSlug) {
				case 'tasks':
					pageSelected = 0
					break
				case 'shop':
					pageSelected = 1
					break
				case 'class':
					pageSelected = 2
					break
				case 'inventory':
					pageSelected = 3
					break
				case 'posts':
					pageSelected = 4
					break
				case 'settings':
					pageSelected = 5
					break
				default:
					pageSelected = 0
			}
		}
		setSelected(pageSelected)
	}, [window.location.href.split('/').at(-1)])

	return (
		<React.Fragment>
			<CssBaseline />
			<AppBar position='fixed' color='primary' sx={{ top: 'auto', bottom: 0, overflowX: 'scroll' }}>
				<Toolbar>
					<IconButton
						sx={{ mr: 0.5 }}
						onClick={toggleDrawer}
						color='inherit'
						aria-label='open drawer'
					>
						<KeyboardArrowUpIcon />
					</IconButton>
					<Stack direction='row'>
						{items.map((item) => {
							return (
								<ListItemButtonStyled
									key={item.text}
									component={Link}
									to={item.link}
									onClick={() => setSelected(item.number)}
									selected={selected === item.number}
								>
									<ListItemIconStyled>{item.icon}</ListItemIconStyled>
								</ListItemButtonStyled>
							)
						})}
					</Stack>
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
