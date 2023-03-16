import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useState } from 'react'
import { Classroom, Player, TaskWithStatus } from '../../types'
import { completeTask } from '../../utils/mutations'

export default function TaskModalStudent({
	classroom,
	player,
	task,
}: {
	classroom: Classroom
	player: Player
	task: TaskWithStatus
}) {
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
			completeTask(classroom.id, task.id, player.id)
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

	return (
		<div>
			{openButton}
			<Modal sx={{ overflow: 'scroll' }} open={open} onClose={handleClose}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '70%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '35px',
						paddingTop: '25px',
						backgroundColor: 'white',
						marginBottom: '18px',
					}}
				>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography fontWeight='light' variant='h5'>
							Task Overview
						</Typography>
						<IconButton onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Box>

					<hr
						style={{
							backgroundColor: '#D9D9D9',
							height: '1px',
							borderWidth: '0px',
							borderRadius: '5px',
							width: '100%',
						}}
					/>

					<Box
						sx={{
							width: '100%',
							flexDirection: 'column',
							display: 'flex',
							justifyContent: 'left',
						}}
					>
						<Cluster title='Task Name' data={task.name} />
						<Cluster title='Description' data={task.description} />
						<Cluster title='Deadline' data={format(task.due.toDate(), 'MM/dd/yyyy h:mm a')} />
						<Cluster title='Reward Amount' data={`$${task.reward}`} />
						{task.status === 0 ? (
							<Cluster
								title='Completion'
								data={
									<Button onClick={handleComplete} variant='contained'>
										Mark as complete
									</Button>
								}
							/>
						) : (
							<Cluster
								title='Completion'
								data={
									task.status === 1
										? 'Marked as completed!'
										: task.status === 2
										? 'Confirmed!'
										: 'Unavailable'
								}
							/>
						)}
					</Box>
				</Box>
			</Modal>
		</div>
	)
}
