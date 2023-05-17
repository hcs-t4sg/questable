import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	Divider,
	Typography,
	Stack,
	IconButton,
	useMediaQuery,
	useTheme,
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
import Chip from '@mui/material/Chip'

import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify(window)

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

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	const cardContent = (
		<CardContent sx={{ overflow: 'scroll' }}>
			<Stack sx={{ display: 'flex', justifyContent: 'space-between' }} direction='row'>
				<Typography
					variant='h5'
					sx={{ fontWeight: 'bold', paddingBottom: '10px', fontSize: !mobile ? '20px' : '10px' }}
				>
					{forumPost.title}
				</Typography>

				<Stack direction='row'>
					<Chip
						sx={{ mt: 0.7 }}
						icon={<FavoriteIcon />}
						onClick={(e) => {
							handleLike(forumPost)
							e.preventDefault()
						}}
						label={forumPost.likers.length}
					/>
					{(player.role === 'teacher' ||
						(forumPost.author.id === player.id && classroom.canEdit)) && (
						<IconButton
							onClick={(e) => {
								setOpen(true)
								e.preventDefault()
							}}
						>
							<EditIcon></EditIcon>
						</IconButton>
					)}

					{(player.role === 'teacher' ||
						(forumPost.author.id === player.id && classroom.canEdit)) && (
						<IconButton
							onClick={(e) => {
								handleDelete(forumPost)
								e.preventDefault()
							}}
						>
							<DeleteIcon />
						</IconButton>
					)}
				</Stack>
			</Stack>
			<Box sx={{ display: 'flex', alignItems: 'flex-end', marginLeft: '-5px' }}>
				{forumPost.anonymous ? null : (
					<Box
						sx={{
							width: '30px',
							height: '30px',
						}}
					>
						<Avatar outfit={currentAvatar(forumPost.author)} />
					</Box>
				)}
				<Typography
					gutterBottom
					variant='subtitle2'
					sx={{ marginBottom: 0, marginRight: '5px', fontSize: !mobile ? '13px' : '6px' }}
				>
					{forumPost.anonymous ? 'Anonymous' : forumPost.author.name}
				</Typography>
				<Typography
					variant='caption'
					style={{ fontStyle: 'italic', fontSize: !mobile ? '13px' : '6px' }}
				>
					{forumPost.postTime ? format(forumPost.postTime.toDate(), 'MM/dd/yyyy h:mm a') : ''}
				</Typography>
			</Box>
			<Divider sx={{ margin: '10px 0' }} />
			<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(forumPost.content) }} />

			{/* <Typography variant='body2'>{forumPost.content}</Typography> */}
		</CardContent>
	)

	return (
		<Box>
			<Card
				sx={{ marginBottom: '10px', width: !mobile ? '100%' : '120%' }}
				variant={isLink ? 'elevation' : 'outlined'}
			>
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
