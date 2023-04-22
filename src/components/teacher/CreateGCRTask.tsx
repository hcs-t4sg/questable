import { gapi } from 'gapi-script'
// import { loadGapiInsideDOM } from 'gapi-script'
// const gapi = await loadGapiInsideDOM()
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
import { doc, getDoc } from 'firebase/firestore'
// import { addTask } from '../../utils/mutations'
// import { useSnackbar } from 'notistack'
import { Player } from '../../types'
import { db } from '../../utils/firebase'
// import { queryClient } from '../..'
// import { useQuery } from 'react-query'

export default function CreateGCRTask({
	// classroom,
	player,
}: {
	// classroom: Classroom
	player: Player
}) {
	// const { enqueueSnackbar } = useSnackbar()

	const [open, setOpen] = useState(false)
	const [description, setDescription] = useState('')
	const [reward, setReward] = useState<number>(10)
	const [dueDate, setDueDate] = useState<Date | null>(null)
	const [token, setToken] = useState('')
	const [classroomList, setClassrooms] = useState<any[]>([])
	const [classID, setClassId] = useState('')
	const [clientLoaded, setClientLoaded] = useState(false)
	const [tasks, setTasks] = useState<any[]>([])
	const [taskID, setTaskID] = useState('')

	useEffect(() => {
		const tokenRef = doc(db, 'users', player.id)
		const fetchToken = async () => {
			const getToken = await getDoc(tokenRef)

			if (getToken.exists()) {
				const tokenData = getToken.data()
				setToken(tokenData.gcrToken)
				console.log(token)
			}
		}
		fetchToken()
	}, [token])

	// useEffect(() => {
	// 	/* global google */
	// 	google.accounts.id.initialize({
	// 		// eslint-disable-next-line camelcase
	// 		client_id: clientID,
	// 		callback: handleCallbackResponse,
	// 	})
	// })

	async function getCourses() {
		// return response.result.courses

		// asking for variable before loaded (error upon refresh)
		if (token) {
			console.log(`access ${token}`)
			// loadClient()

			// const response = fetch('https://classroom.googleapis.com/v1/courses/', {
			// 	method: 'GET',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Authorization: `Bearer ${token}`,
			// 	},
			// })

			const response = await gapi.client.classroom.courses.list({})
			console.log(response.result.courses)
			return response.result.courses

			// return response
		}
	}

	async function getCourseWork() {
		console.log(classID)
		console.log(`https://classroom.googleapis.com/v1/courses/${classID}/courseWork`)
		const response = await gapi.client.classroom.courses.courseWork.list({
			courseId: classID,
		})
		console.log(response)
		return response.result.courseWork
		// const response = fetch(`https://classroom.googleapis.com/v1/courses/${classID}/courseWork`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: `Bearer ${token}`,
		// 	},
		// })
		// console.log(response)
	}

	// async function which will make the API call and then set the state variable with the result.
	const fetchGoogleClassrooms = async () => {
		if (!clientLoaded) {
			loadClient()
			setClientLoaded(true)
		}
		const classroomList = await getCourses()
		setClassrooms(classroomList)
		console.log(classroomList)
	}

	const fetchCourseWork = async () => {
		console.log(classID)
		const coursework = await getCourseWork()
		setTasks(coursework)
		console.log(tasks)
	}

	const handleClick = () => {
		setOpen(true)
		fetchGoogleClassrooms()
		// fetchCourseWork()
	}

	// const handleAdd = () => {

	// 	if (!dueDate) {
	// 		enqueueSnackbar('You need to provide a due date', { variant: 'error' })
	// 		return
	// 	}

	// 	const dateIsInvalid = isNaN(dueDate.getTime())
	// 	if (dateIsInvalid) {
	// 		enqueueSnackbar('Due date is invalid', { variant: 'error' })
	// 		return
	// 	}

	// 	const newTask = {
	// 		name,
	// 		description,
	// 		reward,
	// 		due: Timestamp.fromDate(dueDate),
	// 	}

	// 	handleClose()
	// 	addTask(classroom.id, newTask, player.id)
	// 		.then(() => {
	// 			enqueueSnackbar(`Added task "${name}"!`, {
	// 				variant: 'success',
	// 			})
	// 		})
	// 		.catch((err) => {
	// 			console.error(err)
	// 			enqueueSnackbar('There was an error adding the task.', {
	// 				variant: 'error',
	// 			})
	// 		})
	// }

	const handleClose = () => {
		setOpen(false)
	}
	//	add onclick later
	const actionButtons = (
		<DialogActions>
			<Button variant='contained'>Add Task</Button>
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
									console.log(event.target.value)
								}}
							>
								<MenuItem key='select' value='select'>
									Select Classroom
								</MenuItem>
								{classroomList.map((classroom) => (
									<MenuItem key={classroom.name} value={classroom.id}>
										{classroom.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</BoxInModal>
					<Button onClick={fetchCourseWork}>Fetch Tasks</Button>
					<BoxInModal>
						<FormControl fullWidth>
							<InputLabel id='gcr-task-dropdown-label'>Task</InputLabel>
							<Select
								labelId='gcr-task-dropdown'
								id='classroom-dropdown'
								value={taskID}
								label='Task Name'
								onChange={(event) => {
									setTaskID(event.target.value as string)
									console.log(event.target.value)
								}}
							>
								<MenuItem key='select' value='select'>
									Select Task
								</MenuItem>
								{tasks.map((tasks) => (
									<MenuItem key={tasks.title} value={tasks.id}>
										{tasks.title}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</BoxInModal>
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
