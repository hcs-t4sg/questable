import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { format } from 'date-fns'
import { Classroom, RepeatableCompletion } from '../../types'
import { confirmRepeatables, denyRepeatable } from '../../utils/mutations/repeatables'
import { StyledTableRow } from '../../styles/TaskTableStyles'
import { Grid } from '@mui/material'
import Loading from '../global/Loading'
import { useSnackbar } from 'notistack'
import { truncate } from '../../utils/helperFunctions'

export default function ConfirmRepeatablesTable({
	classroom,
	completedRepeatables,
}: {
	classroom: Classroom
	completedRepeatables: RepeatableCompletion[] | null
}) {
	const { enqueueSnackbar } = useSnackbar()

	if (!completedRepeatables) {
		return <Loading>Loading repeatables...</Loading>
	}
	return (
		<TableContainer component={Paper}>
			<Table aria-label='simple table'>
				<TableHead>
					<TableRow>
						{/* align='center' before theme */}
						<TableCell>Repeatable</TableCell>
						<TableCell>Completion Time</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Reward</TableCell>
						<TableCell>Student</TableCell>
						<TableCell>Confirm?</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
					{completedRepeatables.map((completion) => (
						<StyledTableRow key={completion.id}>
							<TableCell align='center'>{completion.repeatable.name}</TableCell>
							<TableCell align='center'>
								{format(completion.time.toDate(), 'MM/dd/yyyy h:mm a')}
							</TableCell>
							<TableCell>
								<div
									dangerouslySetInnerHTML={{
										__html: truncate(completion.repeatable.description, 40),
									}}
								/>{' '}
							</TableCell>
							<TableCell>{`${completion.repeatable.reward}g`}</TableCell>
							<TableCell component='th' scope='row'>
								{completion.player.name}
							</TableCell>
							<TableCell align='center'>
								<Grid container rowSpacing={1} columnSpacing={1}>
									<Grid item>
										<Button
											onClick={() =>
												confirmRepeatables([completion], classroom.id)
													.then(() => {
														enqueueSnackbar(
															`Confirmed task completion "${completion.repeatable.name}" from ${completion.player.name}!`,
															{ variant: 'success' },
														)
													})
													.catch((err) => {
														console.error(err)
														enqueueSnackbar(
															'There was an error confirming the repeatable completion.',
															{
																variant: 'error',
															},
														)
													})
											}
											color='success'
										>
											Confirm
										</Button>
									</Grid>
									<Grid item>
										<Button
											onClick={() =>
												denyRepeatable(
													classroom.id,
													completion.player.id,
													completion.repeatable.id,
													completion.id,
												)
													.then(() => {
														enqueueSnackbar(
															`Denied repeatable completion "${completion.repeatable.name}" from ${completion.player.name}!`,
															{ variant: 'default' },
														)
													})
													.catch((err) => {
														console.error(err)
														enqueueSnackbar(
															'There was an error denying the repeatable completion.',
															{
																variant: 'error',
															},
														)
													})
											}
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
