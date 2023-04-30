// import CloseIcon from '@mui/icons-material/Close'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
// import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
// import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { updateTask } from '../../utils/mutations'
import EditIcon from '@mui/icons-material/Edit'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Timestamp } from 'firebase/firestore'
import { Classroom, Task } from '../../types'
import {
	TaskModalBox,
	ModalTitle,
	BoxInModal,
	TeacherModalStyled,
} from '../../styles/TaskModalStyles'
import { useSnackbar } from 'notistack'

export default function TaskModalTeacher({
	task,
	classroom,
}: {
	task: Task
	classroom: Classroom
}) {
	const { enqueueSnackbar } = useSnackbar()
	// State variables
	const [open, setOpen] = useState(false)
	const [name, setName] = useState(task.name)
	const [reward, setReward] = useState(task.reward)
	const [date, setDate] = useState<Date | null>(task.due.toDate())
	const [description, setDescription] = useState(task.description)

	// Open the task modal
	const handleClickOpen = () => {
		setOpen(true)
		setName(task.name)
		setDate(task.due.toDate())
		setReward(task.reward)
	}
	// Close the task modal
	const handleClose = () => {
		setOpen(false)
	}
	// Handle the click of an edit button
	const handleEdit = () => {
		if (name === '') {
			enqueueSnackbar('You need to provide a name for the task', { variant: 'error' })
			return
		}

		if (!date) {
			enqueueSnackbar('You need to provide a due date', { variant: 'error' })
			return
		}

		const dateIsInvalid = isNaN(date.getTime())
		if (dateIsInvalid) {
			enqueueSnackbar('Due date is invalid', { variant: 'error' })
			return
		}
		const updatedTask = {
			name: name,
			description: description,
			due: date ? Timestamp.fromDate(date) : task.due,
			reward: reward,
			id: task.id,
		}
		// Call the `updateTask` mutation
		updateTask(classroom.id, updatedTask)
			.then(() => {
				handleClose()
				enqueueSnackbar('Edited task!', { variant: 'success' })
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar('There was an issue editing the task', { variant: 'error' })
			})
	}

	const openButton = (
		<IconButton onClick={handleClickOpen}>
			<EditIcon />
		</IconButton>
	)

	const saveButton = (
		<Button onClick={handleEdit} variant='contained'>
			Save Changes
		</Button>
	)

	return (
		<div>
			{openButton}
			<TeacherModalStyled open={open} onClose={handleClose}>
				<TaskModalBox>
					<ModalTitle onClick={handleClose} text='Overview' />
					{task.gcrName ? (
						<Typography variant='body1'>Google Classroom Task: {task.gcrName}</Typography>
					) : null}
					<TextField
						margin='normal'
						id='name'
						label='Task Name'
						fullWidth
						variant='standard'
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
					<TextField
						margin='normal'
						id='description'
						label='Description'
						fullWidth
						variant='standard'
						placeholder=''
						multiline
						maxRows={8}
						value={description}
						onChange={(event) => setDescription(event.target.value)}
					/>
					<BoxInModal>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								label='Due Date'
								value={date}
								onChange={(newValue) => setDate(newValue)}
							/>
						</LocalizationProvider>
					</BoxInModal>
					<BoxInModal>
						<FormControl fullWidth>
							<InputLabel id='reward-dropdown-label'>Reward</InputLabel>
							<Select
								labelId='reward-dropdown'
								id='reward-dropdown'
								value={reward}
								label='Reward'
								onChange={(event) => setReward(event.target.value as number)}
							>
								<MenuItem value={10}>10g</MenuItem>
								<MenuItem value={20}>20g</MenuItem>
								<MenuItem value={30}>30g</MenuItem>
								<MenuItem value={40}>40g</MenuItem>
							</Select>
						</FormControl>
					</BoxInModal>
					<br />
					{/* center the save button */}
					<Grid container justifyContent='center'>
						{saveButton}
					</Grid>
				</TaskModalBox>
			</TeacherModalStyled>
		</div>
	)
}
