import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ClassSettings from '../../routes/teacher/ClassSettings'
import ClassTeacher from '../../routes/teacher/ClassTeacher'
import Requests from '../../routes/teacher/Requests'
import Tasks from '../../routes/teacher/Tasks'
import Layout from '../global/Layout'
import ForumPost from '../forum/ForumPost'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'
import ForumHome from '../forum/ForumHome'

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

				<Route path='forum' element={<ForumHome player={player} classroom={classroom} />}>
					<Route path=':postID/*' element={<ForumPost player={player} classroom={classroom} />} />
				</Route>
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
		</Layout>
	)
}
