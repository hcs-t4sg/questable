import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import * as React from 'react'
import CreateTaskModal from '../../components/teacher/CreateTaskModal'
import TasksTableTeacher from '../../components/teacher/TasksTableTeacher'

import { Tab, Tabs } from '@mui/material'
import RepeatableTableTeacher from '../../components/teacher/RepeatableTableTeacher'
import { Classroom, Player } from '../../types'

export default function Tasks({ player, classroom }: { player: Player; classroom: Classroom }) {
	//   const [teacher, setTeacher] = React.useState();

	const [page, setPage] = React.useState(0)

	const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
		setPage(newTabIndex)
	}

	const getTable = () => {
		if (page === 0) {
			return <TasksTableTeacher classroom={classroom} />
		} else if (page === 1) {
			return <RepeatableTableTeacher classroom={classroom} />
		}
	}

	return (
		<>
			<Grid item xs={12}>
				<Typography variant='h2' component='div'>
					{classroom.name}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Card sx={{ width: 1 }}>
					<CardContent>
						<Typography variant='h5' component='div'>
							{player.name}
						</Typography>{' '}
						{/* Do we want a separate user name?*/}
						<Typography variant='h5' component='div'>
							{classroom.playerList.length} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Typography variant='h5'>Create a New Task</Typography>
				<CreateTaskModal classroom={classroom} player={player} />
			</Grid>

			<Grid item xs={12}>
				<Typography variant='h5'>View and Edit Tasks</Typography>
				<Tabs value={page} onChange={handleTabChange}>
					<Tab label='One Time' />
					<Tab label='Repeatable' />
				</Tabs>
				{getTable()}
			</Grid>
		</>
	)
}
