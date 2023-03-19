import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Classroom, Comment, ForumPost, Player } from '../../types'
import { db } from '../../utils/firebase'
import { addComment, getPlayerData } from '../../utils/mutations'
import ForumPostCard from './ForumPostCard'
import Avatar from '../global/Avatar'
import { currentAvatar } from '../../utils/items'
import { format } from 'date-fns'

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
			const commentsQuery = query(commentsRef, orderBy('postTime', 'asc'))
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
								commentList.push(commentData)
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

	// TODO With comment flexbox that avatar, name, and timestamp side by side, we have weird resizing behavior of the avatar. Fix by having the timestamp go below the avatar and name when card gets too small

	if (post) {
		return (
			<>
				<ForumPostCard forumPost={post} isLink={false} />
				<Card variant='outlined'>
					<CardContent sx={{ height: '500px', overflowY: 'scroll' }}>
						{comments ? (
							<Stack direction='column' spacing={2}>
								{comments.map((comment) => (
									<Card key={comment.id}>
										<CardContent>
											<Typography variant='body1'>{comment.content}</Typography>
											<Divider sx={{ margin: '10px 0' }} />
											<Box sx={{ display: 'flex', alignItems: 'flex-end', marginLeft: '-5px' }}>
												<Box
													sx={{
														width: '30px',
														height: '30px',
													}}
												>
													<Avatar outfit={currentAvatar(comment.author)} />
												</Box>
												<Typography
													gutterBottom
													variant='subtitle2'
													sx={{ marginBottom: 0, marginRight: '5px' }}
												>
													{comment.author.name}
												</Typography>
												<Typography variant='caption' style={{ fontStyle: 'italic' }}>
													{comment.postTime
														? format(comment.postTime.toDate(), 'MM/dd/yyyy h:mm a')
														: ''}
												</Typography>
											</Box>
										</CardContent>
									</Card>
								))}
							</Stack>
						) : (
							<Typography variant='body1'>Loading comments...</Typography>
						)}
					</CardContent>
					<CardActions>
						<TextField
							variant='outlined'
							label='Comment Field'
							value={comment}
							onChange={(event) => setComment(event.target.value)}
						/>
						<Button variant='contained' onClick={handleSubmit}>
							Comment
						</Button>
					</CardActions>
				</Card>
			</>
		)
	} else {
		return <div>Loading...</div>
	}
}
