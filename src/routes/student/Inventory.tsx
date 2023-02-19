import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { collection, onSnapshot, query } from 'firebase/firestore'
import React, { useEffect } from 'react'
import Layout from '../../components/global/Layout'
import { db } from '../../utils/firebase'
// import ReactDOM from "react-dom"
import { Box } from '@mui/system'
import InventoryItemCard from '../../components/student/InventoryItemCard'
import { Classroom, DatabaseInventoryItem, Item, Player } from '../../types'
import { getBodyItems, Hair, Pants, Shirt, Shoes } from '../../utils/items'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

export default function Inventory({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [value, setValue] = React.useState(0)
	const [inventoryItems, setInventoryItems] = React.useState<DatabaseInventoryItem[]>([])

	// Listens for changes in the inventory items
	useEffect(() => {
		const q = query(collection(db, `classrooms/${classroom.id}/players/${player.id}/inventory`))

		onSnapshot(q, (snapshot) => {
			const inventoryList = snapshot.docs.map((doc) => doc.data())
			setInventoryItems(inventoryList as DatabaseInventoryItem[])
		})
	}, [player, classroom])

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
	}

	const inventoryObjects: Item[] = []

	console.log(inventoryItems)

	inventoryItems.forEach((item) => {
		if (item.type === 'hair') {
			if (item.subtype) {
				inventoryObjects.push(new Hair(item.itemId, item.subtype))
			}
		} else if (item.type === 'shirt') {
			inventoryObjects.push(new Shirt(item.itemId))
		} else if (item.type === 'pants') {
			inventoryObjects.push(new Pants(item.itemId))
		} else if (item.type === 'shoes') {
			inventoryObjects.push(new Shoes(item.itemId))
		}
	})

	console.log(inventoryObjects)
	console.log(getBodyItems())

	return (
		<Layout>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
					<Tab label='All' {...a11yProps(0)} />
					<Tab label='Bodies' {...a11yProps(1)} />
					<Tab label='Hair' {...a11yProps(2)} />
					<Tab label='Shirts' {...a11yProps(3)} />
					<Tab label='Pants' {...a11yProps(4)} />
					<Tab label='Shoes' {...a11yProps(5)} />
				</Tabs>
			</Box>

			<TabPanel value={value} index={0}>
				<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
					{inventoryObjects.map((item, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<InventoryItemCard item={item} player={player} classroom={classroom} />
						</Grid>
					))}
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={1}>
				<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
					{getBodyItems().map((item, index) => (
						<Grid item xs={2} sm={3} md={3} key={index}>
							<InventoryItemCard item={item} player={player} classroom={classroom} />
						</Grid>
					))}
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={2}>
				{inventoryObjects
					.filter((item) => item.type === 'hair')
					.map((item, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<InventoryItemCard item={item} player={player} classroom={classroom} />
						</Grid>
					))}
			</TabPanel>

			<TabPanel value={value} index={3}>
				{inventoryObjects
					.filter((item) => item.type === 'shirt')
					.map((item, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<InventoryItemCard item={item} player={player} classroom={classroom} />
						</Grid>
					))}
			</TabPanel>

			<TabPanel value={value} index={4}>
				{inventoryObjects
					.filter((item) => item.type === 'pants')
					.map((item, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<InventoryItemCard item={item} player={player} classroom={classroom} />
						</Grid>
					))}
			</TabPanel>

			<TabPanel value={value} index={5}>
				{inventoryObjects
					.filter((item) => item.type === 'shoes')
					.map((item, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<InventoryItemCard item={item} player={player} classroom={classroom} />
						</Grid>
					))}
			</TabPanel>
		</Layout>
	)
}

// 1) Given an id for a particular item
// 2) Go to the correct location on the spritesheet
// Display the item on the inventory page.

// We'll have a final json file that maps the player items to the correct sprite item.