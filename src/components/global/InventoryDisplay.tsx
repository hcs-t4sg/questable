import { Box, Grid, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { InventoryItemCard } from '../student/InventoryItemCard'
import { Classroom, Item, Player } from '../../types'
import { currentAvatar, getBodyItems, getAllEyesItems } from '../../utils/items'
import wood2 from '/src/assets/Wood2.png'
import { TabPanel, a11yProps } from './Tabs'

// Display a user's inventory given a set of items
// TODO: The passing of props into InventoryDisplay could be better organized to avoid the use of many .filter() operations in this component

export default function InventoryDisplay({
	player,
	classroom,
	inventoryObjects,
}: {
	player: Player
	classroom: Classroom
	inventoryObjects: Item[]
}) {
	const [value, setValue] = React.useState(0)
	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
	}

	return (
		<Grid item xs={12}>
			<Grid sx={{ display: 'flex', flexDirection: 'column' }} container>
				<Grid item xs={12}>
					<Typography sx={{ fontSize: !mobile ? '50px' : '32px' }} variant='h2'>
						Inventory
					</Typography>
					<h5>Equip your avatar with items from your inventory!</h5>
				</Grid>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
						<Tab label='All' {...a11yProps(0)} />
						<Tab label='Bodies' {...a11yProps(1)} />
						<Tab label='Hair' {...a11yProps(2)} />
						<Tab label='Shirts' {...a11yProps(3)} />
						<Tab label='Pants' {...a11yProps(4)} />
						<Tab label='Shoes' {...a11yProps(5)} />
						<Tab label='Eyes' {...a11yProps(6)} />
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
					<TabPanel value={value} index={0}>
						{inventoryObjects.length === 0 ? (
							<Typography variant='h5' color='white' align='center'>
								No Items Yet!
							</Typography>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{inventoryObjects.map((item, index) => (
									<Grid item xs={2} sm={3} md={3} key={index}>
										<InventoryItemCard item={item} player={player} classroom={classroom} />
									</Grid>
								))}
							</Grid>
						)}
					</TabPanel>

					<TabPanel value={value} index={1}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{getBodyItems().map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<InventoryItemCard
										item={item}
										player={player}
										classroom={classroom}
										bodyOutfit={currentAvatar(player)}
									/>
								</Grid>
							))}
						</Grid>
					</TabPanel>

					<TabPanel value={value} index={2}>
						{inventoryObjects.filter((item) => item.type === 'hair').length === 0 ? (
							<Typography variant='h5' color='white' align='center'>
								No Items Yet!
							</Typography>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{inventoryObjects
									.filter((item) => item.type === 'hair')
									.map((item, index) => (
										<Grid item xs={2} sm={3} md={3} key={index}>
											<InventoryItemCard item={item} player={player} classroom={classroom} />
										</Grid>
									))}
							</Grid>
						)}
					</TabPanel>

					<TabPanel value={value} index={3}>
						{inventoryObjects.filter((item) => item.type === 'shirt').length === 0 ? (
							<Typography variant='h5' color='white' align='center'>
								No Items Yet!
							</Typography>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{inventoryObjects
									.filter((item) => item.type === 'shirt')
									.map((item, index) => (
										<Grid item xs={2} sm={3} md={3} key={index}>
											<InventoryItemCard item={item} player={player} classroom={classroom} />
										</Grid>
									))}
							</Grid>
						)}
					</TabPanel>

					<TabPanel value={value} index={4}>
						{inventoryObjects.filter((item) => item.type === 'pants').length === 0 ? (
							<Typography variant='h5' color='white' align='center'>
								No Items Yet!
							</Typography>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{inventoryObjects
									.filter((item) => item.type === 'pants')
									.map((item, index) => (
										<Grid item xs={2} sm={3} md={3} key={index}>
											<InventoryItemCard item={item} player={player} classroom={classroom} />
										</Grid>
									))}
							</Grid>
						)}
					</TabPanel>

					<TabPanel value={value} index={5}>
						{inventoryObjects.filter((item) => item.type === 'shoes').length === 0 ? (
							<Typography variant='h5' color='white' align='center'>
								No Items Yet!
							</Typography>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{inventoryObjects
									.filter((item) => item.type === 'shoes')
									.map((item, index) => (
										<Grid item xs={2} sm={3} md={3} key={index}>
											<InventoryItemCard item={item} player={player} classroom={classroom} />
										</Grid>
									))}
							</Grid>
						)}
					</TabPanel>
					<TabPanel value={value} index={6}>
						<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
							{getAllEyesItems().map((item, index) => (
								<Grid item xs={2} sm={3} md={3} key={index}>
									<InventoryItemCard item={item} player={player} classroom={classroom} />
								</Grid>
							))}
						</Grid>
					</TabPanel>
				</Box>
			</Grid>
		</Grid>
	)
}
