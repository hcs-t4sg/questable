import { Box, Typography } from '@mui/material'
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
import ForumHome from '../forum/ForumHome'
import ForumPost from '../forum/ForumPost'

export default function StudentView({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	// Given the IDs for the outfit fetched from Firebase (and the hair subtype), you can designate the avatar outfit like so.
	const playerOutfit = currentAvatar(player)

	// ! Will need to reinsert refresh repeatables here
	useEffect(() => {
		refreshAllRepeatables(classroom.id, player.id)
	})

	return (
		<Layout classroom role={player.role}>
			<Box
				sx={{
					width: '100%',
					height: '60%',
					display: 'flex',
					flexDirection: 'column',
					marginTop: '30px',
					marginBottom: '74px',
					paddingLeft: '80px',
					paddingRight: '80px',
					paddingBottom: '72px',
					paddingTop: '40px',
					borderColor: 'rgba(102, 187, 106, 0.5)',
					borderStyle: 'solid',
					borderWidth: '10px',
				}}
			>
				<Typography variant='h4'>{player.name}</Typography>
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
					<Box
						sx={{
							width: '350px',
							display: 'flex',
							flexDirection: 'column',
							marginLeft: '30px',
						}}
					>
						<Typography sx={{ fontSize: '25px', marginTop: '38px' }}>Powerups</Typography>
						<Typography sx={{ fontSize: '25px', marginTop: '38px' }}>Streak</Typography>
					</Box>
				</Box>
			</Box>
			<Routes>
				<Route path='/' element={<Navigate to='main' />} />
				<Route path='main' element={<Main classroom={classroom} player={player} />} />
				<Route path='shop' element={<Shop classroom={classroom} player={player} />} />
				<Route
					path='class-student'
					element={<ClassStudent player={player} classroom={classroom} />}
				>
					<Route path='forum' element={<ForumHome player={player} classroom={classroom} />}>
						<Route path=':postID/*' element={<ForumPost player={player} classroom={classroom} />} />
					</Route>
				</Route>
				<Route path='inventory' element={<Inventory player={player} classroom={classroom} />} />
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
