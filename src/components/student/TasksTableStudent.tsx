import { Box, IconButton, Tab, Tabs } from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { format, fromUnixTime } from 'date-fns'
import { useState } from 'react'
import { Classroom, Player, TaskWithStatus } from '../../types'
import { completeTask } from '../../utils/mutations'
import TaskModalStudent from './TaskModalStudent'

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

export default function TasksTableStudent({
	assigned,
	completed,
	confirmed,
	overdue,
	classroom,
	player,
}: {
	assigned: TaskWithStatus[]
	completed: TaskWithStatus[]
	confirmed: TaskWithStatus[]
	overdue: TaskWithStatus[]
	classroom: Classroom
	player: Player
}) {
	const [taskCategory, setTaskCategory] = useState<0 | 1 | 2 | 3>(0)
	const handleChangeTaskRep = (event: React.SyntheticEvent, newValue: 0 | 1) => {
		setTaskCategory(newValue)
	}

	let selectedTasks: TaskWithStatus[]
	if (taskCategory === 0) {
		selectedTasks = assigned
	} else if (taskCategory === 1) {
		selectedTasks = completed
	} else if (taskCategory === 2) {
		selectedTasks = confirmed
	} else {
		selectedTasks = overdue
	}

	// Handle task completion
	const handleTaskComplete = (task: TaskWithStatus) => {
		// Call the `completeTask` mutation
		if (window.confirm('Are you sure you want to mark this task as complete?')) {
			completeTask(classroom.id, task.id, player.id)
		}
	}

	return (
		<Box>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={taskCategory} onChange={handleChangeTaskRep} aria-label='Task/repeatable tabs'>
					<Tab label='Assigned' {...a11yProps(0)} />
					<Tab label='Requested' {...a11yProps(1)} />
					<Tab label='Completed' {...a11yProps(2)} />
					<Tab label='Overdue' {...a11yProps(3)} />
				</Tabs>
			</Box>
			<Grid item xs={12}>
				<TableContainer sx={{ backgroundColor: 'white' }}>
					<Table aria-label='simple table' sx={{ border: 'none' }}>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Deadline</TableCell>
								<TableCell align='center'>Reward Amount</TableCell>
								<TableCell align='center'>Status</TableCell>
								<TableCell align='center'>Open</TableCell>
								{taskCategory === 0 ? <TableCell align='center'>Mark as Complete</TableCell> : null}
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedTasks
								.filter((task) => task.status === taskCategory)
								.map((task) => (
									<TableRow
										key={task.id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align='left'>{task.name}</TableCell>
										<TableCell align='left'>{task.description || 'None'}</TableCell>
										<TableCell align='left'>
											{format(fromUnixTime(task.due), 'MM/dd/yyyy')}
										</TableCell>
										<TableCell align='center'>${task.reward}</TableCell>
										<TableCell align='center'>
											<Chip
												label={
													task.status === 0
														? 'Assigned'
														: task.status === 1
														? 'Completed'
														: task.status === 2
														? 'Confirmed'
														: 'Overdue'
												}
											/>
										</TableCell>
										<TableCell align='center'>
											<TaskModalStudent task={task} classroom={classroom} player={player} />
										</TableCell>
										{taskCategory === 0 ? (
											<TableCell align='center'>
												<IconButton onClick={() => handleTaskComplete(task)}>
													<CheckBoxIcon />
												</IconButton>
											</TableCell>
										) : null}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Box>
	)
}
