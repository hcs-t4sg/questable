import { Typography, Stack, useMediaQuery, useTheme } from '@mui/material'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, ForumPost, Player } from '../../types'
import { db } from '../../utils/firebase'
import ForumPostCard from './ForumPostCard'
import { getPlayerData } from '../../utils/mutations/users'
import Loading from '../global/Loading'
import Fuse from 'fuse.js'
import TextField from '@mui/material/TextField'

// Lists forum posts in a particular classroom

export default function ForumPostList({
	player,
	classroom,
	categoryFilter,
}: {
	player: Player
	classroom: Classroom
	categoryFilter: -1 | 0 | 1 | 2 | 3
}) {
	const [originalPosts, setOriginalPosts] = useState<ForumPost[] | null>(null)
	const [forumPosts, setForumPosts] = useState<ForumPost[] | null>(null)
	const [fuse, newFuse] = useState(new Fuse<ForumPost>([]))
	const [searchInput, setInput] = useState('')
	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	const categoryTitles = {
		'-1': 'All Posts',
		'0': 'General',
		'1': 'Assignment',
		'2': 'For Fun',
		'3': 'Starred',
	}

	// Listen to forum posts
	useEffect(() => {
		const forumPostsRef = collection(db, `classrooms/${classroom.id}/forumPosts`)
		const forumPostsQuery = query(forumPostsRef, orderBy('postTime', 'desc'))

		const options = {
			keys: ['title', 'content'],
			includeScore: true,
			threshold: 0.4,
			minMatchCharLength: 3,
		}

		const unsub = onSnapshot(forumPostsQuery, (snapshot) => {
			const appendAuthorsToPosts = async () => {
				const postList: ForumPost[] = []
				await Promise.all(
					snapshot.docs.map(async (doc) => {
						const author = await getPlayerData(classroom.id, doc.data().author)
						if (author) {
							const postData = { ...doc.data(), id: doc.id } as ForumPost
							postData.author = author
							postList.push(postData)
						}
					}),
				)
				setForumPosts(postList)
				setOriginalPosts(postList)
				newFuse(new Fuse(postList, options))
			}
			appendAuthorsToPosts().catch(console.error)
		})
		return unsub
	}, [player, classroom])

	// Update displayed forum posts based on search query
	// TODO: A useEffect may not be necessary here. You could just filter the queried forum posts according to searchInput before returning. The current structure of two state variables (forumPosts and originalPosts) and two different useEffects managing forumPosts seems a bit complex and could possibly be simplified.
	useEffect(() => {
		let searchedPosts = [] as ForumPost[] | null

		if (searchInput != '') {
			searchedPosts = fuse.search(searchInput).map((elem) => elem.item)
		} else {
			searchedPosts = originalPosts
		}

		if (categoryFilter == -1) {
			setForumPosts(searchedPosts)
		} else if (forumPosts && originalPosts && searchedPosts) {
			const filteredPosts = searchedPosts.filter((post) => post.postType === categoryFilter)
			setForumPosts(filteredPosts)
		}
	}, [categoryFilter, searchInput])

	return (
		<>
			<Stack
				direction={!mobile ? 'row' : 'column'}
				sx={{ display: 'flex', justifyContent: 'space-between' }}
			>
				<Typography sx={{ fontSize: !mobile ? '32px' : '15px' }} variant='h4'>
					{categoryTitles[categoryFilter]}
				</Typography>
				<TextField
					id='id="standard-basic"'
					label='Search'
					variant='standard'
					onChange={(e) => setInput(e.target.value)}
					sx={{ mb: 1 }}
				/>
			</Stack>
			{forumPosts ? (
				forumPosts.map((post) => (
					<ForumPostCard
						player={player}
						classroom={classroom}
						forumPost={post}
						isLink
						key={post.id}
					/>
				))
			) : (
				<Loading>Loading forum posts...</Loading>
			)}
		</>
	)
}
