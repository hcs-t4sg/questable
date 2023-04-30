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
import {
	BoxInModal,
	ModalTitle,
	TaskModalBox,
	TeacherModalStyled,
} from '../../styles/TaskModalStyles'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Timestamp, doc, getDoc } from 'firebase/firestore'
import { addTask } from '../../utils/mutations'
import { useSnackbar } from 'notistack'
import { Player, Classroom } from '../../types'
import { db } from '../../utils/firebase'
import Loading from '../global/Loading'

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
	const [token, setToken] = useState('')
	const [classroomList, setClassrooms] = useState<any[]>([])
	const [classID, setClassId] = useState('')
	// const [clientLoaded, setClientLoaded] = useState(false)
	const [tasks, setTasks] = useState<any[] | 'loading' | null>(null)
	const [taskID, setTaskID] = useState('')
	const [taskName, setTaskName] = useState('')

	useEffect(() => {
		const tokenRef = doc(db, 'users', player.id)
		const fetchToken = async () => {
			// why is this outdated?
			const getToken = await getDoc(tokenRef)

			if (getToken.exists()) {
				const tokenData = getToken.data()
				setToken(tokenData.gcrToken)
				console.log(token)
			} else {
				window.alert('Log into Google on the Settings page!')
			}
		}
		fetchToken()
	}, [token])

	async function getCourses() {
		// asking for variable before loaded (error upon refresh)
		if (token) {
			// loadClient()

			const response = fetch('https://classroom.googleapis.com/v1/courses/', {
				// mode: 'no-cors',
				method: 'GET',
				// credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			console.log(response)

			// const response = await gapi.client.classroom.courses.list({})
			// console.log(response.result.courses)
			// return response.result.courses

			return (await response).json()
		}
	}

	async function getCourseWork(classID: string) {
		console.log(classID)
		// console.log(`https://classroom.googleapis.com/v1/courses/${classID}/courseWork`)
		// const response = await gapi.client.classroom.courses.courseWork.list({
		// 	courseId: classID,
		// })
		// console.log(response)
		// return response.result.courseWork
		const response = fetch(`https://classroom.googleapis.com/v1/courses/${classID}/courseWork`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		console.log(response)
		return (await response).json()
	}

	// async function which will make the API call and then set the state variable with the result.
	const fetchGoogleClassrooms = async () => {
		// if (!clientLoaded) {
		// 	loadClient()
		// 	setClientLoaded(true)
		// }
		const classroomList = await getCourses()
		console.log(classroomList.courses)
		setClassrooms(classroomList.courses)
		if (classroomList.length == 0) {
			window.alert('Oops, classrooms not found! Try logging into Google in Settings first!')
			return false
		} else {
			return true
		}
	}

	const fetchCourseWork = async (classID: string) => {
		setTasks('loading')
		if (classID != '') {
			const coursework = await getCourseWork(classID)
			console.log(coursework)
			setTasks(coursework.courseWork)
			console.log(tasks)
		}
	}

	const handleClick = async () => {
		console.log(classroomList)
		if (!token) {
			window.alert('Oops, classrooms not found! Try logging into Google in Settings first!')
		} else {
			setTasks(null)
			const fetched = await fetchGoogleClassrooms()
			if (fetched) {
				setOpen(true)
			}
		}
	}

	const handleAdd = () => {
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
			gcrID: taskID,
			gcrName: taskName,
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
		setName('')
		setDescription('')
		setDueDate(null)
		setTaskID('')
		setClassrooms([])
		setClassId('')
		setTasks([])
		setTaskName('')
		setOpen(false)
	}
	//	add onclick later
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
				Import from Google Classroom
			</Button>
			<TeacherModalStyled open={open} onClose={handleClose}>
				<TaskModalBox>
					<ModalTitle onClick={handleClose} text='Create Task' />
					<BoxInModal>
						<FormControl fullWidth>
							<InputLabel id='classroom-dropdown-label'>Select Classroom</InputLabel>
							<Select
								labelId='classroom-dropdown'
								id='classroom-dropdown'
								value={classID}
								label='Select Classroom'
								onChange={(event) => {
									console.log(event.target.value)
								}}
							>
								<MenuItem
									key='select'
									value=''
									onClick={() => {
										setName('')
										setDescription('')
										setDueDate(null)
										setClassId('')
										setTasks(null)
									}}
								>
									Select Classroom
								</MenuItem>
								{classroomList
									? classroomList.map((classroom) => (
											<MenuItem
												key={classroom.name}
												value={classroom.id}
												onClick={() => {
													fetchCourseWork(classroom.id)
													setClassId(classroom.id)
												}}
											>
												{classroom.name}
											</MenuItem>
									  ))
									: null}
							</Select>
						</FormControl>
					</BoxInModal>
					{tasks == 'loading' ? (
						<Loading>Loading Tasks</Loading>
					) : tasks == null ? null : (
						<BoxInModal>
							<FormControl fullWidth>
								<InputLabel id='gcr-task-dropdown-label'>Google Classroom Task</InputLabel>
								<Select
									defaultValue=''
									labelId='gcr-task-dropdown'
									id='gcr-task-dropdown'
									value={taskID}
									label='Google Classroom Task'
									onChange={(event) => {
										setTaskID(event.target.value as string)
										console.log(event.target.value)
									}}
								>
									<MenuItem
										key='select'
										value='select'
										onClick={() => {
											setName('')
											setDescription('')
											setDueDate(null)
										}}
									>
										Google Classroom Task
									</MenuItem>
									{tasks.map((task) => (
										<MenuItem
											key={task.title}
											value={task.id}
											onClick={() => {
												setName(task.title)
												setTaskName(task.title)
												setDescription(task.description)
												if (task.dueDate) {
													const gcrDueDate = new Date(
														Date.UTC(
															task.dueDate.year,
															// because months are 0-indexed in Javascript ugh
															task.dueDate.month - 1,
															task.dueDate.day,
															task.dueTime.hours,
															task.dueTime.minutes,
														),
													)
													if (gcrDueDate) {
														setDueDate(gcrDueDate)
													}
												}
											}}
										>
											{task.title}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</BoxInModal>
					)}
					<TextField
						margin='normal'
						id='name'
						label='Name'
						fullWidth
						variant='standard'
						placeholder=''
						multiline
						maxRows={8}
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
