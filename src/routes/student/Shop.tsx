import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import * as React from 'react'
// import ShopItemCard from '../../components/student/ShopItemCard'
import { Classroom, Player } from '../../types'
import {
	getBodyItems,
	getHairItems,
	getPantsItems,
	getShirtItems,
	getShoesItems,
} from '../../utils/items'
import { ItemCard } from '../../components/student/ItemCard'
// import { Classroom, Player } from '../../types'
import { useState } from 'react'
import wood2 from '/src/assets/Wood2.png'

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
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

const bodies = getBodyItems()
const hairs = getHairItems()
const shirts = getShirtItems()
const pants = getPantsItems()
const shoes = getShoesItems()
//  const all = bodies.concat(hairs, shirts, pants, shoes)

export default function Shop({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [value, setValue] = useState(0)
	const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1 | 2 | 3 | 4) => {
		setValue(newValue)
	}

	const divStyle = {
		height: '100%',
		width: '100%',
		backgroundImage: `url(${wood2})`,
		backgroundSize: 'contain',
	}

	return (
		<Grid item xs={12}>
			<Grid sx={{ display: 'flex', flexDirection: 'column' }} container spacing={3}>
				<Grid item xs={12}>
					<h3>Shop</h3>
					<h5>Purchase avatars, accessories, and special rewards from the shop!</h5>
				</Grid>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
						<Tab label='Body' {...a11yProps(0)} />
						<Tab label='Hair' {...a11yProps(1)} />
						<Tab label='Shirts' {...a11yProps(2)} />
						<Tab label='Pants' {...a11yProps(3)} />
						<Tab label='Shoes' {...a11yProps(4)} />
					</Tabs>
				</Box>
				<div style={divStyle}>
					<TabPanel value={value} index={0}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{Array.from(bodies).map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									{/* <ShopItemCard player={player} classroom={classroom} itemPrice='Free' item={item} /> */}
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='Free'
										type='shop'
										isBody={true}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{Array.from(hairs).map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									{/* <ShopItemCard player={player} classroom={classroom} item={item} itemPrice='$100' /> */}
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='$100'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{Array.from(shirts).map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									{/* <ShopItemCard player={player} classroom={classroom} item={item} itemPrice='$150' /> */}
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='$150'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={value} index={3}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{Array.from(pants).map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									{/* <ShopItemCard player={player} classroom={classroom} item={item} itemPrice='$150' /> */}
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='$150'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={value} index={4}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{Array.from(shoes).map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									{/* <ShopItemCard player={player} classroom={classroom} item={item} itemPrice='$100' /> */}
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='$100'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
				</div>
			</Grid>
		</Grid>
	)
}
