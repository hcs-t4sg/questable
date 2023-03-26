import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Button, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { useState } from 'react'
import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Classroom, Player } from '../../types'
import CreateForumPostModal from './CreateForumPostModal'
import ForumPostList from './ForumPostList'
import ForumPostView from './ForumPostView'

export default function ForumView({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [open, setOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<-1 | 0 | 1 | 2 | 3>(-1)

	return (
		<>
			<Grid item xs={12}>
				<Typography variant='h2'>Forum</Typography>
				<h5>Post questions or comments in the class discussion below!</h5>
			</Grid>
			<Grid item xs={2}>
				<Button onClick={() => setOpen(true)} variant='contained' disableElevation>
					<EditOutlinedIcon />
					New Post
				</Button>
				<Typography variant='h6'>Categories</Typography>
				<List>
					<ListItem>
						<ListItemButton
							component={Link}
							to='posts'
							onClick={() => setSelectedCategory(-1)}
							selected={selectedCategory === -1}
						>
							All Posts
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							component={Link}
							to='posts'
							onClick={() => setSelectedCategory(0)}
							selected={selectedCategory === 0}
						>
							General
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							component={Link}
							to='posts'
							onClick={() => setSelectedCategory(1)}
							selected={selectedCategory === 1}
						>
							Assignment
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							component={Link}
							to='posts'
							onClick={() => setSelectedCategory(2)}
							selected={selectedCategory === 2}
						>
							For Fun
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							component={Link}
							to='posts'
							onClick={() => setSelectedCategory(3)}
							selected={selectedCategory === 3}
						>
							Announcements
						</ListItemButton>
					</ListItem>
				</List>
			</Grid>
			<Grid item xs={10}>
				<Routes>
					<Route path='/' element={<Navigate to='posts' />} />
					<Route
						path='posts'
						element={
							<ForumPostList
								player={player}
								classroom={classroom}
								categoryFilter={selectedCategory}
							/>
						}
					/>
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
