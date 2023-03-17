import { Grid, Typography } from '@mui/material'
import { format } from 'date-fns'
import { Comment, Player } from '../../types'

export default function CommentCard({ comment, player }: { comment: Comment; player: Player }) {
	const title = player.name + ' > ' + comment.author.name
	return (
		<Grid item style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }}>
			<Grid style={{ flex: 1, padding: 10 }}>
				<Grid container style={{ alignItems: 'baseline', flexDirection: 'row' }}>
					<Typography>{title}</Typography>
					<Typography variant='caption' style={{ marginInline: 10, fontStyle: 'italic' }}>
						Posted {comment.postTime ? format(comment.postTime.toDate(), 'MM/dd/yyyy h:mm a') : ''}
					</Typography>
				</Grid>
				<Typography variant='subtitle2'>{comment.content}</Typography>
			</Grid>
		</Grid>
	)
}
