import AssignmentIcon from '@mui/icons-material/Assignment'
import EmailIcon from '@mui/icons-material/Email'
import ForumIcon from '@mui/icons-material/Forum'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import SellIcon from '@mui/icons-material/Sell'
import SettingsIcon from '@mui/icons-material/Settings'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'

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

interface Item {
	text: string
	link: string
	number: 0 | 1 | 2 | 3 | 4 | 5 | 6
	icon: JSX.Element
}

const ListItems = ({
	items,
	selected,
	setSelected,
}: {
	items: Item[]
	selected: 0 | 1 | 2 | 3 | 4 | 5 | 6
	setSelected: (_: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void
}) => {
	return (
		<React.Fragment>
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
						<ListItemText primary={item.text} />
					</ListItemButtonStyled>
				)
			})}
		</React.Fragment>
	)
}

export function MainListItemsTeacher() {
	const pageSlug = window.location.href.split('/').at(-1)
	let selectedInit = 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6
	switch (pageSlug) {
		case 'tasks':
			selectedInit = 0
			break
		case 'requests':
			selectedInit = 1
			break
		case 'class':
			selectedInit = 2
			break
		case 'inventory':
			selectedInit = 3
			break
		case 'shop':
			selectedInit = 4
			break
		case 'posts':
			selectedInit = 5
			break
		case 'settings':
			selectedInit = 6
			break
		default:
			selectedInit = 0
	}

	const [selected, setSelected] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(selectedInit)

	const teacherItems = [
		{
			text: 'Tasks',
			link: 'tasks',
			number: 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
			icon: <AssignmentIcon />,
		},
		{
			text: 'Requests',
			link: 'requests',
			number: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
			icon: <EmailIcon />,
		},
		{
			text: 'Class',
			link: 'class',
			number: 2 as 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
			icon: <GroupIcon />,
		},
		{
			text: 'Inventory',
			link: 'inventory',
			number: 3 as 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
			icon: <InventoryIcon />,
		},
		{
			text: 'Shop',
			link: 'shop',
			number: 4 as 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
			icon: <AddCircleRoundedIcon />,
		},
		{
			text: 'Forum',
			link: 'forum',
			number: 5 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
			icon: <ForumIcon />,
		},
		{
			text: 'Class Settings',
			link: 'settings',
			number: 6 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
			icon: <SettingsIcon />,
		},
	]

	return <ListItems items={teacherItems} selected={selected} setSelected={setSelected} />
}

export function MainListItemsStudent() {
	const pageSlug = window.location.href.split('/').at(-1)
	let selectedInit = 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6
	switch (pageSlug) {
		case 'tasks':
			selectedInit = 0
			break
		case 'shop':
			selectedInit = 1
			break
		case 'class':
			selectedInit = 2
			break
		case 'inventory':
			selectedInit = 3
			break
		case 'posts':
			selectedInit = 4
			break
		case 'settings':
			selectedInit = 5
			break
		default:
			selectedInit = 0
	}

	const [selected, setSelected] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(selectedInit)

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
	return <ListItems items={studentItems} selected={selected} setSelected={setSelected} />
}
