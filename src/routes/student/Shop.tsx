import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import * as React from 'react'
// import ShopItemCard from '../../components/student/ShopItemCard'
import { Classroom, Player } from '../../types'
import { getHairItems, getPantsItems, getShirtItems, getShoesItems } from '../../utils/items'
import { ItemCard } from '../../components/student/ItemCard'
// import { Classroom, Player } from '../../types'
import { useState } from 'react'
import wood2 from '/src/assets/Wood2.png'
import { Typography } from '@mui/material'

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

	return (
		<Grid item xs={12}>
			<Grid sx={{ display: 'flex', flexDirection: 'column' }} container>
				{/* spacing={3} for above grid? */}
				<Grid item xs={12}>
					<Typography variant='h2'>Shop</Typography>
					<h5>Purchase avatars, accessories, and special rewards from the shop!</h5>
				</Grid>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
						<Tab label='Hair' {...a11yProps(0)} />
						<Tab label='Shirts' {...a11yProps(1)} />
						<Tab label='Pants' {...a11yProps(2)} />
						<Tab label='Shoes' {...a11yProps(3)} />
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
					{' '}
					<TabPanel value={value} index={0}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{hairs.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='100g'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{shirts.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='150g'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{pants.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='150g'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
					<TabPanel value={value} index={3}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{shoes.map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice='100g'
										type='shop'
										isBody={false}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
				</Box>
			</Grid>
		</Grid>
	)
}
