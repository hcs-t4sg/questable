import { Box, DialogActions, Grid, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { User } from 'firebase/auth'
import Button from '@mui/material/Button'
import { enqueueSnackbar } from 'notistack'
import Layout from './Layout'
import { onboardClassroom, updatePlayer } from '../../utils/mutations'
import { OnboardingItemCard } from '../student/OnboardingItemCard'
import {
	getHairItems,
	getShirtItems,
	getPantsItems,
	getShoesItems,
	Hair,
	Pants,
	Shirt,
	Shoes,
} from '../../utils/items'
import { Classroom } from '../../types'

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

export default function OnboardingPage({ classroom, user }: { classroom: Classroom; user: User }) {
	const [name, setName] = useState('')
	const [value, setValue] = useState(0)
	const [hair, setHair] = useState<Hair | null>(null)
	const [shirt, setShirt] = useState<Shirt | null>(null)
	const [shoe, setShoes] = useState<Shoes | null>(null)
	const [pant, setPants] = useState<Pants | null>(null)

	const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1 | 2 | 3 | 4) => {
		setValue(newValue)
	}

	const hairs = getHairItems()
	const shirts = getShirtItems()
	const pants = getPantsItems()
	const shoes = getShoesItems()

	// Check that name is filled AND (TODO) character has been chosen
	const handleSubmit = () => {
		const nameContainsNonWhitespaceChars = name.replace(/\s+/g, '') != ''
		if (!nameContainsNonWhitespaceChars) {
			enqueueSnackbar('Name cannot be empty', { variant: 'error' })
			return
		}
		console.log(hair)
		if (!hair) {
			enqueueSnackbar('Please select hair for your character', { variant: 'error' })
			return
		}
		console.log(shirt)
		if (!shirt) {
			enqueueSnackbar('Please select a shirt for your character', { variant: 'error' })
			return
		}
		console.log(shoe)
		if (!shoe) {
			enqueueSnackbar('Please select shoes for your character', { variant: 'error' })
			return
		}
		console.log(pant)
		if (!pant) {
			enqueueSnackbar('Please select pants for your character', { variant: 'error' })
			return
		}
		updatePlayer(user.uid, classroom.id, { name })
		onboardClassroom(user.uid, classroom.id)
	}

	const enterClassButton = (
		<DialogActions>
			<Button variant='contained' onClick={handleSubmit}>
				Enter Classroom
			</Button>
		</DialogActions>
	)

	function a11yProps(index: number) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		}
	}

	return (
		<Layout>
			<Grid item xs={12}>
				<Typography variant='h2'>Your Character</Typography>
				<h5>Customize your character!</h5>
			</Grid>
			<div>
				<Grid item xs={12}>
					<TextField
						id='classroom-name'
						label='Your Name'
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
				</Grid>
				<Grid display='flex' justifyContent='flex-start' alignItems='flex-start'>
					<Grid item xs={12}>
						{enterClassButton}
					</Grid>
				</Grid>
			</div>
			<Grid item xs={12}>
				<Grid sx={{ display: 'flex', flexDirection: 'column' }} container>
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
							// backgroundImage: `url(${wood2})`,
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
										<OnboardingItemCard
											item={item}
											itemPrice=''
											selectItemCallback={() => setHair(item)}
											isEquipped={hair?.id === item.id}
										/>
									</Grid>
								))}
							</Grid>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{shirts.map((item, index) => (
									<Grid item xs={2} sm={3} md={3} key={index}>
										<OnboardingItemCard
											item={item}
											itemPrice=''
											selectItemCallback={() => setShirt(item)}
											isEquipped={shirt?.id === item.id}
										/>
									</Grid>
								))}
							</Grid>
						</TabPanel>
						<TabPanel value={value} index={2}>
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{pants.map((item, index) => (
									<Grid item xs={2} sm={3} md={3} key={index}>
										<OnboardingItemCard
											item={item}
											itemPrice=''
											selectItemCallback={() => setPants(item)}
											isEquipped={pant?.id === item.id}
										/>
									</Grid>
								))}
							</Grid>
						</TabPanel>
						<TabPanel value={value} index={3}>
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{shoes.map((item, index) => (
									<Grid item xs={2} sm={3} md={3} key={index}>
										<OnboardingItemCard
											item={item}
											itemPrice=''
											selectItemCallback={() => setShoes(item)}
											isEquipped={shoe?.id === item.id}
										/>
									</Grid>
								))}
							</Grid>
						</TabPanel>
					</Box>
				</Grid>
			</Grid>
		</Layout>
	)
}
