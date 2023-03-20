import { Box, Card, CardActionArea, CardContent, Divider, Typography } from '@mui/material'
import format from 'date-fns/format'
import { Link } from 'react-router-dom'
import { ForumPost } from '../../types'
import { currentAvatar } from '../../utils/items'
import Avatar from '../global/Avatar'

export default function ForumPostCard({
	forumPost,
	isLink,
}: {
	forumPost: ForumPost
	isLink: boolean
}) {
	const cardContent = (
		<CardContent>
			<Typography variant='h4'>{forumPost.title}</Typography>
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
