import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import TeacherSettings from '../../routes/teacher/TeacherSettings'
import ClassTeacher from '../../routes/teacher/ClassTeacher'
import Requests from '../../routes/teacher/Requests'
import TasksTeacher from '../../routes/teacher/TasksTeacher'
import Layout from '../global/Layout'
import { Box, Grid, Typography } from '@mui/material'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'
import ForumView from '../forum/ForumView'

export default function TeacherView({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	return (
		<Layout classroom role={player?.role}>
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
						<Grid item xs={12}>
							<Typography variant='h2' component='div'>
								{classroom.name}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='h5' component='div'>
								{player.name}
							</Typography>{' '}
							{/* Do we want a separate user name?*/}
							<Typography variant='h5' component='div'>
								{classroom.playerList.length} Total Students
							</Typography>
						</Grid>
					</Box>
				</Grid>
				<Routes>
					<Route path='/' element={<Navigate to='tasks' />} />
					<Route path='tasks' element={<TasksTeacher player={player} classroom={classroom} />} />
					<Route path='requests' element={<Requests player={player} classroom={classroom} />} />
					<Route path='class' element={<ClassTeacher player={player} classroom={classroom} />} />
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
