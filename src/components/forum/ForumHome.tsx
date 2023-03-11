import { Classroom, Player, ForumPost } from '../../types'
import Layout from '../global/Layout'
import { Button, Grid, List, ListItem, ListItemButton } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useEffect, useState } from 'react'
import ForumPostsModal from './ForumPostsModal'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import ForumPostCard from './ForumPostCard'

export default function ForumHome({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState('general')
	const [forumPosts, setForumPosts] = useState<ForumPost[]>([])

	const handleClickNT = () => {
		setOpen(true)
	}

	const isSelected = (str: string) => {
		return selected == str
	}

	useEffect(() => {
		const forumPostsRef = collection(db, `classrooms/${classroom.id}/forumPosts`)
		const forumPostsQuery = query(forumPostsRef)

		const unsub = onSnapshot(forumPostsQuery, (snapshot) => {
			const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ForumPost))
			console.log(forumPosts)
			setForumPosts(forumPosts)
		})
		// const unsub = onSnapshot(forumPostsQuery, (snapshot) => {
		// 	setForumPosts(
		// 		snapshot.docs.map((doc: ForumPost) => ({...doc.data(), id: doc.id} as ForumPost))
		// ))
		return unsub
	}, [classroom])

	return (
		<Layout>
			<Grid container xs={12} style={{ flexDirection: 'row' }}>
				<Grid item xs={2}>
					<Button onClick={handleClickNT} variant='contained' disableElevation>
						<EditOutlinedIcon />
						New Thread
					</Button>
					<h1>Categories</h1>
					<Grid container>
						<Grid item>
							<List>
								<ListItem>
									<ListItemButton
										onClick={() => setSelected('General')}
										selected={isSelected('General')}
									>
										General
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										onClick={() => setSelected('Assignment')}
										selected={isSelected('Assignment')}
									>
										Assignment
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										onClick={() => setSelected('For Fun')}
										selected={isSelected('For Fun')}
									>
										For Fun
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										onClick={() => setSelected('Starred')}
										selected={isSelected('Starred')}
									>
										Starred
									</ListItemButton>
								</ListItem>
							</List>
						</Grid>
					</Grid>
				</Grid>
				<Grid xs={10} item>
					{/* Forum Posts Displayed Here */}
					{forumPosts.map((post) => (
						<ForumPostCard player={player} classroom={classroom} forumPost={post} key={post.id} />
					))}
				</Grid>
			</Grid>
			<ForumPostsModal
				player={player}
				classroom={classroom}
				onClose={() => setOpen(false)}
				isOpen={open}
			/>
		</Layout>
	)
}
