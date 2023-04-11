// import CloseIcon from '@mui/icons-material/Close'
import { Box, Button } from '@mui/material'
import { format } from 'date-fns'
import { Classroom, Player, TaskWithStatus } from '../../types'
import { completeTask } from '../../utils/mutations'
import blue3 from '/src/assets/spriteSheets/potions/blue3.png'
import green3 from '/src/assets/spriteSheets/potions/green3.png'
import purple3 from '/src/assets/spriteSheets/potions/purple3.png'
import red3 from '/src/assets/spriteSheets/potions/red3.png'
// import { rewardsMatch } from './RewardItems'
import { useSnackbar } from 'notistack'
import { AssignmentContentStudent, Cluster } from './AssignmentContentStudent'
import { useState } from 'react'

export function rewardPotion(rewardAmount: number) {
	const rewardMatch =
		rewardAmount === 10
			? blue3
			: rewardAmount === 20
			? green3
			: rewardAmount === 30
			? purple3
			: rewardAmount === 40
			? red3
			: ''

	return (
		<Box
			component='img'
			sx={{
				imageRendering: 'pixelated',
				maxHeight: { xs: 140, md: 200 },
				maxWidth: { xs: 140, md: 200 },
				minWidth: '28px',
				minHeight: '31.5px',
				position: 'relative',
			}}
			alt='Potion'
			src={rewardMatch}
			height='100%'
			width='100%'
		/>
	)
}

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
			<Cluster title='Task Name' data={task.name} html={false} />
			<Cluster title='Description' data={task.description} html={true} />
			<Cluster title='Reward Amount' data={`${task.reward}g`} html={false} />
			<Cluster
				title='Deadline'
				data={format(task.due.toDate(), 'MM/dd/yyyy h:mm a')}
				html={false}
			/>
			{task.status === 0 ? (
				<Cluster
					title=''
					data={
						<Button onClick={handleComplete} variant='contained' color='success'>
							Mark as complete
						</Button>
					}
					html={false}
				/>
			) : null}
		</AssignmentContentStudent>
	)
}
