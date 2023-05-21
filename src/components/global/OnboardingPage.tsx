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
	getBodyItems,
	getAllEyesItems,
	getHairItems,
	getAllPantsItems,
	getAllShirtItems,
	getAllShoesItems,
} from '../../utils/items'
import { updateAvatar, updatePlayer } from '../../utils/mutations/users'
import { onboardClassroom } from '../../utils/mutations/classroom'
import { OnboardingItemCard } from '../student/OnboardingItemCard'
import Layout from './Layout'
import { TabPanel, a11yProps } from './Tabs'

// Onboarding page prompting user to specify avatar and name upon entering a classroom for the first time

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
	const bodyOptions = getBodyItems()
	const hairOptions = getHairItems()
	const shirtOptions = getAllShirtItems()
	const pantsOptions = getAllPantsItems()
	const shoesOptions = getAllShoesItems()
	const eyesOptions = getAllEyesItems()

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
		if (!hair) {
			enqueueSnackbar('Please select hair for your character', { variant: 'error' })
			return
		}
		if (!shirt) {
			enqueueSnackbar('Please select a shirt for your character', { variant: 'error' })
			return
		}
		if (!shoe) {
			enqueueSnackbar('Please select shoes for your character', { variant: 'error' })
			return
		}
		if (!pant) {
			enqueueSnackbar('Please select pants for your character', { variant: 'error' })
			return
		}
		if (!eye) {
			enqueueSnackbar('Please select eyes for your character', { variant: 'error' })
			return
		}

		// TODO: updateAvatar can be redesigned to avoid having to make many db calls here, or write a new function that sets the entire avatar at once
		updatePlayer(user.uid, classroom.id, { name })
		updateAvatar(player, body, classroom)
		updateAvatar(player, hair, classroom)
		updateAvatar(player, shirt, classroom)
		updateAvatar(player, shoe, classroom)
		updateAvatar(player, pant, classroom)
		updateAvatar(player, eye, classroom)
		onboardClassroom(user.uid, classroom.id)
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
							<Tab label='Shirt' {...a11yProps(2)} />
							<Tab label='Pants' {...a11yProps(3)} />
							<Tab label='Shoes' {...a11yProps(4)} />
							<Tab label='Eyes' {...a11yProps(5)} />
						</Tabs>
					</Box>
					<Box
						sx={{
							backgroundSize: '2000px',
							height: '100%',
							width: '100%',
							imageRendering: 'pixelated',
						}}
					>
						{' '}
						<TabPanel value={value} index={0}>
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{bodyOptions.map((item, index) => (
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
								{hairOptions.map((item, index) => (
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
								{shirtOptions.map((item, index) => (
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
								{pantsOptions.map((item, index) => (
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
								{shoesOptions.map((item, index) => (
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
								{eyesOptions.map((item, index) => (
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
