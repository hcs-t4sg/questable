import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import format from 'date-fns/format'
import { Link } from 'react-router-dom'
import { Classroom, ForumPost, Player } from '../../types'

export default function ForumPostCard({
	forumPost,
}: {
	forumPost: ForumPost
	classroom: Classroom
	player: Player
}) {
	return (
		<Card sx={{ marginBottom: '10px' }}>
			<CardActionArea component={Link} to={forumPost.id}>
				<CardContent>
					<Typography variant='h4'>{forumPost.title}</Typography>
					<Typography gutterBottom variant='body1'>
						{forumPost.author.name}
					</Typography>
					<Typography variant='body2'>{forumPost.content}</Typography>
					<Typography variant='caption' style={{ fontStyle: 'italic' }}>
						Posted{' '}
						{forumPost.postTime ? format(forumPost.postTime.toDate(), 'MM/dd/yyyy h:mm a') : ''}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
