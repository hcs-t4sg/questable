import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { FormControl, InputLabel, MenuItem, Select, Tab, Tabs } from '@mui/material'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
// import Typography from '@mui/material/Typography'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Timestamp } from 'firebase/firestore'
import * as React from 'react'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import { addRepeatable, addTask } from '../../utils/mutations'

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

import {
	BoxInModal,
	ModalTitle,
	TaskModalBox,
	TeacherModalStyled,
} from '../../styles/TaskModalStyles'
import { useSnackbar } from 'notistack'

export default function CreateTaskModal({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	const { enqueueSnackbar } = useSnackbar()

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
		setDueDate(new Date())
		setDescription('')
		setReward(10)
		setMaxCompletions('1')
		setIsRepeatable(false)
	}

	const handleClose = () => {
		setOpen(false)
	}

	// Mutation handlers

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
			sx={{ width: 1 }}
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
		<Tabs value={isRepeatable ? 1 : 0} onChange={handleTabChange}>
			<Tab label='One Time' />
			<Tab label='Repeatable' />
		</Tabs>
	)

	const actionButtons = (
		<DialogActions>
			<Button variant='contained' onClick={handleAdd}>
				Add Task
			</Button>
		</DialogActions>
	)

	return (
		<div>
			{openButton}
			<TeacherModalStyled open={open} onClose={handleClose}>
				{/* <Box
					sx={{
						width: '40%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '40px',
						paddingTop: '40px',
						backgroundColor: 'white',
						marginBottom: '18px',
					}}
				> */}
				<TaskModalBox>
					<ModalTitle onClick={handleClose} text='Create Task' />
					{/* <Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography fontWeight='light' variant='h5'>
							Create Task
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
							marginBottom: '10px',
						}}
					/> */}

					{repeatableButton}

					<TextField
						margin='normal'
						id='name'
						label={isRepeatable ? 'Repeatable Name' : 'Task Name'}
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
						{/* <Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							m: 2,
						}}
					> */}
						{/* either show a due date option or max completions based on if task is repeatable */}
						{!isRepeatable ? (
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DateTimePicker
									label='Due Date'
									value={dueDate}
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
					{/* </Box> */}
					{/* <Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							m: 2,
						}}
					> */}
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
					{/* </Box> */}
				</TaskModalBox>
			</TeacherModalStyled>
		</div>
	)
}
