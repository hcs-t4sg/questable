import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ClassSettings from '../../routes/teacher/ClassSettings'
import ClassTeacher from '../../routes/teacher/ClassTeacher'
import Requests from '../../routes/teacher/Requests'
import Tasks from '../../routes/teacher/Tasks'
import Layout from '../global/Layout'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'
import { Grid } from '@mui/material'

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
			<Grid container spacing={3} sx={{ p: 5 }}>
				<Routes>
					<Route path='/' element={<Navigate to='tasks' />} />
					<Route path='tasks' element={<Tasks player={player} classroom={classroom} />} />
					<Route path='requests' element={<Requests player={player} classroom={classroom} />} />
					<Route
						path='class-teacher'
						element={<ClassTeacher player={player} classroom={classroom} />}
					/>
					<Route
						path='class-settings'
						element={<ClassSettings player={player} user={user} classroom={classroom} />}
					/>
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
