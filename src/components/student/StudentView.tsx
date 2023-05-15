import { Box, Grid, Typography, linearProgressClasses } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
// import LinearProgress from '@mui/joy/LinearProgress'
import { styled } from '@mui/material/styles'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ClassStudent from '../../routes/student/ClassStudent'
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
import StudentSettings from '../../routes/student/StudentSettings'
import { levelUp } from '../../utils/helperFunctions'
import InventoryStudent from '../../routes/student/InventoryStudent'

export default function StudentView({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	const ThickProgress = styled(LinearProgress)(() => ({
		height: 20,
		borderRadius: 0,
		marginTop: 20,
		[`&.${linearProgressClasses.colorPrimary}`]: {
			backgroundColor: 'rgba(102, 187, 106, .5)',
		},
		[`& .${linearProgressClasses.bar}`]: {
			borderRadius: 0,
			backgroundColor: '#1B710D',
		},
	}))

	// Given the IDs for the outfit fetched from Firebase (and the hair subtype), you can designate the avatar outfit like so.
	const playerOutfit = currentAvatar(player)

	// ! Will need to reinsert refresh repeatables here
	useEffect(() => {
		refreshAllRepeatables(classroom.id, player.id)
	})

	// Calculate xp of player towards next level
	const now = player.xp - (2.5 * Math.pow(levelUp(player.xp), 2) + 37.5 * levelUp(player.xp) - 40)

	// Calculate xp needed for next level
	const next =
		2.5 * Math.pow(levelUp(player.xp) + 1, 2) +
		37.5 * (levelUp(player.xp) + 1) -
		40 -
		(2.5 * Math.pow(levelUp(player.xp), 2) + 37.5 * levelUp(player.xp) - 40)

	// Calculate progress to next level
	const progress = (now / next) * 100

	return (
		<Layout classroom role={player.role}>
			<Grid container spacing={3}>
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
							paddingTop: '10px',
							borderColor: '#373d20',
							borderStyle: 'solid',
							borderWidth: '10px',
							backgroundColor: '#f3f8df',
						}}
					>
						<Typography variant='h2' sx={{ fontFamily: 'Superscript' }}>
							{classroom.name}
						</Typography>
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
							> */}
							{/* <ThickProgress variant='determinate' value={60} /> */}
							{/* </Box> */}
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
								<Typography sx={{ fontSize: '16px', marginTop: '20px' }}>
									Level: {levelUp(player.xp)}
								</Typography>
								<Typography sx={{ marginTop: '0px' }}>
									<ThickProgress variant='determinate' value={progress} /> {now}/{next} xp to next
									level!
								</Typography>
							</Box>
							{/* <Box
								sx={{
									width: '350px',
									display: 'flex',
									flexDirection: 'column',
									marginLeft: '160px',
								}}
							> */}
							{/* </Box> */}
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
					<Route
						path='inventory'
						element={<InventoryStudent player={player} classroom={classroom} />}
					/>
					<Route
						path='student-settings'
						element={<StudentSettings player={player} classroom={classroom} user={user} />}
					/>
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
