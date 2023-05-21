import { Box, Grid, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material'
import * as React from 'react'
import { Classroom, CustomShopItems, Player } from '../../types'
import {
	getHairItems,
	getAllPantsItems,
	getAllShirtItems,
	getAllShoesItems,
} from '../../utils/items'
import { ShopItemCard } from '../../components/student/ShopItemCard'
import { useState, useEffect } from 'react'
import wood2 from '/src/assets/Wood2.png'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { CustomItemCard } from '../../components/student/CustomItemCard'
import { TabPanel, a11yProps } from '../../components/global/Tabs'

const hairs = getHairItems()
const shirts = getAllShirtItems()
const pants = getAllPantsItems()
const shoes = getAllShoesItems()

// Route for displaying student shop

export default function Shop({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [currentTab, setCurrentTab] = useState(0)
	const [customShopItems, setCustomShopItems] = useState<CustomShopItems[] | null>(null)
	const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1 | 2 | 3 | 4) => {
		setCurrentTab(newValue)
	}

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	// Listen to custom shop items created by teacher
	useEffect(() => {
		const itemsRef = collection(db, `classrooms/${classroom.id}/customShopItems`)
		const itemsQuery = query(itemsRef)

		const unsub = onSnapshot(itemsQuery, (snapshot) => {
			const customShopItems = snapshot.docs.map(
				(doc) => ({ ...doc.data(), id: doc.id } as CustomShopItems),
			)
			const activeItems = customShopItems?.filter(
				(customShopItem) => customShopItem.isActive == true,
			)
			setCustomShopItems(activeItems)
		})
		return unsub
	}, [classroom])

	return (
		<Grid item xs={12}>
			<Grid sx={{ display: 'flex', flexDirection: 'column' }} container>
				<Grid item xs={12}>
					<Typography sx={{ fontSize: !mobile ? '50px' : '32px' }} variant='h2'>
						Shop
					</Typography>
					<Typography variant='h5'>
						Purchase avatars, accessories, and special rewards from the shop!
					</Typography>
				</Grid>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={currentTab} onChange={handleChange} aria-label='basic tabs example'>
						<Tab label='Hair' {...a11yProps(0)} />
						<Tab label='Shirts' {...a11yProps(1)} />
						<Tab label='Pants' {...a11yProps(2)} />
						<Tab label='Shoes' {...a11yProps(3)} />
						<Tab label='Custom Rewards' {...a11yProps(4)} />
					</Tabs>
				</Box>
				<Box
					sx={{
						backgroundImage: `url(${wood2})`,
						backgroundSize: '2000px',
						height: '100%',
						width: '100%',
						imageRendering: 'pixelated',
					}}
				>
					<TabPanel value={currentTab} index={0}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{hairs.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ShopItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='100g'
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{shirts.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ShopItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='150g'
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={currentTab} index={2}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{pants.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ShopItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='150g'
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={currentTab} index={3}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{shoes.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ShopItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='100g'
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={currentTab} index={4}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{customShopItems?.map((customShopItem, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<CustomItemCard
										item={customShopItem}
										player={player}
										classroom={classroom}
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={currentTab} index={4}></TabPanel>
				</Box>
			</Grid>
		</Grid>
	)
}
