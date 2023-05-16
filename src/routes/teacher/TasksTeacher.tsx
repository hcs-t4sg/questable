import {
	Grid,
	Typography,
	TextField,
	useMediaQuery,
	Tab,
	Tabs,
	Stack,
	useTheme,
} from '@mui/material'
import * as React from 'react'
import CreateTaskModal from '../../components/teacher/CreateTaskModal'
import TasksTableTeacher from '../../components/teacher/TasksTableTeacher'
import RepeatableTableTeacher from '../../components/teacher/RepeatableTableTeacher'
import { Classroom, Player } from '../../types'
import CreateGCRTask from '../../components/teacher/CreateGCRTask'

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

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	return (
		<>
			<Grid item xs={12}>
				<Typography sx={{ fontSize: !mobile ? '32px' : '15px' }} variant='h4'>
					Create a New Task
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<CreateTaskModal classroom={classroom} player={player} />
			</Grid>
			<Grid item xs={6}>
				<CreateGCRTask classroom={classroom} player={player} />
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
