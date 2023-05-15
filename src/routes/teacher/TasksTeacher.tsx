import { Grid, Typography, TextField, useMediaQuery, Tab, Tabs, Stack } from '@mui/material'

// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
import * as React from 'react'
import CreateTaskModal from '../../components/teacher/CreateTaskModal'
import TasksTableTeacher from '../../components/teacher/TasksTableTeacher'
import RepeatableTableTeacher from '../../components/teacher/RepeatableTableTeacher'
import { Classroom, Player } from '../../types'

export default function TasksTeacher({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	//   const [teacher, setTeacher] = React.useState();

	const [page, setPage] = React.useState<0 | 1>(0)
	const [searchInput, setSearchInput] = React.useState('')

	const handleTabChange = (event: React.SyntheticEvent, newTabIndex: 0 | 1) => {
		setPage(newTabIndex)
	}

	const mobile = useMediaQuery('(max-width:400px)')

	return (
		<>
			{/* <Grid item xs={12}>
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
			{/* <Typography variant='h5' component='div'>
							{classroom.playerList.length} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid> */}

			<Grid item xs={12}>
				<Typography sx={{ fontSize: !mobile ? '32px' : '15px' }} variant='h4'>
					Create a New Task
				</Typography>
				<CreateTaskModal classroom={classroom} player={player} />
			</Grid>

			<Grid item xs={12}>
				<Stack direction='row' sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography sx={{ fontSize: !mobile ? '32px' : '15px' }} variant='h4'>
						View and Edit Tasks
					</Typography>
					<TextField
						id='standard-basic'
						label='Search'
						variant='standard'
						onChange={(event) => setSearchInput(event.target.value)}
					/>
				</Stack>
				<Tabs value={page} onChange={handleTabChange}>
					<Tab label='One Time' />
					<Tab label='Repeatable' />
				</Tabs>
				{page === 0 ? (
					<TasksTableTeacher classroom={classroom} searchInput={searchInput} />
				) : (
					<RepeatableTableTeacher classroom={classroom} searchInput={searchInput} />
				)}
			</Grid>
		</>
	)
}
