import { Box, Grid, Typography } from '@mui/material'
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
// import { styled } from '@mui/material/styles'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ClassStudent from '../../routes/student/ClassStudent'
import Inventory from '../../routes/student/Inventory'
import Main from '../../routes/student/Main'
import Shop from '../../routes/student/Shop'
import { currentAvatar } from '../../utils/items'
import Avatar from '../global/Avatar'
import Layout from '../global/Layout'

// import x from '../../public/static/'
import { useEffect } from 'react'
import { Classroom, Player } from '../../types'
import { refreshAllRepeatables } from '../../utils/mutations'
import ForumView from '../forum/ForumView'
import { User } from 'firebase/auth'

export default function StudentView({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	// const ThickProgress = styled(LinearProgress)(() => ({
	// 	height: 20,
	// 	borderRadius: 0,
	// 	marginTop: 50,
	// 	[`&.${linearProgressClasses.colorPrimary}`]: {
	// 		backgroundColor: 'rgba(102, 187, 106, .5)',
	// 	},
	// 	[`& .${linearProgressClasses.bar}`]: {
	// 		borderRadius: 0,
	// 		backgroundColor: '#1B710D',
	// 	},
	// }))

	// Given the IDs for the outfit fetched from Firebase (and the hair subtype), you can designate the avatar outfit like so.
	const playerOutfit = currentAvatar(player)

	// ! Will need to reinsert refresh repeatables here
	useEffect(() => {
		refreshAllRepeatables(classroom.id, player.id)
	})

	return (
		<Layout classroom role={player.role}>
			<Grid container spacing={3} sx={{ p: 5 }}>
				<Grid item xs={12}>
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							// marginTop: '30px',
							// marginBottom: '74px',
							paddingLeft: '80px',
							paddingRight: '80px',
							paddingBottom: '72px',
							paddingTop: '40px',
							borderColor: '#373d20',
							borderStyle: 'solid',
							borderWidth: '10px',
							backgroundColor: '#f3f8df',
						}}
					>
						<Typography variant='h3' sx={{ fontFamily: 'Superscript' }}>
							{player.name}
						</Typography>
						<Box sx={{ display: 'flex', marginTop: '20px' }}>
							<Box
								sx={{
									width: '20%',
									height: '40%',
									maxHeight: '312px',
									maxWidth: '313px',
								}}
							>
								<Avatar outfit={playerOutfit} />
							</Box>
							{/* <Box
								sx={{
									width: '350px',
									display: 'flex',
									flexDirection: 'column',
									marginLeft: '160px',
								}}
							>
								<ThickProgress variant='determinate' value={30} />
								<ThickProgress variant='determinate' value={60} />
							</Box> */}
							<Box
								sx={{
									width: '350px',
									display: 'flex',
									flexDirection: 'column',
									marginLeft: '50px',
								}}
							>
								<Typography sx={{ fontSize: '16px', marginTop: '40px' }}>
									Name: {user.displayName}
								</Typography>
								<Typography sx={{ fontSize: '16px', marginTop: '20px' }}>
									Email: {user.email}
								</Typography>
								<Typography sx={{ fontSize: '16px', marginTop: '20px' }}>
									Gold: {player.money}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Grid>
				<Routes>
					<Route path='/' element={<Navigate to='main' />} />
					<Route path='main' element={<Main classroom={classroom} player={player} />} />
					<Route path='shop' element={<Shop classroom={classroom} player={player} />} />
					<Route
						path='class-student'
						element={<ClassStudent player={player} classroom={classroom} />}
					/>
					<Route path='inventory' element={<Inventory player={player} classroom={classroom} />} />
					<Route path='forum/*' element={<ForumView player={player} classroom={classroom} />} />
					<Route
						path='*'
						element={
							<main style={{ padding: '1rem' }}>
								<p>There&apos;s nothing here!</p>
							</main>
						}
					/>
				</Routes>
				<Outlet />
			</Grid>
		</Layout>
	)
}
