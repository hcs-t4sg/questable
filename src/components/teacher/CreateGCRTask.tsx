import {
	Button,
	DialogActions,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	useTheme,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import {
	BoxInModal,
	ModalTitle,
	TaskModalContent,
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
import modules from '../../utils/TextEditor'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function CreateGCRTask({
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
	const [token, setToken] = useState('')
	const [classroomList, setClassrooms] = useState<any[]>([])
	const [classID, setClassId] = useState('')
	const [tasks, setTasks] = useState<any[] | 'loading' | null>(null)
	const [taskID, setTaskID] = useState('')
	const [taskName, setTaskName] = useState('')

	useEffect(() => {
		// pay attention to dependency array - empty now
		const tokenRef = doc(db, 'users', player.id)
		const fetchToken = async () => {
			const getToken = await getDoc(tokenRef)

			if (getToken.exists()) {
				const tokenData = getToken.data()
				setToken(tokenData.gcrToken)
			} else {
				window.alert('Log into Google on the Settings page!')
			}
		}
		fetchToken().catch(console.error)
	}, [])

	async function getCourses() {
		// asking for variable before loaded (error upon refresh)
		if (token) {
			const response = await fetch('https://classroom.googleapis.com/v1/courses/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			return response.json()
		}
	}

	async function getCourseWork(classID: string) {
		const response = fetch(`https://classroom.googleapis.com/v1/courses/${classID}/courseWork`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return (await response).json()
	}

	// async function which will make the API call and then set the state variable with the result.
	const fetchGoogleClassrooms = async () => {
		const classrooms = await getCourses()
		setClassrooms(classrooms.courses)
		if (typeof classrooms.courses == 'undefined' || classrooms.courses.length == 0) {
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
			setTasks(coursework.courseWork)
		}
	}

	const handleClick = async () => {
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
			gcrCourseID: classID,
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
				sx={{
					width: 1,
					[theme.breakpoints.down('mobile')]: {
						fontSize: '11.85px',
					},
				}}
				onClick={handleClick}
				startIcon={<AddCircleOutlineIcon />}
			>
				Import from Google Classroom
			</Button>
			<TeacherModalStyled open={open} onClose={handleClose}>
				<ModalTitle onClick={handleClose} text='Create Task' />
				<TaskModalContent>
					<BoxInModal>
						<FormControl fullWidth>
							<InputLabel id='classroom-dropdown-label'>Select Classroom</InputLabel>
							<Select
								labelId='classroom-dropdown'
								id='classroom-dropdown'
								value={classID}
								label='Select Classroom'
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
						<Loading>Loading Tasks...</Loading>
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
					<ReactQuill
						style={{ width: '100%' }}
						placeholder='Description'
						theme='snow'
						modules={modules}
						onChange={setDescription}
					/>
					<BoxInModal>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								label='Due Date'
								value={dueDate}
								onChange={(value) => setDueDate(value)}
								sx={{ width: '60%' }}
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
				</TaskModalContent>
			</TeacherModalStyled>
		</div>
	)
}
