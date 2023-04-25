import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { formatDistance } from 'date-fns'

import { Classroom, CompletedTask } from '../../types'
import { confirmTasks, denyTask } from '../../utils/mutations'
import { StyledTableRow } from '../../styles/TaskTableStyles'
import { Grid } from '@mui/material'
import Loading from '../global/Loading'
import { useSnackbar } from 'notistack'
import { truncate } from '../../utils/helperFunctions'

const formatStatus = (task: CompletedTask) => {
	const playerCompletion = task.completionTime

	if (playerCompletion > task.due) {
		return formatDistance(playerCompletion.toDate(), task.due.toDate()) + ' late'
	} else {
		return 'On time'
	}
}

export default function ConfirmTasksTable({
	classroom,
	completedTasks,
}: {
	classroom: Classroom
	completedTasks: CompletedTask[] | null
}) {
	const { enqueueSnackbar } = useSnackbar()

	if (!completedTasks) {
		return <Loading>Loading tasks...</Loading>
	}

	return (
		<TableContainer component={Paper}>
			<Table aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Task</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Reward</TableCell>
						<TableCell>Student</TableCell>
						<TableCell>Confirm?</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
					{completedTasks.map((completedTask) => (
						<StyledTableRow
							key={'test'}
							// sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell>{completedTask.name}</TableCell>
							<TableCell>
								<div dangerouslySetInnerHTML={{ __html: truncate(completedTask.description) }} />{' '}
							</TableCell>
							<TableCell>{formatStatus(completedTask)}</TableCell>
							<TableCell>{`${completedTask.reward}g`}</TableCell>
							<TableCell component='th' scope='row'>
								{completedTask.player.name}
							</TableCell>
							<TableCell align='center'>
								<Grid container columnSpacing={1}>
									<Grid item>
										<Button
											onClick={() =>
												confirmTasks([completedTask], classroom.id)
													.then(() => {
														enqueueSnackbar(
															`Confirmed task completion "${completedTask.name}" from ${completedTask.player.name}!`,
															{ variant: 'success' },
														)
													})
													.catch((err) => {
														console.error(err)
														enqueueSnackbar('There was an error confirming the task completion.', {
															variant: 'error',
														})
													})
											}
											// variant='contained'
											color='success'
										>
											Confirm
										</Button>
									</Grid>
									<Grid item>
										<Button
											onClick={() =>
												denyTask(classroom.id, completedTask.player.id, completedTask.id)
													.then(() => {
														enqueueSnackbar(
															`Rejected task completion "${completedTask.name}" from ${completedTask.player.name}.`,
															{ variant: 'default' },
														)
													})
													.catch((err) => {
														console.error(err)
														enqueueSnackbar('There was an error rejecting the task completion.', {
															variant: 'error',
														})
													})
											}
											// variant='contained'
											color='error'
										>
											Deny
										</Button>
									</Grid>
								</Grid>
							</TableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
