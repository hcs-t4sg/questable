import { Button } from '@mui/material'
import { format } from 'date-fns'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Classroom, Player, TaskWithStatus } from '../../types'
import { completeTask } from '../../utils/mutations/tasks'
import { AssignmentContentStudent } from './AssignmentContentStudent'
import { Cluster } from '../global/Cluster'

// Detailed modal for a student's task

export default function TaskModalStudent({
	classroom,
	player,
	task,
}: {
	classroom: Classroom
	player: Player
	task: TaskWithStatus
}) {
	const [open, setOpen] = useState(false)

	const toggleOpen = () => {
		setOpen(!open)
	}

	const { enqueueSnackbar } = useSnackbar()

	const handleComplete = () => {
		if (window.confirm('Are you sure you want to mark this as complete?')) {
			toggleOpen()
			completeTask(classroom.id, task.id, player.id)
				.then(() => {
					enqueueSnackbar(`Task "${task.name}" marked as complete!`, {
						variant: 'success',
					})
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an issue completing the task.', {
						variant: 'error',
					})
				})
		}
	}

	return (
		<AssignmentContentStudent
			assignment={task}
			assignmentType='Task'
			isOpen={open}
			toggleIsOpen={toggleOpen}
		>
			{task.gcrName ? (
				<Cluster title='Google Classroom Task' data={task.gcrName} isHtml={false} />
			) : null}
			<Cluster title='Task Name' data={task.name} isHtml={false} />
			<Cluster title='Description' data={task.description} isHtml={true} />
			<Cluster title='Reward Amount' data={`${task.reward}g`} isHtml={false} />
			<Cluster
				title='Deadline'
				data={format(task.due.toDate(), 'MM/dd/yyyy h:mm a')}
				isHtml={false}
			/>
			{task.status === 0 ? (
				<Cluster
					title=''
					data={
						<Button onClick={handleComplete} variant='contained' color='success'>
							Mark as complete
						</Button>
					}
					isHtml={false}
				/>
			) : null}
		</AssignmentContentStudent>
	)
}
