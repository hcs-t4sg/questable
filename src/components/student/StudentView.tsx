import {
	Box,
	Divider,
	Grid,
	Typography,
	linearProgressClasses,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ClassStudent from '../../routes/student/ClassStudent'
import Shop from '../../routes/student/Shop'
import TasksStudent from '../../routes/student/TasksStudent'
import { currentAvatar } from '../../utils/items'
import Avatar from '../global/Avatar'
import Layout from '../global/Layout'
// import x from '../../public/static/'
import { User } from 'firebase/auth'
import { useEffect } from 'react'
import InventoryStudent from '../../routes/student/InventoryStudent'
import StudentSettings from '../../routes/student/StudentSettings'
import { Classroom, Player } from '../../types'
import { levelUp } from '../../utils/helperFunctions'
import { refreshAllRepeatables } from '../../utils/mutations'
import ForumView from '../forum/ForumView'

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

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

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
						<Typography
							variant='h2'
							sx={{ fontFamily: 'Superscript', fontSize: !mobile ? '50px' : '25px' }}
						>
							{classroom.name}
						</Typography>
						<Divider sx={{ borderColor: '#373d20', borderBottomWidth: 5, mt: 2, mb: 2 }} />
						<Typography
							variant='h3'
							sx={{ fontFamily: 'Superscript', fontSize: !mobile ? '45px' : '15px' }}
						>
							{player.name}
						</Typography>
						<Box sx={{ display: 'flex', marginTop: '20px' }}>
							<Box
								sx={{
									width: '20%',
									height: '40%',
									mt: !mobile ? 0 : 5,
									maxHeight: '312px',
									maxWidth: '313px',
								}}
							>
								{!mobile && <Avatar outfit={playerOutfit} />}
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
								<Typography sx={{ fontSize: !mobile ? '16px' : '8px', marginTop: '40px' }}>
									Name: {user.displayName}
								</Typography>
								<Typography sx={{ fontSize: !mobile ? '16px' : '8px', marginTop: '20px' }}>
									Email: {user.email}
								</Typography>
								<Typography sx={{ fontSize: !mobile ? '16px' : '8px', marginTop: '20px' }}>
									Gold: {player.money}
								</Typography>
								<Typography sx={{ fontSize: !mobile ? '16px' : '8px', marginTop: '20px' }}>
									Level: {levelUp(player.xp)}
								</Typography>
								<Typography
									sx={{
										marginTop: '0px',
										[theme.breakpoints.down('mobile')]: {
											fontSize: '10px',
										},
									}}
								>
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
					<Route path='/' element={<Navigate to='tasks' />} />
					<Route path='tasks' element={<TasksStudent classroom={classroom} player={player} />} />
					<Route path='shop' element={<Shop classroom={classroom} player={player} />} />
					<Route path='class' element={<ClassStudent player={player} classroom={classroom} />} />
					<Route
						path='inventory'
						element={<InventoryStudent player={player} classroom={classroom} />}
					/>
					<Route
						path='settings'
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
