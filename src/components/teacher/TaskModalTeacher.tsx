// import CloseIcon from '@mui/icons-material/Close'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
// import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
// import Typography from '@mui/material/Typography'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
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
			<TeacherModalStyled
				// sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				open={open}
				onClose={handleClose}
			>
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
					{/* <Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography fontWeight='light' variant='h5'>
							Overview
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
					<ModalTitle onClick={handleClose} text='Overview' />
					<TextField
						margin='normal'
						id='name'
						label='Task Name'
						fullWidth
						variant='standard'
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
					{/* <TextField
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
					/> */}
					<CKEditor
						editor={ClassicEditor}
						data={task.description}
						onChange={(_event, editor) => {
							const data = editor.getData()
							setDescription(data)
						}}
					/>

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
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								label='Due Date'
								value={date}
								onChange={(newValue) => setDate(newValue)}
							/>
						</LocalizationProvider>
						{/* </Box> */}
					</BoxInModal>
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
						{saveButton}
					</Grid>
				</TaskModalBox>
				{/* </Box> */}
			</TeacherModalStyled>
		</div>
	)
}
