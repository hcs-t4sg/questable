import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	Divider,
	Typography,
	Stack,
	IconButton,
} from '@mui/material'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import format from 'date-fns/format'
import { Link, useNavigate } from 'react-router-dom'
import { ForumPost, Classroom, Player } from '../../types'
import { currentAvatar } from '../../utils/items'
import { deleteForumPost, updateForumPostLikes } from '../../utils/mutations'
import Avatar from '../global/Avatar'
import { useSnackbar } from 'notistack'
import EditForumPostModal from './EditForumPostModal'
import FavoriteIcon from '@mui/icons-material/Favorite'

export default function ForumPostCard({
	forumPost,
	isLink,
	classroom,
	player,
}: {
	forumPost: ForumPost
	isLink: boolean
	classroom: Classroom
	player: Player
}) {
	const { enqueueSnackbar } = useSnackbar()
	const navigate = useNavigate()

	const [open, setOpen] = useState(false)

	const handleDelete = (forumPost: ForumPost) => {
		// message box to confirm deletion
		if (window.confirm('Are you sure you want to delete this post?')) {
			deleteForumPost(classroom.id, forumPost.id)
				.then(() => {
					enqueueSnackbar('Deleted post!', { variant: 'success' })
					navigate(`/class/${classroom.id}/forum/posts`)
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar(err.message, { variant: 'error' })
				})
		}
	}

	const handleLike = (forumPost: ForumPost) => {
		updateForumPostLikes(
			classroom.id,
			forumPost.id,
			player.id,
			!forumPost.likers.includes(player.id),
		).catch((err) => {
			console.error(err)
			enqueueSnackbar(err.message, { variant: 'error' })
		})
	}
	const cardContent = (
		<CardContent>
			<Stack direction='row'>
				<Typography variant='h5' sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>
					{forumPost.title}
				</Typography>

				<Stack sx={{ ml: 2 }} direction='column'>
					<IconButton onClick={() => handleLike(forumPost)}>
						<FavoriteIcon
							sx={{
								color: !forumPost.likers
									? 'black'
									: forumPost.likers.includes(player.id)
									? 'red'
									: 'black',
							}}
						/>
					</IconButton>
					<Typography variant='h6'>{forumPost.likes}</Typography>
				</Stack>

				{(player.role === 'teacher' ||
					(forumPost.author.id === player.id && classroom.canEdit)) && (
					<Stack direction='row'>
						<IconButton onClick={() => setOpen(true)}>
							<EditIcon></EditIcon>
						</IconButton>
						<IconButton>
							<DeleteIcon onClick={() => handleDelete(forumPost)}></DeleteIcon>
						</IconButton>
					</Stack>
				)}
			</Stack>
			<Box sx={{ display: 'flex', alignItems: 'flex-end', marginLeft: '-5px' }}>
				<Box
					sx={{
						width: '30px',
						height: '30px',
					}}
				>
					<Avatar outfit={currentAvatar(forumPost.author)} />
				</Box>
				<Typography gutterBottom variant='subtitle2' sx={{ marginBottom: 0, marginRight: '5px' }}>
					{forumPost.anonymous == 1 ? 'Anonymous' : forumPost.author.name}
				</Typography>
				<Typography variant='caption' style={{ fontStyle: 'italic' }}>
					{forumPost.postTime ? format(forumPost.postTime.toDate(), 'MM/dd/yyyy h:mm a') : ''}
				</Typography>
			</Box>
			<Divider sx={{ margin: '10px 0' }} />
			<Typography variant='body2'>{forumPost.content}</Typography>
		</CardContent>
	)

	return (
		<Box>
			<Card sx={{ marginBottom: '10px' }} variant={isLink ? 'elevation' : 'outlined'}>
				{isLink ? (
					<CardActionArea component={Link} to={forumPost.id}>
						{cardContent}
					</CardActionArea>
				) : (
					cardContent
				)}
			</Card>
			<EditForumPostModal
				player={player}
				classroom={classroom}
				forumPost={forumPost}
				onClose={() => setOpen(false)}
				isOpen={open}
			/>
		</Box>
	)
}
