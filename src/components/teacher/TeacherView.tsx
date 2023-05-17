import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import TeacherSettings from '../../routes/teacher/TeacherSettings'
import ClassTeacher from '../../routes/teacher/ClassTeacher'
import Requests from '../../routes/teacher/Requests'
import TasksTeacher from '../../routes/teacher/TasksTeacher'
import Layout from '../global/Layout'
import { Box, Divider, Grid, Typography, useTheme, useMediaQuery } from '@mui/material'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'
import ForumView from '../forum/ForumView'
import InventoryTeacher from './InventoryTeacher'
import ShopTeacher from './ShopTeacher'
import Avatar from '../global/Avatar'
import { currentAvatar } from '../../utils/items'

export default function TeacherView({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	const playerOutfit = currentAvatar(player)

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

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
							paddingTop: '40px',
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
						<Typography variant='h5' component='div'>
							{classroom.playerList.length} Total Students
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
									maxHeight: '312px',
									maxWidth: '313px',
								}}
							>
								{!mobile && <Avatar outfit={playerOutfit} />}
							</Box>
							<Box
								sx={{
									width: '350px',
									display: 'flex',
									flexDirection: 'column',
									marginLeft: '50px',
								}}
							>
								<Typography sx={{ fontSize: !mobile ? '16px' : '10px', marginTop: '40px' }}>
									Name: {user.displayName}
								</Typography>
								<Typography sx={{ fontSize: !mobile ? '16px' : '10px', marginTop: '20px' }}>
									Email: {user.email}
								</Typography>
								<Typography sx={{ fontSize: !mobile ? '16px' : '10px', marginTop: '20px' }}>
									Gold: {player.money}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Grid>
				<Routes>
					<Route path='/' element={<Navigate to='tasks' />} />
					<Route path='tasks' element={<TasksTeacher player={player} classroom={classroom} />} />
					<Route path='requests' element={<Requests player={player} classroom={classroom} />} />
					<Route path='class' element={<ClassTeacher player={player} classroom={classroom} />} />
					<Route
						path='inventory'
						element={<InventoryTeacher player={player} classroom={classroom} />}
					/>
					<Route path='shop' element={<ShopTeacher classroom={classroom} />} />
					<Route
						path='settings'
						element={<TeacherSettings player={player} user={user} classroom={classroom} />}
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
