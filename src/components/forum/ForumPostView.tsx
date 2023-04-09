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
	IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Classroom, Comment, ForumPost, Player } from '../../types'
import { db } from '../../utils/firebase'
import {
	addComment,
	getPlayerData,
	deleteForumComment,
	updateForumCommentLikes,
} from '../../utils/mutations'
import ForumPostCard from './ForumPostCard'
import Avatar from '../global/Avatar'
import { currentAvatar } from '../../utils/items'
import { format } from 'date-fns'
import Loading from '../global/Loading'
import { useSnackbar } from 'notistack'
import FavoriteIcon from '@mui/icons-material/Favorite'

// TODO Fix comment resizing on browser window resizing

// const { enqueueSnackbar } = useSnackbar();

const handleDelete = (
	forumComment: Comment,
	classroom: Classroom,
	post: ForumPost,
	enqueueSnackbar: (_param1: string, _param2: object) => any,
) => {
	// message box to confirm deletion
	if (window.confirm('Are you sure you want to delete this comment?')) {
		deleteForumComment(classroom.id, post.id, forumComment.id)
			.then(() => {
				enqueueSnackbar('Deleted comment!', { variant: 'success' })
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar(err.message, { variant: 'error' })
			})
	}
}

const handleLike = (
	comment: Comment,
	forumPost: ForumPost,
	classroom: Classroom,
	player: Player,
	enqueueSnackbar: (_param1: string, _param2: object) => any,
) => {
	updateForumCommentLikes(
		classroom.id,
		forumPost.id,
		comment.id,
		player.id,
		!comment.likers.includes(player.id),
	).catch((err) => {
		console.error(err)
		enqueueSnackbar(err.message, { variant: 'error' })
	})
}
const IncomingComment = ({
	comment,
	classroom,
	player,
	post,
}: {
	comment: Comment
	classroom: Classroom
	player: Player
	post: ForumPost
}) => {
	const [author, setAuthor] = useState<Player | null>(null)

	const { enqueueSnackbar } = useSnackbar()

	useEffect(() => {
		const fetchAuthorData = async () => {
			const author = await getPlayerData(classroom.id, comment.author)
			setAuthor(author)
		}
		fetchAuthorData().catch(console.error)
		console.log('fetched author data')
	}, [classroom, comment])

	return (
		<Card variant='outlined' sx={{ backgroundColor: '#FEFAE0', width: '60%' }}>
			<CardContent>
				<Stack direction='row'>
					<Typography variant='body1' style={{ overflowWrap: 'break-word' }}>
						{comment.content}
					</Typography>
					{player.role == 'teacher' && (
						<IconButton onClick={() => handleDelete(comment, classroom, post, enqueueSnackbar)}>
							<DeleteIcon />
						</IconButton>
					)}
					<IconButton onClick={() => handleLike(comment, post, classroom, player, enqueueSnackbar)}>
						<FavoriteIcon sx={{ color: 'black' }} />
					</IconButton>
				</Stack>
				<Divider sx={{ margin: '10px 0' }} />
				{author ? (
					<Box sx={{ display: 'flex', alignItems: 'flex-end', marginLeft: '-5px' }}>
						<Box
							sx={{
								width: '30px',
								height: '30px',
							}}
						>
							<Avatar outfit={currentAvatar(author)} />
						</Box>
						<Typography
							gutterBottom
							variant='subtitle2'
							sx={{ marginBottom: 0, marginRight: '5px' }}
						>
							{author.name}
						</Typography>
						<Typography variant='caption' style={{ fontStyle: 'italic' }}>
							{comment.postTime ? format(comment.postTime.toDate(), 'MM/dd/yyyy h:mm a') : ''}
						</Typography>
					</Box>
				) : (
					<Typography variant='caption'>Fetching author data...</Typography>
				)}
			</CardContent>
		</Card>
	)
}

const OutgoingComment = ({
	comment,
	classroom,
	player,
	post,
}: {
	comment: Comment
	classroom: Classroom
	player: Player
	post: ForumPost
}) => {
	const { enqueueSnackbar } = useSnackbar()
	return (
		<Card
			variant='outlined'
			sx={{ backgroundColor: '#F3F8DF', width: '60%', alignSelf: 'flex-end' }}
		>
			<CardContent>
				<Stack direction='row'>
					<Typography variant='body1' style={{ overflowWrap: 'break-word' }}>
						{comment.content}
					</Typography>
					{player.role == 'teacher' && (
						<IconButton onClick={() => handleDelete(comment, classroom, post, enqueueSnackbar)}>
							<DeleteIcon />
						</IconButton>
					)}
					<Stack direction='column'>
						<IconButton
							onClick={() => handleLike(comment, post, classroom, player, enqueueSnackbar)}
						>
							<FavoriteIcon
								sx={{
									color: !comment.likers
										? 'black'
										: comment.likers.includes(player.id)
										? 'red'
										: 'black',
								}}
							/>
						</IconButton>
						<Typography>{comment.likes}</Typography>
					</Stack>
				</Stack>
				<Divider sx={{ margin: '10px 0' }} />
				<Typography variant='caption' style={{ fontStyle: 'italic' }}>
					{comment.postTime ? format(comment.postTime.toDate(), 'MM/dd/yyyy h:mm a') : ''}
				</Typography>
			</CardContent>
		</Card>
	)
}

export default function ForumPostView({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const params = useParams()
	const postID = params.postID

	const { enqueueSnackbar } = useSnackbar()

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

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const newComment = {
			content: comment,
			author: player,
		}

		// Only posts comment if it contains non-whitespace characters
		if (newComment.content.replace(/\s+/g, '') != '') {
			if (post) {
				addComment(newComment, classroom, post).catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error adding the comment.', { variant: 'error' })
				})
				// Clears TextInputField
				setComment('')
			}
		} else {
			enqueueSnackbar('Comment must contain non-whitespace characters', { variant: 'error' })
		}
	}

	const [comments, setComments] = useState<Comment[] | null>(null)
	useEffect(() => {
		if (postID) {
			const commentsRef = collection(db, `classrooms/${classroom.id}/forumPosts/${postID}/comments`)
			const commentsQuery = query(commentsRef, orderBy('postTime', 'asc'))
			const unsub = onSnapshot(commentsQuery, (snapshot) => {
				const commentsList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Comment))
				setComments(commentsList)
			})
			return unsub
		}
	}, [classroom, postID])

	// TODO With comment flexbox that avatar, name, and timestamp side by side, we have weird resizing behavior of the avatar. Fix by having the timestamp go below the avatar and name when card gets too small

	if (post) {
		return (
			<>
				<ForumPostCard forumPost={post} classroom={classroom} player={player} isLink={false} />
				<Card variant='outlined'>
					<CardContent sx={{ height: '400px', overflowY: 'scroll' }}>
						{comments ? (
							<Stack direction='column' spacing={2} sx={{ width: '100%' }}>
								{comments.map((comment) => {
									if (comment.author === player.id) {
										return (
											<OutgoingComment
												post={post}
												classroom={classroom}
												player={player}
												comment={comment}
												key={comment.id}
											/>
										)
									} else {
										return (
											<IncomingComment
												post={post}
												player={player}
												comment={comment}
												classroom={classroom}
												key={comment.id}
											/>
										)
									}
								})}
							</Stack>
						) : (
							<Loading>Loading comments...</Loading>
						)}
					</CardContent>
					<form onSubmit={handleSubmit}>
						<CardActions>
							<TextField
								variant='outlined'
								size='small'
								fullWidth
								label='Message'
								value={comment}
								onChange={(event) => setComment(event.target.value)}
								sx={{ marginRight: '5px' }}
								type='text'
							/>
							<Button variant='contained' type='submit'>
								Send
							</Button>
						</CardActions>
					</form>
				</Card>
			</>
		)
	} else {
		return <Loading>Loading post data...</Loading>
	}
}
