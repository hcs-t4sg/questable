import { Button, Grid, TextField, Typography } from '@mui/material'
import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Classroom, Comment, ForumPost, Player } from '../../types'
import { db } from '../../utils/firebase'
import { addComment } from '../../utils/mutations'
import CommentCard from './CommentCard'
import format from 'date-fns/format'

// const CommentCard = ({ comment }: { comment: Comment }) => (
// 	<Grid item style={{ backgroundColor: 'lightgray', borderRadius: 10, margin: 10 }}>
// 		<Grid style={{ flex: 1, padding: 10 }}>
// 			<Grid container style={{ alignItems: 'baseline', flexDirection: 'row' }}>
// 				<Typography>{comment.author.name}</Typography>
// 				<Typography variant='caption' style={{ marginInline: 10, fontStyle: 'italic' }}>
// 					Posted {moment(comment.postTime).local().fromNow()}
// 				</Typography>
// 			</Grid>
// 			<Typography variant='subtitle2'>{comment.content}</Typography>
// 		</Grid>
// 	</Grid>
// )

export default function ForumPostCard({
	forumPost,
	classroom,
	player,
}: {
	forumPost: ForumPost
	classroom: Classroom
	player: Player
}) {
	const [comments, setComments] = useState<Comment[]>([])
	const [comment, setComment] = useState<string>('')

	const handleSubmit = () => {
		const newComment = {
			content: comment,
			author: player,
			likes: 0,
			postTime: new Date().toJSON(),
			parent: '',
		}

		// Only posts comment if it contains non-whitespace characters
		if (newComment.content.replace(/\s+/g, '') != '') {
			addComment(newComment, classroom, forumPost).catch(console.error)
		}

		// Clears TextInputField
		setComment('')
	}

	useEffect(() => {
		const commentsRef = collection(
			db,
			`classrooms/${classroom.id}/forumPosts/${forumPost.id}/comments`,
		)
		const unsub = onSnapshot(commentsRef, (snapshot) => {
			const commentList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Comment))
			setComments(commentList)
		})
		return unsub
	}, [classroom, forumPost])

	return (
		<Grid sx={{ backgroundColor: 'lightgrey', borderRadius: 5, borderWidth: 1, margin: 5 }}>
			<Grid sx={{ padding: 2 }}>
				<Typography variant='h5'>{forumPost.title}</Typography>
				<Typography gutterBottom variant='body1'>
					{forumPost.author.name}
				</Typography>
				<Typography variant='body2'>{forumPost.content}</Typography>
				<Typography variant='caption' style={{ fontStyle: 'italic' }}>
					Posted {format(forumPost.postTime.toDate(), 'MM/dd/yyyy h:mm a')}
				</Typography>

				<Grid container style={{ alignContent: 'center' }}>
					<TextField
						value={comment}
						size='small'
						onChange={(e) => setComment(e.target.value)}
						hiddenLabel
						variant='standard'
						placeholder='Add Comment...'
					/>
					<Button size='small' style={{ color: 'black' }} onClick={handleSubmit}>
						Post
					</Button>
				</Grid>

				{comments.length != 0 && (
					<>
						<hr></hr>
						<Typography variant='body1' style={{ fontWeight: 'bold' }}>
							Comments
						</Typography>
					</>
				)}
				<Grid>
					{comments.reverse().map((comment: Comment) => (
						<CommentCard
							key={comment.id}
							player={player}
							classroom={classroom}
							forumPost={forumPost}
							comment={comment}
						/>
					))}
				</Grid>
			</Grid>
		</Grid>
	)
}
