import { Typography } from '@mui/material'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, ForumPost, Player } from '../../types'
import { db } from '../../utils/firebase'
import ForumPostCard from './ForumPostCard'
import { getPlayerData } from '../../utils/mutations'

export default function ForumPostList({
	player,
	classroom,
	categoryFilter,
}: {
	player: Player
	classroom: Classroom
	categoryFilter: -1 | 0 | 1 | 2 | 3
}) {
	const [forumPosts, setForumPosts] = useState<ForumPost[] | null>(null)

	useEffect(() => {
		const forumPostsRef = collection(db, `classrooms/${classroom.id}/forumPosts`)
		let forumPostsQuery
		if (categoryFilter === -1) {
			forumPostsQuery = query(forumPostsRef, orderBy('postTime', 'desc'))
		} else {
			forumPostsQuery = query(
				forumPostsRef,
				where('postType', '==', categoryFilter),
				orderBy('postTime', 'desc'),
			)
		}

		console.log(forumPostsQuery)

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
				console.log(postList)
				setForumPosts(postList)
			}
			appendAuthorsToPosts().catch(console.error)
		})
		return unsub
	}, [player, classroom, categoryFilter])

	const categoryTitles = {
		'-1': 'All Posts',
		'0': 'General',
		'1': 'Assignment',
		'2': 'For Fun',
		'3': 'Starred',
	}

	return (
		<>
			<Typography variant='h3'>{categoryTitles[categoryFilter]}</Typography>
			{forumPosts ? (
				forumPosts.map((post) => <ForumPostCard forumPost={post} isLink key={post.id} />)
			) : (
				<Typography variant='body1'>Loading...</Typography>
			)}
		</>
	)
}
