import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Tab,
	Tabs,
	DialogActions,
	Box,
	Button,
	Grid,
	TextField,
	useTheme,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Timestamp } from 'firebase/firestore'
import * as React from 'react'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import { addTask } from '../../utils/mutations/tasks'
import { addRepeatable } from '../../utils/mutations/repeatables'
import modules from '../../utils/TextEditor'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
	BoxInModal,
	ModalTitle,
	TeacherModalStyled,
	TaskModalContent,
} from '../../styles/TaskModalStyles'
import { useSnackbar } from 'notistack'

function containsOnlyNumbers(str: string) {
	return /^\d+$/.test(str)
}

function maxCompletionsIsInvalid(maxCompletions: string) {
	if (!containsOnlyNumbers(maxCompletions)) {
		return true
	}
	if (maxCompletions === '') {
		return true
	}
	if (parseInt(maxCompletions) <= 0) {
		return true
	}
	return false
}

export default function CreateTaskModal({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	const { enqueueSnackbar } = useSnackbar()

	const theme = useTheme()

	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [reward, setReward] = useState<number>(10)
	const [dueDate, setDueDate] = useState<Date | null>(null)

	const [isRepeatable, setIsRepeatable] = useState(false)
	const [maxCompletions, setMaxCompletions] = useState<string>('1')

	const handleOpen = () => {
		setOpen(true)
		setName('')
		setDueDate(null)
		setDescription('')
		setReward(10)
		setMaxCompletions('1')
		setIsRepeatable(false)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleAdd = () => {
		if (isRepeatable) {
			if (name === '') {
				enqueueSnackbar('You need to provide a name for the repeatable', { variant: 'error' })
				return
			}

			if (maxCompletionsIsInvalid(maxCompletions)) {
				setMaxCompletions('1')
				enqueueSnackbar('Max completions must be a positive integer', { variant: 'error' })
				return
			}

			const newTask = {
				name,
				description,
				reward,
				maxCompletions: parseInt(maxCompletions),
			}

			handleClose()
			addRepeatable(classroom.id, newTask, player.id)
				.then(() => {
					enqueueSnackbar(`Added repeatable "${name}"!`, {
						variant: 'success',
					})
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error adding the repeatable.', {
						variant: 'error',
					})
				})
		} else {
			if (name === '') {
				enqueueSnackbar('You need to provide a name for the task', { variant: 'error' })
				return
			}

			if (!dueDate) {
				enqueueSnackbar('You need to provide a due date', { variant: 'error' })
				return
			}

			if (dueDate < new Date()) {
				enqueueSnackbar('You cannot set a due date in the past!', { variant: 'error' })
				return
			}

			const dateIsInvalid = isNaN(dueDate.getTime())
			if (dateIsInvalid) {
				enqueueSnackbar('Due date is invalid', { variant: 'error' })
				return
			}

			const newTask = {
				name,
				description,
				reward,
				due: Timestamp.fromDate(dueDate),
			}

			handleClose()
			addTask(classroom.id, newTask, player.id)
				.then(() => {
					enqueueSnackbar(`Added task "${name}"!`, {
						variant: 'success',
					})
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error adding the task.', {
						variant: 'error',
					})
				})
		}
	}

	const openButton = (
		<Button
			variant='contained'
			sx={{
				width: 1,
				[theme.breakpoints.down('mobile')]: {
					fontSize: '15px',
				},
			}}
			onClick={handleOpen}
			startIcon={<AddCircleOutlineIcon />}
		>
			Create Manually
		</Button>
	)

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setIsRepeatable(newValue === 1)
	}

	const repeatableButton = (
		<Tabs variant='fullWidth' value={isRepeatable ? 1 : 0} onChange={handleTabChange}>
			<Tab label='One Time' />
			<Tab label='Repeatable' />
		</Tabs>
	)

	const actionButtons = (
		<DialogActions>
			<Button variant='contained' type='submit'>
				Add Task
			</Button>
		</DialogActions>
	)

	return (
		<>
			{openButton}
			<TeacherModalStyled open={open} onClose={handleClose}>
				<ModalTitle onClick={handleClose} text='Create Task' />

				{repeatableButton}
				<TaskModalContent>
					<Box
						component='form'
						onSubmit={(e) => {
							handleAdd()
							e.preventDefault()
						}}
					>
						<TextField
							margin='normal'
							id='name'
							label={isRepeatable ? 'Repeatable Name' : 'Task Name'}
							fullWidth
							variant='standard'
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
						<ReactQuill
							style={{ width: '100%' }}
							placeholder='Description'
							theme='snow'
							modules={modules}
							onChange={setDescription}
						/>
						<BoxInModal>
							{/* either show a due date option or max completions based on if task is repeatable */}
							{!isRepeatable ? (
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateTimePicker
										label='Due Date'
										value={dueDate}
										minDateTime={new Date()}
										onChange={(value) => setDueDate(value)}
									/>
								</LocalizationProvider>
							) : (
								<TextField
									type='number'
									margin='normal'
									id='description'
									label='Max Completions'
									fullWidth
									variant='standard'
									placeholder=''
									multiline
									maxRows={8}
									value={maxCompletions}
									error={maxCompletionsIsInvalid(maxCompletions)}
									helperText={
										maxCompletionsIsInvalid(maxCompletions)
											? 'Max completions must be a positive integer'
											: null
									}
									onChange={(event) => setMaxCompletions(event.target.value)}
								/>
							)}
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
						<Grid container justifyContent='center'>
							{actionButtons}
						</Grid>
					</Box>
				</TaskModalContent>
			</TeacherModalStyled>
		</>
	)
}
