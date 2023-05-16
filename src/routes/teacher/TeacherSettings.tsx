import PlayerCard from '../../components/global/PlayerCard'
import { Grid, Typography, Switch, FormControlLabel, useMediaQuery } from '@mui/material'
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
	const mobile = useMediaQuery('(max-width:500px)')
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
				<Typography sx={{ fontSize: !mobile ? '32px' : '18px' }} variant='h4'>
					Teacher Profile
				</Typography>
				<PlayerCard player={player} user={user} classroom={classroom} />
				<Typography sx={{ mt: 2, fontSize: !mobile ? '32px' : '18px' }} variant='h4'>
					Forum Settings
				</Typography>
				<FormControlLabel
					control={<Switch onChange={() => handleSwitch(classroom)} checked={editOn} />}
					label='Students can edit/delete posts'
				/>
			</Grid>
		</>
	)
}
