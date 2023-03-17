import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Button, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Classroom, Player } from '../../types'
import CreateForumPostModal from './CreateForumPostModal'
import ForumPostList from './ForumPostList'
import ForumPostView from './ForumPostView'

export default function ForumView({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState<0 | 1 | 2 | 3>(0)

	return (
		<>
			<Grid item xs={12}>
				<Typography variant='h2'>Forum</Typography>
			</Grid>
			<Grid item xs={2}>
				<Button onClick={() => setOpen(true)} variant='contained' disableElevation>
					<EditOutlinedIcon />
					New Thread
				</Button>
				<Typography variant='h6'>Categories</Typography>
				<List>
					<ListItem>
						<ListItemButton onClick={() => setSelected(0)} selected={selected === 0}>
							General
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => setSelected(1)} selected={selected === 1}>
							Assignment
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => setSelected(2)} selected={selected === 2}>
							For Fun
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => setSelected(3)} selected={selected === 3}>
							Starred
						</ListItemButton>
					</ListItem>
				</List>
			</Grid>
			<Grid item xs={10}>
				<Routes>
					<Route path='/' element={<Navigate to='posts' />} />
					<Route path='posts' element={<ForumPostList player={player} classroom={classroom} />} />
					<Route
						path='/posts/:postID'
						element={<ForumPostView player={player} classroom={classroom} />}
					/>
				</Routes>
				<Outlet />
				<CreateForumPostModal
					player={player}
					classroom={classroom}
					onClose={() => setOpen(false)}
					isOpen={open}
				/>
			</Grid>
		</>
	)
}
