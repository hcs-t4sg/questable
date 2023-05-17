import { FormControl, InputLabel, MenuItem, Select, Stack, Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import EditIcon from '@mui/icons-material/Edit'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Timestamp } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
	BoxInModal,
	ModalTitle,
	TaskModalContent,
	TeacherModalStyled,
} from '../../styles/TaskModalStyles'
import { Classroom, Task } from '../../types'
import modules from '../../utils/TextEditor'
import { deleteTask, updateTask } from '../../utils/mutations'

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

		if (date < new Date()) {
			enqueueSnackbar('You cannot set a due date in the past!', { variant: 'error' })
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

	const handleDelete = () => {
		// message box to confirm deletion
		if (window.confirm('Are you sure you want to delete this task?')) {
			handleClose()
			deleteTask(classroom.id, task.id)
				.then(() => {
					enqueueSnackbar('Deleted task!', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar(err.message, { variant: 'error' })
				})
		}
	}

	const openButton = (
		<IconButton onClick={handleClickOpen}>
			<EditIcon />
		</IconButton>
	)

	return (
		<div>
			{openButton}
			<TeacherModalStyled open={open} onClose={handleClose}>
				<ModalTitle onClick={handleClose} text='Overview' />
				<TaskModalContent>
					{task.gcrName ? (
						<Typography variant='body1'>Google Classroom Task: {task.gcrName}</Typography>
					) : null}
					<Box
						component='form'
						onSubmit={(e) => {
							handleEdit()
							e.preventDefault()
						}}
					>
						<TextField
							margin='normal'
							id='name'
							label='Task Name'
							fullWidth
							variant='standard'
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
						<ReactQuill
							theme='snow'
							style={{ width: '100%' }}
							value={description}
							modules={modules}
							onChange={setDescription}
						/>

						<BoxInModal>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DateTimePicker
									label='Due Date'
									value={date}
									sx={{ width: '60%' }}
									minDateTime={new Date()}
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
							{/* </Box> */}
						</BoxInModal>
						<br />
						{/* center the save button */}
						<Stack direction='row' spacing={2}>
							<Button type='submit' variant='contained'>
								Save Changes
							</Button>

							<Button onClick={handleDelete} variant='contained' color='error'>
								Delete Task
							</Button>
						</Stack>
					</Box>
				</TaskModalContent>
			</TeacherModalStyled>
		</div>
	)
}
