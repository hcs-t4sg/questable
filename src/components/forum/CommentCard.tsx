import React, { useState } from 'react'
import { Grid, Typography, Button, TextField } from '@mui/material'
import { Classroom, Player, Comment, ForumPost } from '../../types'
import { addComment } from '../../utils/mutations'
import { format } from 'date-fns'

export default function CommentCard({
	comment,
	player,
	classroom,
	forumPost,
}: {
	comment: Comment
	player: Player
	classroom: Classroom
	forumPost: ForumPost
}) {
	const [reply, setReply] = useState<string>('')

	const handleReply = () => {
		const newReply = {
			content: reply,
			author: player,
			likes: 0,
			postTime: new Date().toJSON(),
			parent: comment.id,
		}

		// Only posts comment if it contains non-whitespace characters
		if (newReply.content.replace(/\s+/g, '') != '') {
			addComment(newReply, classroom, forumPost).catch(console.error)
		}

		// Clears TextInputField
		setReply('')
	}

	const title =
		comment.parent == '' ? comment.author.name : player.name + ' > ' + comment.author.name
	return (
		<Grid item style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }}>
			<Grid style={{ flex: 1, padding: 10 }}>
				<Grid container style={{ alignItems: 'baseline', flexDirection: 'row' }}>
					<Typography>{title}</Typography>
					<Typography variant='caption' style={{ marginInline: 10, fontStyle: 'italic' }}>
						Posted {format(comment.postTime.toDate(), 'MM/dd/yyyy h:mm a')}
					</Typography>
				</Grid>
				<Typography variant='subtitle2'>{comment.content}</Typography>
				<TextField
					value={reply}
					size='small'
					onChange={(e) => setReply(e.target.value)}
					hiddenLabel
					variant='standard'
					placeholder='Add Comment...'
				/>
				<Button onClick={handleReply} style={{ color: 'black' }}>
					<Typography variant='caption' style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
						Reply...
					</Typography>
				</Button>
			</Grid>
		</Grid>
	)
}
