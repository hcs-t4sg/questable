import { DialogActions, Grid, TextField } from '@mui/material'
import { useState } from 'react'
import { User } from 'firebase/auth'
import Button from '@mui/material/Button'
import { enqueueSnackbar } from 'notistack'
// import { getHairItems, getShirtItems, getPantsItems, getShoesItems } from '../../utils/items'
import { Classroom } from '../../types'
// import { ItemCard } from '../student/ItemCard'
import Layout from './Layout'
import { onboardClassroom, updatePlayer } from '../../utils/mutations'

// interface TabPanelProps {
// 	children?: React.ReactNode
// 	index: number
// 	value: number
// }

// function TabPanel(props: TabPanelProps) {
// 	const { children, value, index, ...other } = props

// 	return (
// 		<div
// 			role='tabpanel'
// 			hidden={value !== index}
// 			id={`simple-tabpanel-${index}`}
// 			aria-labelledby={`simple-tab-${index}`}
// 			{...other}
// 		>
// 			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
// 		</div>
// 	)
// }

export default function OnboardingPage({ classroom, user }: { classroom: Classroom; user: User }) {
	const [name, setName] = useState('')
	// const[value, setValue] = useState(0)

	// const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1 | 2 | 3 | 4) => {
	// 	setValue(newValue)
	// }

	// const hairs = getHairItems()
	// const shirts = getShirtItems()
	// const pants = getPantsItems()
	// const shoes = getShoesItems()

	// Check that name is filled AND (TODO) character has been chosen
	const handleSubmit = () => {
		const nameContainsNonWhitespaceChars = name.replace(/\s+/g, '') != ''
		if (!nameContainsNonWhitespaceChars) {
			enqueueSnackbar('Name cannot be empty', { variant: 'error' })
			return
		}
		updatePlayer(user.uid, classroom.id, { name })
		onboardClassroom(user.uid, classroom.id)
	}

	// Button - Enter Classroom: only show if it has alphanumeric characters and (TODO) avatar should have body hair pants and shoes
	const enterClassButton = (
		<DialogActions>
			<Button variant='contained' onClick={handleSubmit}>
				Enter Classroom
			</Button>
		</DialogActions>
	)

	// function a11yProps(index: number) {
	// 	return {
	// 		id: `simple-tab-${index}`,
	// 		'aria-controls': `simple-tabpanel-${index}`,
	// 	}
	// }

	return (
		// Allow user to set their name
		<Layout>
			<div>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<TextField
							id='classroom-name'
							label='Your Name'
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
						{enterClassButton}
					</Grid>
				</Grid>
			</div>

			{/* // Render something similar to the shop (can reuse code from Shop) - let them select hair, skin color, outfit (shirt/pants/shoes) */}
			{/* <Grid item xs={12}> 
			<Grid sx={{ display: 'flex', flexDirection: 'column' }} container>
				<Grid item xs={12}>
					<Typography variant='h2'>Shop</Typography>
					<h5>Customize your character!</h5>
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
									<ItemCard
										item={item}
										player={player}
										classroom={classroom}
										itemPrice=''
										type='shop'
										isBody={false} 								/>
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
										itemPrice=''
										type='shop'
										isBody={false} 									/>
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
										itemPrice=''
										type='shop'
										isBody={false} 								/>
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
										itemPrice=''
										type='shop'
										isBody={false} 							/>
								</Grid>
							))}
						</Grid>
					</TabPanel>
				</Box>
			</Grid>
		</Grid> */}
		</Layout>
	)
}
