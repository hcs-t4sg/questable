import Button from '@mui/material/Button'
import CardActionArea from '@mui/material/CardActionArea'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { addPin, deletePin } from '../../utils/mutations'
import { Classroom } from '../../types'
import { User } from 'firebase/auth'

interface ComponentProps {
	classroom: Classroom
	user: User
	pinned: boolean
}

export default function ClassroomCard({ classroom, user, pinned }: ComponentProps) {
	return (
		<Card>
			<CardActionArea component={Link} to={`/class/${classroom.id}`}>
				<CardContent>
					<Typography variant='h5' component='div'>
						{classroom.name}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				{pinned && (
					<Button size='small' onClick={() => deletePin(user.uid, classroom.id)}>
						Unpin Classroom
					</Button>
				)}
				{!pinned && (
					<Button size='small' onClick={() => addPin(user.uid, classroom.id)}>
						Pin Classroom
					</Button>
				)}
			</CardActions>
		</Card>
	)
}
