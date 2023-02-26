import { Classroom, Player } from '../../types'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Layout from '../global/Layout'
import General from './General'

export default function ForumView({ player, classroom }: { player: Player; classroom: Classroom }) {
	return (
		<Layout>
			<Routes>
				<Route path='/' element={<Navigate to='general' />} />
				<Route path='general' element={<General player={player} classroom={classroom} />} />
				{/* <Route path='assignments' element={<Assignments player={player} classroom={classroom} />} /> */}
				{/* <Route path='classdiscussion' element={<ClassDiscussion player={player} classroom={classroom} />} />
				<Route path='forfun' element={<ForFun player={player} classroom={classroom} />} />
				<Route path='starredposts' element={<StarredPosts player={player} classroom={classroom} />} /> */}
				{/* <Route
					path='class-teacher'
					element={<ClassTeacher player={player} classroom={classroom} />}
				/>
				<Route
					path='class-settings'
					element={<ClassSettings player={player} user={user} classroom={classroom} />}
				/> */}
			</Routes>
			<Outlet />
		</Layout>
	)
}
