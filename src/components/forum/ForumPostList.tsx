import { Typography } from '@mui/material'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, ForumPost, Player } from '../../types'
import { db } from '../../utils/firebase'
import ForumPostCard from './ForumPostCard'

export default function ForumPostList({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const [forumPosts, setForumPosts] = useState<ForumPost[]>([])

	useEffect(() => {
		const forumPostsRef = collection(db, `classrooms/${classroom.id}/forumPosts`)
		const forumPostsQuery = query(forumPostsRef)

		const unsub = onSnapshot(forumPostsQuery, (snapshot) => {
			const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ForumPost))
			console.log(forumPosts)
			setForumPosts(forumPosts)
		})
		return unsub
	}, [player, classroom])

	return (
		<>
			<Typography variant='h4'>All Posts</Typography>
			{forumPosts.map((post) => (
				<ForumPostCard player={player} classroom={classroom} forumPost={post} key={post.id} />
			))}
		</>
	)
}
