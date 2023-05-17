import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// import Card from '@mui/material/Card'

import {
	Card,
	FormControlLabel,
	MenuItem,
	Select,
	Switch,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import { User } from 'firebase/auth'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import PlayerCard from '../../components/global/PlayerCard'
import { Classroom, Player } from '../../types'
import { db } from '../../utils/firebase'
import { updateDoLeaderboard, updateLeaderboardSize } from '../../utils/mutations'

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
	const [leaderboardSize, setLeaderBoardSize] = useState(classroom.leaderboardSize)
	const [checked, setChecked] = useState(true)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked)
	}

	const handleEdit = () => {
		const newDoLeaderboard = {
			doLeaderboard: checked,
		}
		updateDoLeaderboard(classroom.id, newDoLeaderboard).catch(console.error)

		const newLeaderboardSize = {
			leaderboardSize: leaderboardSize,
		}
		updateLeaderboardSize(classroom.id, newLeaderboardSize).catch(console.error)
	}

	const [editOn, setEditOn] = useState(classroom.canEdit)
	const { enqueueSnackbar } = useSnackbar()

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

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
			</Grid>
			<Grid item xs={12}>
				<Typography sx={{ mt: 2, fontSize: !mobile ? '32px' : '18px' }} variant='h4'>
					Forum Settings
				</Typography>
				<FormControlLabel
					control={<Switch onChange={() => handleSwitch(classroom)} checked={editOn} />}
					label='Students can edit/delete posts'
				/>
			</Grid>
			<Grid item xs={12}>
				<Typography sx={{ mt: 2, fontSize: !mobile ? '32px' : '18px' }} variant='h4'>
					Class Settings
				</Typography>
				<Card sx={{ width: 1 }}>
					<CardContent>
						<Typography variant='h5' component='div'>
							{classroom.name}
						</Typography>
						<Typography variant='h6' component='div'>
							Leaderboard Visibility:
							<Typography>
								{' '}
								Off
								<Switch checked={checked} onChange={handleChange} />
								On{' '}
							</Typography>
						</Typography>
						<Typography variant='h6' component='div'>
							Leaderboard Size:
						</Typography>
						<Select
							sx={{ m: 1, minWidth: 180 }}
							size='small'
							labelId='demo-simple-select-label'
							id='demo-simple-select'
							value={leaderboardSize}
							label='Leaderboard Size'
							onChange={(event) => setLeaderBoardSize(event.target.value as number)}
						>
							<MenuItem value={3}>3</MenuItem>
							<MenuItem value={4}>4</MenuItem>
							<MenuItem value={5}>5</MenuItem>
						</Select>
						<DialogActions>
							<Button variant='contained' onClick={() => handleEdit()}>
								Save
							</Button>
						</DialogActions>
					</CardContent>
				</Card>
			</Grid>
		</>
	)
}
