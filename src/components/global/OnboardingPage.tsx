import { Box, Grid, Tab, Tabs, TextField, Typography, useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import { User } from 'firebase/auth'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import {
	Body,
	Eyes,
	Hair,
	Pants,
	Shirt,
	Shoes,
	currentAvatar,
	getBodyItems,
	getEyesItems,
	getHairItems,
	getPantsItems,
	getShirtItems,
	getShoesItems,
} from '../../utils/items'
import { onboardClassroom, updateAvatar, updatePlayer } from '../../utils/mutations'
import { OnboardingItemCard } from '../student/OnboardingItemCard'
import Layout from './Layout'

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

export default function OnboardingPage({
	classroom,
	user,
	player,
}: {
	classroom: Classroom
	user: User
	player: Player
}) {
	const theme = useTheme()
	const [name, setName] = useState('')
	const [value, setValue] = useState(0)
	const [body, setBody] = useState<Body | null>(null)
	const [hair, setHair] = useState<Hair | null>(null)
	const [shirt, setShirt] = useState<Shirt | null>(null)
	const [shoe, setShoes] = useState<Shoes | null>(null)
	const [pant, setPants] = useState<Pants | null>(null)
	const [eye, setEyes] = useState<Eyes | null>(null)

	const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1 | 2 | 3 | 4) => {
		setValue(newValue)
	}
	const bodies = getBodyItems()
	const hairs = getHairItems()
	const shirts = getShirtItems()
	const pants = getPantsItems()
	const shoes = getShoesItems()
	const eyes = getEyesItems()

	// Check that name is filled AND (TODO) character has been chosen
	const handleSubmit = () => {
		const nameContainsNonWhitespaceChars = name.replace(/\s+/g, '') != ''
		if (!nameContainsNonWhitespaceChars) {
			enqueueSnackbar('Name cannot be empty', { variant: 'error' })
			return
		}
		if (!body) {
			enqueueSnackbar('Please select a skin color for your character', { variant: 'error' })
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
		console.log(eye)
		if (!eye) {
			enqueueSnackbar('Please select eyes for your character', { variant: 'error' })
			return
		}
		updatePlayer(user.uid, classroom.id, { name })
		updateAvatar(player, body, classroom)
		console.log(currentAvatar)
		updateAvatar(player, hair, classroom)
		updateAvatar(player, shirt, classroom)
		updateAvatar(player, shoe, classroom)
		updateAvatar(player, pant, classroom)
		updateAvatar(player, eye, classroom)
		onboardClassroom(user.uid, classroom.id)
	}

	function a11yProps(index: number) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		}
	}

	return (
		<Layout>
			<Grid item xs={12}>
				<Typography
					sx={{
						[theme.breakpoints.down('mobile')]: {
							fontSize: '30px',
						},
					}}
					variant='h2'
				>
					Your Character
				</Typography>
				<Typography variant='h5'>
					Customize your character&apos;s name and outfit, then enter the classroom!
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Button variant='contained' onClick={handleSubmit}>
					Enter Classroom
				</Button>
			</Grid>
			<Grid item xs={12}>
				<TextField
					id='classroom-name'
					label='Your Name'
					value={name}
					onChange={(event) => setName(event.target.value)}
				/>
			</Grid>

			<Grid item xs={12}>
				<Grid sx={{ display: 'flex', flexDirection: 'column' }} container>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
							<Tab label='Body' {...a11yProps(0)} />
							<Tab label='Hair' {...a11yProps(1)} />
							<Tab label='Shirts' {...a11yProps(2)} />
							<Tab label='Pants' {...a11yProps(3)} />
							<Tab label='Shoes' {...a11yProps(4)} />
							<Tab label='Eyes' {...a11yProps(5)} />
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
								{bodies.map((item, index) => (
									<Grid item xs={2} sm={3} md={3} key={index}>
										<OnboardingItemCard
											item={item}
											itemPrice=''
											bodyOutfit={{
												body: item,
												hair: new Hair(0, 'bob'),
												shirt: new Shirt(0),
												pants: new Pants(0),
												shoes: new Shoes(0),
												eyes: new Eyes(0),
											}}
											selectItemCallback={() => setBody(item)}
											isEquipped={body?.id === item.id}
										/>
									</Grid>
								))}
							</Grid>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{hairs.map((item, index) => (
									<Grid item xs={2} sm={3} md={3} key={index}>
										<OnboardingItemCard
											item={item}
											itemPrice=''
											selectItemCallback={() => setHair(item)}
											isEquipped={hair?.id === item.id && hair?.subtype === item.subtype}
										/>
									</Grid>
								))}
							</Grid>
						</TabPanel>
						<TabPanel value={value} index={2}>
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
						<TabPanel value={value} index={3}>
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
						<TabPanel value={value} index={4}>
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
						<TabPanel value={value} index={5}>
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{eyes.map((item, index) => (
									<Grid item xs={2} sm={3} md={3} key={index}>
										<OnboardingItemCard
											item={item}
											itemPrice=''
											selectItemCallback={() => setEyes(item)}
											isEquipped={eye?.id === item.id}
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
