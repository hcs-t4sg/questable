// import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useState } from 'react'
import { ModalTitle, StudentBoxInModal, StudentTaskModalBox } from '../../styles/TaskModalStyles'
import { Classroom, Player, Repeatable, TaskWithStatus } from '../../types'
import { completeRepeatable, completeTask } from '../../utils/mutations'
import { useSnackbar } from 'notistack'

interface PropsTask {
	classroom: Classroom
	player: Player
	taskOrRepeatable: TaskWithStatus
	type: 'task'
}

interface PropsRepeatables {
	classroom: Classroom
	player: Player
	taskOrRepeatable: Repeatable
	type: 'repeatables'
}

export default function ModalsStudent(props: PropsTask | PropsRepeatables) {
	const { enqueueSnackbar } = useSnackbar()

	const [open, setOpen] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleComplete = () => {
		if (window.confirm('Are you sure you want to mark this task as complete?')) {
			props.type === 'task'
				? completeTask(props.classroom.id, props.taskOrRepeatable.id, props.player.id)
						.then(() => {
							enqueueSnackbar(`Task "${props.taskOrRepeatable.name}" marked as complete!`, {
								variant: 'success',
							})
						})
						.catch((err) => {
							console.error(err)
							enqueueSnackbar('There was an issue completing the task.', {
								variant: 'error',
							})
						})
				: completeRepeatable(props.classroom.id, props.taskOrRepeatable.id, props.player.id)
						.then(() => {
							enqueueSnackbar(`Repeatable completion added for "${props.taskOrRepeatable.name}"!`, {
								variant: 'success',
							})
						})
						.catch((err) => {
							console.error(err)
							enqueueSnackbar('There was an issue adding the repeatable completion.', {
								variant: 'error',
							})
						})
			handleClose()
		}
	}

	const Cluster = ({ title, data }: { title: string; data: string | number | JSX.Element }) => (
		<>
			<Typography sx={{ marginTop: '25px' }} fontWeight='medium' variant='h6'>
				{title}
			</Typography>
			<Typography fontWeight='light' variant='h6'>
				{data}
			</Typography>
		</>
	)

	const openButton = (
		<IconButton onClick={handleClickOpen}>
			<OpenInNewIcon />
		</IconButton>
	)

	const completionOrDeadline =
		props.type === 'task' ? (
			<Cluster
				title='Deadline'
				data={format(props.taskOrRepeatable.due.toDate(), 'MM/dd/yyyy h:mm a')}
			/>
		) : (
			<Cluster title='Completions' data={props.taskOrRepeatable.requestCount} />
		)

	return (
		<Box>
			{openButton}
			<Modal sx={{ overflow: 'scroll' }} open={open} onClose={handleClose}>
				<StudentTaskModalBox>
					<ModalTitle
						onClick={handleClose}
						text={props.type === 'task' ? 'Task Overview' : 'Repeatable Overview'}
					/>
					<StudentBoxInModal>
						<Cluster title='Task Name' data={props.taskOrRepeatable.name} />
						<Cluster title='Description' data={props.taskOrRepeatable.description} />
						<Cluster title='Reward Amount' data={`$${props.taskOrRepeatable.reward}`} />
						{completionOrDeadline}
						{props.type == 'task' && props.taskOrRepeatable.status === 0 ? (
							<Cluster
								title='Completion'
								data={
									<Button onClick={handleComplete} variant='contained'>
										Mark as complete
									</Button>
								}
							/>
						) : null}
					</StudentBoxInModal>
				</StudentTaskModalBox>
			</Modal>
		</Box>
	)
}
