// import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import { useState } from 'react'
import { Classroom, Player, RepeatableWithCompletionCount, TaskWithStatus } from '../../types'
import { completeRepeatable, completeTask } from '../../utils/mutations'
import { format, fromUnixTime } from 'date-fns'
import { StudentTaskModalBox, ModalTitle, StudentBoxInModal } from '../global/TaskModalStyles'

interface PropsTask {
	classroom: Classroom
	player: Player
	task: TaskWithStatus
	type: 'task'
}

interface PropsRepeatables {
	classroom: Classroom
	player: Player
	task: RepeatableWithCompletionCount
	type: 'repeatables'
}

export default function ModalsStudent(props: PropsTask | PropsRepeatables) {
	// State variables
	const [open, setOpen] = useState(false)

	// Open the task modal
	const handleClickOpen = () => {
		setOpen(true)
	}
	// Close the task modal
	const handleClose = () => {
		setOpen(false)
	}

	// Handle task completion
	const handleComplete = () => {
		// Call the `completeTask` mutation
		if (window.confirm('Are you sure you want to mark this task as complete?')) {
			props.type === 'task'
				? completeTask(props.classroom.id, props.task.id, props.player.id)
				: completeRepeatable(props.classroom.id, props.task.id, props.player.id)
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
			<Cluster title='Deadline' data={format(fromUnixTime(props.task.due), 'MM/dd/yyyy')} />
		) : (
			<Cluster title='Completions' data={props.task.completions} />
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
						<Cluster title='Task Name' data={props.task.name} />
						<Cluster title='Description' data={props.task.description} />
						<Cluster title='Reward Amount' data={`$${props.task.reward}`} />
						{completionOrDeadline}
						<Cluster
							title='Completion'
							data={
								<Button onClick={handleComplete} variant='contained'>
									Mark as complete
								</Button>
							}
						/>
					</StudentBoxInModal>
				</StudentTaskModalBox>
			</Modal>
		</Box>
	)
}
