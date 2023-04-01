// import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, IconButton, Modal, Typography, Grid } from '@mui/material'
import { format } from 'date-fns'
import { useState } from 'react'
import { Classroom, Player, Repeatable, TaskWithStatus } from '../../types'
import { completeRepeatable, completeTask } from '../../utils/mutations'
import { StudentTaskModalBox, ModalTitle, StudentBoxInModal } from '../../styles/TaskModalStyles'
import red3 from '/src/assets/spriteSheets/potions/red3.png'
import blue3 from '/src/assets/spriteSheets/potions/blue3.png'
import purple3 from '/src/assets/spriteSheets/potions/purple3.png'
import green3 from '/src/assets/spriteSheets/potions/green3.png'
// import { rewardsMatch } from './RewardItems'
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
	type: 'repeatable'
}

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
			<Typography sx={{ marginTop: '25px' }} fontWeight='bold' variant='h6'>
				{title}
			</Typography>
			<Typography fontWeight='light' variant='body1'>
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
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<StudentBoxInModal>
								<Cluster title='Task Name' data={props.taskOrRepeatable.name} />
								<Cluster title='Description' data={props.taskOrRepeatable.description} />
								<Cluster title='Reward Amount' data={`${props.taskOrRepeatable.reward}g`} />
								{completionOrDeadline}
								<Cluster
									title=''
									data={
										<Button onClick={handleComplete} variant='contained' color='success'>
											Mark as complete
										</Button>
									}
								/>
							</StudentBoxInModal>
						</Grid>
						<Grid item xs={6} marginTop={10}>
							{rewardPotion(props.taskOrRepeatable.reward)}
							<Typography fontWeight='light' variant='h6' fontFamily='Superscript' textAlign='left'>
								Potion Collection
							</Typography>
						</Grid>
					</Grid>
				</StudentTaskModalBox>
			</Modal>
		</Box>
	)
}
