import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// import Card from '@mui/material/Card'

import PlayerCard from '../../components/global/PlayerCard'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'
import { Card, MenuItem, Select, Switch } from '@mui/material'
import { useState } from 'react'
import { updateDoLeaderboard, updateLeaderboardSize } from '../../utils/mutations'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

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

	return (
		<>
			<Grid item xs={12}>
				<Typography variant='h4'>Teacher Profile</Typography>
				{/* <Card>
					<Typography> Settings for {classroom.name} </Typography>
					<Switch defaultChecked onChange={handleSwitch} />
				</Card> */}
				<PlayerCard player={player} user={user} classroom={classroom} />
			</Grid>
			<Grid item xs={12}>
				<Typography variant='h4'> Class Settings</Typography>
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
