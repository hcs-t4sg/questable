import { gapi } from 'gapi-script'
import {
	Button,
	DialogActions,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { loadClient } from '../../utils/GCRAPI'
import {
	BoxInModal,
	ModalTitle,
	TaskModalBox,
	TeacherModalStyled,
} from '../../styles/TaskModalStyles'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Timestamp } from 'firebase/firestore'
import { addTask } from '../../utils/mutations'
import { useSnackbar } from 'notistack'
import { Classroom, Player } from '../../types'
// import { queryClient } from '../..'
// import { useQuery } from 'react-query'

export default function CreateGCRTask({
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
	const [classroomList, setClassrooms] = useState<any[]>([])
	const [classID, setClassId] = useState('')

	async function getCourses() {
		const response = await gapi.client.classroom.courses.list({})
		return response.result.courses
	}

	async function getCourseWork() {
		const response = await gapi.client.classroom.courses.courseWork.list({
			courseId: '603698134454',
		})
		console.log(response.result)
		return response.result

		// const response = fetch(`https://classroom.googleapis.com/v1/courses/${classID}/courseWork`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 		'Authorization': `Bearer ${accessToken}`
		// 	}
		// })
	}

	// async function which will make the API call and then set the state variable with the result.
	const fetchGoogleClassrooms = async () => {
		const classroomList = await getCourses()
		setClassrooms(classroomList)
		console.log(classroomList)
	}

	const fetchCourseWork = async () => {
		console.log(classID)
		if (classID != '') {
			const coursework = await getCourseWork()
			console.log(coursework)
		}
	}

	// useEffect to run the async function after the component renders. Make sure to include dependency array [] to ensure it only runs on the FIRST render (no loops)!
	useEffect(() => {
		loadClient('https://www.googleapis.com/auth/classroom.coursework.me')
	}, [])

	const handleClick = () => {
		setOpen(true)
		loadClient('https://www.googleapis.com/auth/classroom.courses')
		// this popup is so annoying
		fetchGoogleClassrooms()
	}

	const handleAdd = () => {
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

	const handleClose = () => {
		setOpen(false)
	}

	const actionButtons = (
		<DialogActions>
			<Button variant='contained' onClick={handleAdd}>
				Add Task
			</Button>
		</DialogActions>
	)

	return (
		<div>
			<Button
				variant='contained'
				sx={{ width: 1 }}
				onClick={handleClick}
				startIcon={<AddCircleOutlineIcon />}
			>
				Create from Google Classroom
			</Button>
			<TeacherModalStyled open={open} onClose={handleClose}>
				<TaskModalBox>
					<ModalTitle onClick={handleClose} text='Create Task' />
					<BoxInModal>
						<FormControl fullWidth>
							<InputLabel id='classroom-dropdown-label'>Classroom</InputLabel>
							<Select
								labelId='classroom-dropdown'
								id='classroom-dropdown'
								value={classID}
								label='Classroom'
								onChange={(event) => {
									setClassId(event.target.value as string)
								}}
							>
								{classroomList.map((classroom) => (
									<MenuItem key='class' value={classroom.id}>
										{classroom.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</BoxInModal>
					<Button onClick={fetchCourseWork}>fetch</Button>
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
								value={dueDate}
								onChange={(value) => setDueDate(value)}
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
						{actionButtons}
					</Grid>
				</TaskModalBox>
			</TeacherModalStyled>
		</div>
	)
}
