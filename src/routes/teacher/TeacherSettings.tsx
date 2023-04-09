import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import PlayerCard from '../../components/global/PlayerCard'
import FormControlLabel from '@mui/material/FormControlLabel'
import { User } from 'firebase/auth'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import { db } from '../../utils/firebase'
import { useSnackbar } from 'notistack'

import { doc, updateDoc } from 'firebase/firestore'

export default function TeacherSettings({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	const [editOn, setEditOn] = useState(classroom.canEdit)
	const { enqueueSnackbar } = useSnackbar()

	const handleSwitch = async (classroom: Classroom) => {
		const classroomRef = doc(db, 'classrooms', classroom.id)
		await updateDoc(classroomRef, {
			canEdit: !classroom.canEdit,
		}).catch((err) => {
			console.error(err)
			enqueueSnackbar('There was an error creating the post.', {
				variant: 'error',
			})
		})

		setEditOn(!editOn)
	}

	return (
		<>
			<Grid item xs={12}>
				<Typography variant='h4'>Teacher Profile</Typography>
				<PlayerCard player={player} user={user} classroom={classroom} />
				<FormControlLabel
					control={<Switch onChange={() => handleSwitch(classroom)} checked={editOn} />}
					label='Students can edit/delete posts'
				/>
			</Grid>
		</>
	)
}
