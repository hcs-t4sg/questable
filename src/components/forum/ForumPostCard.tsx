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
import DeleteIcon from '@mui/icons-material/Delete'
import format from 'date-fns/format'
import { Link, useNavigate } from 'react-router-dom'
import { ForumPost, Classroom, Player } from '../../types'
import { currentAvatar } from '../../utils/items'
import { deleteForumPost } from '../../utils/mutations'
import Avatar from '../global/Avatar'
import { useSnackbar } from 'notistack'

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

	const cardContent = (
		<CardContent>
			<Stack direction='row'>
				<Typography variant='h5' sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>
					{forumPost.title}
				</Typography>
				{(player.role === 'teacher' || forumPost.author.id === player.id) && (
					<IconButton>
						<DeleteIcon onClick={() => handleDelete(forumPost)}></DeleteIcon>
					</IconButton>
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
					{forumPost.author.name}
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
		<Card sx={{ marginBottom: '10px' }} variant={isLink ? 'elevation' : 'outlined'}>
			{isLink ? (
				<CardActionArea component={Link} to={forumPost.id}>
					{cardContent}
				</CardActionArea>
			) : (
				cardContent
			)}
		</Card>
	)
}
