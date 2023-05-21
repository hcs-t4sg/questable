import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {
	Button,
	Grid,
	List,
	ListItem,
	ListItemButton,
	Typography,
	Stack,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { useState } from 'react'
import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Classroom, Player } from '../types'
import CreateForumPostModal from '../components/forum/CreateForumPostModal'
import ForumPostList from '../components/forum/ForumPostList'
import ForumPostView from '../components/forum/ForumPostView'

// Route displaying the forum page in a classroom

export default function ForumView({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [open, setOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<-1 | 0 | 1 | 2 | 3>(-1)
	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	const categoryButtons = [
		{
			name: 'All Posts',
			category: -1 as -1 | 0 | 1 | 2 | 3,
		},
		{
			name: 'General',
			category: 0 as -1 | 0 | 1 | 2 | 3,
		},
		{
			name: 'Assignment',
			category: 1 as -1 | 0 | 1 | 2 | 3,
		},
		{
			name: 'For Fun',
			category: 2 as -1 | 0 | 1 | 2 | 3,
		},
		{
			name: 'Announcements',
			category: 3 as -1 | 0 | 1 | 2 | 3,
		},
	]

	return (
		<Grid item xs={12}>
			<Typography sx={{ fontSize: !mobile ? '50px' : '32px' }} variant='h2'>
				Forum
			</Typography>
			<Typography variant='h5'>
				Post questions or comments in the class discussion below!
			</Typography>
			<Stack direction={!mobile ? 'row' : 'column'}>
				<List>
					<ListItem>
						<Button onClick={() => setOpen(true)} variant='contained' disableElevation>
							<EditOutlinedIcon />
							New Post
						</Button>
					</ListItem>
					<ListItem>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							Categories
						</Typography>
					</ListItem>
					{categoryButtons.map((cat) => (
						<ListItem key={cat.name}>
							<ListItemButton
								component={Link}
								to='posts'
								onClick={() => setSelectedCategory(cat.category)}
								selected={selectedCategory === cat.category}
							>
								{cat.name}
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Grid item xs={9.9}>
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
			</Stack>
		</Grid>
	)
}
