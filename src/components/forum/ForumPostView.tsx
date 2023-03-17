import { Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Classroom, Comment, ForumPost, Player } from '../../types'
import { useParams } from 'react-router-dom'
import { db } from '../../utils/firebase'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { format } from 'date-fns'
import { addComment, getPlayerData } from '../../utils/mutations'
import CommentCard from './CommentCard'

export default function ForumPostView({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const params = useParams()
	const postID = params.postID

	const [post, setPost] = useState<ForumPost | null>(null)
	useEffect(() => {
		if (postID) {
			const postRef = doc(db, `classrooms/${classroom.id}/forumPosts/${postID}`)
			const unsub = onSnapshot(postRef, (doc) => {
				const appendAuthorToForumPost = async () => {
					if (doc.exists()) {
						const author = await getPlayerData(classroom.id, doc.data().author)
						if (author) {
							const postData = { ...doc.data(), id: doc.id } as ForumPost
							postData.author = author
							setPost(postData)
						}
					}
				}
				appendAuthorToForumPost().catch(console.error)
			})
			return unsub
		}
	}, [classroom, postID])

	const [comment, setComment] = useState<string>('')

	const handleSubmit = () => {
		const newComment = {
			content: comment,
			author: player,
		}

		// Only posts comment if it contains non-whitespace characters
		if (newComment.content.replace(/\s+/g, '') != '') {
			if (post) {
				addComment(newComment, classroom, post).catch(console.error)
				// Clears TextInputField
				setComment('')
			}
		} else {
			alert('Comment must contain non-whitespace characters')
		}
	}

	const [comments, setComments] = useState<Comment[] | null>(null)
	useEffect(() => {
		if (postID) {
			const commentsRef = collection(db, `classrooms/${classroom.id}/forumPosts/${postID}/comments`)
			const commentsQuery = query(commentsRef, orderBy('postTime', 'desc'))
			const unsub = onSnapshot(commentsQuery, (snapshot) => {
				const appendAuthorsToComments = async () => {
					const commentList: Comment[] = []
					await Promise.all(
						snapshot.docs.map(async (doc) => {
							console.log(doc.data())
							const author = await getPlayerData(classroom.id, doc.data().author)
							if (author) {
								const commentData = { ...doc.data(), id: doc.id } as Comment
								commentData.author = author
								commentList.push(commentData as Comment)
							}
						}),
					)
					console.log(commentList)
					setComments(commentList)
				}
				appendAuthorsToComments().catch(console.error)
			})
			return unsub
		}
	}, [classroom, postID])

	console.log(player)
	console.log(comments)

	if (post) {
		return (
			<>
				<Typography variant='h2'>{`${post.title}`}</Typography>
				<Typography variant='body1'>{`${post.content}`}</Typography>
				<Typography variant='caption'>{`${format(
					post.postTime.toDate(),
					'MM/dd/yyyy h:mm a',
				)}`}</Typography>
				<Typography variant='h6'>{`${post.likes.toString()}`}</Typography>
				<Typography variant='h6'>{`${post.author.name}`}</Typography>
				<TextField
					variant='outlined'
					label='Comment Field'
					value={comment}
					onChange={(event) => setComment(event.target.value)}
				/>
				<Button variant='contained' onClick={handleSubmit}>
					Comment
				</Button>
				{comments ? (
					comments.map((comment) => (
						<CommentCard comment={comment} player={player} key={comment.id} />
					))
				) : (
					<p>Loading comments...</p>
				)}
			</>
		)
	} else {
		return <div>Loading...</div>
	}
}
