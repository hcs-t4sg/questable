// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
// import { Dialog, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
// import Button from '@mui/material/Button'
// import DialogActions from '@mui/material/DialogActions'
// import IconButton from '@mui/material/IconButton'
// import Grid from '@mui/material/Grid'
// import TextField from '@mui/material/TextField'
// // import Typography from '@mui/material/Typography'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { Timestamp } from 'firebase/firestore'
// import { useEffect, useState } from 'react'
// import { addTask } from '../src/utils/mutations'
// import { Classroom, Player, CanvasAssignment, CanvasCourse } from '../src/types'
// import { useQuery } from 'react-query'
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
// import TableHead from '@mui/material/TableHead'
// import TableRow from '@mui/material/TableRow'
// import { truncate } from 'lodash'
// import ImportIcon from '@mui/icons-material/Delete'
// import { enqueueSnackbar } from 'notistack'
// import {
// 	BoxInModal,
// 	ModalTitle,
// 	TaskModalBox,
// 	TeacherModalStyled,
// } from '../src/styles/TaskModalStyles'

// function CoursesDialog({ isOpen, handleImport }: { isOpen: boolean; handleImport: () => void }) {
// 	const getCourses = async () => {
// 		const res = await fetch(
// 			'https://canvas.instructure.com/api/v1/courses?access_token=6936~SDn7S0P1jfbmfwL7AINV7LxyI2RZ8ysDQBYTSnZYjIsAgndC2q9ReajcY3YJwhvF',
// 		)
// 		return res.json()
// 	}
// 	const { isLoading, error, data } = useQuery('courses', getCourses)
// 	const [courses, setCourses] = useState<CanvasCourse[]>([])
// 	useEffect(() => {
// 		setCourses(
// 			data?.map(
// 				() =>
// 					({
// 						id: data.id,
// 						name: data.name,
// 					} as CanvasCourse),
// 			),
// 		)
// 		getCourses()
// 	}, [])
// 	if (isLoading) return <div>Loading...</div>
// 	if (error) return <div>An error has occurred</div>
// 	return (
// 		<Dialog open={isOpen}>
// 			<Grid item xs={6}>
// 				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
// 					<TableHead>
// 						<TableRow>
// 							<TableCell sx={{ m: '1%', p: '1%' }}></TableCell>
// 							<TableCell>Name</TableCell>
// 						</TableRow>
// 					</TableHead>
// 					<TableBody>
// 						{courses?.map((course) => (
// 							<TableRow key={course.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
// 								<TableCell component='th' scope='row'>
// 									{' '}
// 									{course.name}{' '}
// 								</TableCell>
// 								<TableCell align='right' sx={{ width: 0.01 }}>
// 									<IconButton onClick={() => handleImport}>
// 										<ImportIcon />
// 									</IconButton>
// 								</TableCell>
// 							</TableRow>
// 						))}
// 					</TableBody>
// 				</Table>
// 			</Grid>
// 		</Dialog>
// 	)
// }
// function AssignmentsDialog({
// 	isOpen,
// 	handleImport,
// }: {
// 	isOpen: boolean
// 	handleImport: (_name: string, _description: string, _id: string) => void
// }) {
// 	// Fetcher
// 	const getAssignments = async () => {
// 		const res = await fetch(
// 			'https://canvas.instructure.com/api/v1/courses/69360000001036125/assignment?/access_token=6936~SDn7S0P1jfbmfwL7AINV7LxyI2RZ8ysDQBYTSnZYjIsAgndC2q9ReajcY3YJwhvF',
// 		)
// 		return res.json()
// 	}
// 	// Hook
// 	const { isLoading, error, data } = useQuery('assignments', getAssignments)
// 	// preprocess data here
// 	const [assignments, setAssignments] = useState<CanvasAssignment[]>([])
// 	useEffect(() => {
// 		setAssignments(
// 			data?.map(
// 				() =>
// 					({
// 						id: data.id,
// 						description: data.description,
// 						name: data.name,
// 					} as CanvasAssignment),
// 			),
// 		)
// 		getAssignments()
// 	}, [])

// 	if (isLoading) return <div>Loading...</div>
// 	if (error) return <div>An error has occurred</div>

// 	return (
// 		<Dialog open={isOpen}>
// 			<Grid item xs={6}>
// 				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
// 					<TableHead>
// 						<TableRow>
// 							<TableCell sx={{ m: '1%', p: '1%' }}></TableCell>
// 							<TableCell>Task</TableCell>
// 							<TableCell>Description</TableCell>
// 							<TableCell>Deadline</TableCell>
// 						</TableRow>
// 					</TableHead>
// 					<TableBody>
// 						{assignments?.map((assignment) => (
// 							<TableRow
// 								key={assignment.id}
// 								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
// 							>
// 								<TableCell component='th' scope='row'>
// 									{' '}
// 									{assignment.name}{' '}
// 								</TableCell>
// 								<TableCell align='left'>{truncate(assignment.description)}</TableCell>

// 								<TableCell align='right' sx={{ width: 0.01 }}>
// 									<IconButton
// 										onClick={() =>
// 											handleImport(assignment.name, assignment.description, assignment.id)
// 										}
// 									>
// 										<ImportIcon />
// 									</IconButton>
// 								</TableCell>
// 							</TableRow>
// 						))}
// 					</TableBody>
// 				</Table>
// 			</Grid>
// 		</Dialog>
// 	)
// }

// export default function CanvasAssignmentModal({
// 	classroom,
// 	player,
// }: {
// 	classroom: Classroom
// 	player: Player
// }) {
// 	const [open, setOpen] = useState(false)
// 	const [name, setName] = useState('')
// 	const [description, setDescription] = useState('')
// 	const [reward, setReward] = useState<number>(10)
// 	const [dueDate, setDueDate] = useState<Date | null>(null)
// 	const [canvasId, setCanvasId] = useState('')

// 	const handleOpen = () => {
// 		setOpen(true)
// 		setName('')
// 		setDueDate(new Date())
// 		setDescription('')
// 		setReward(10)
// 		setCanvasId('')
// 	}

// 	const handleClose = () => {
// 		setOpen(false)
// 	}

// 	// Mutation handlers

// 	const handleAdd = () => {
// 		if (!dueDate) {
// 			enqueueSnackbar('You need to provide a due date', { variant: 'error' })
// 			return
// 		}

// 		const dateIsInvalid = isNaN(dueDate.getTime())
// 		if (dateIsInvalid) {
// 			enqueueSnackbar('Due date is invalid', { variant: 'error' })
// 			return
// 		}

// 		const newTask = {
// 			name,
// 			description,
// 			reward,
// 			due: Timestamp.fromDate(dueDate),
// 			type: 'canvas',
// 			canvasId,
// 		}

// 		addTask(classroom.id, newTask, player.id)
// 			.then(() => {
// 				enqueueSnackbar(`Added task "${name}"!`, {
// 					variant: 'success',
// 				})
// 				handleClose()
// 			})
// 			.catch((err) => {
// 				console.error(err)
// 				enqueueSnackbar('There was an error adding the task.', {
// 					variant: 'error',
// 				})
// 			})
// 	}

// 	const openButton = (
// 		<Button
// 			variant='text'
// 			sx={{ width: 1 }}
// 			onClick={handleOpen}
// 			startIcon={<AddCircleOutlineIcon />}
// 		>
// 			Import From Canvas
// 		</Button>
// 	)

// 	const actionButtons = (
// 		<DialogActions>
// 			<Button variant='contained' onClick={handleAdd}>
// 				Add Task
// 			</Button>
// 		</DialogActions>
// 	)

// 	const [coursesDialogIsOpen, setCoursesDialogIsOpen] = useState(false)
// 	const [assignmentsDialogIsOpen, setAssignmentsDialogIsOpen] = useState(false)

// 	const assignmentButton = (
// 		<DialogActions>
// 			<Button variant='contained' onClick={() => setCoursesDialogIsOpen(true)}>
// 				View Assignments
// 			</Button>
// 		</DialogActions>
// 	)

// 	const setCourseSelection = () => {
// 		setCoursesDialogIsOpen(false)
// 		setAssignmentsDialogIsOpen(true)
// 	}

// 	const setCanvasTaskValues = (name: string, description: string) => {
// 		setName(name)
// 		setDescription(description)
// 		setAssignmentsDialogIsOpen(false)
// 		window.alert('Importing ${assignment.name} from Canvas')
// 	}

// 	return (
// 		<div>
// 			{openButton}
// 			<TeacherModalStyled open={open} onClose={handleClose}>
// 				{/* <Box
// 					sx={{
// 						width: '40%',
// 						display: 'flex',
// 						flexDirection: 'column',
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 						padding: '40px',
// 						paddingTop: '40px',
// 						backgroundColor: 'white',
// 						marginBottom: '18px',
// 					}}
// 				> */}
// 				<TaskModalBox>
// 					<ModalTitle onClick={handleClose} text='Create Task' />
// 					{/* <Box
// 						sx={{
// 							width: '100%',
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'space-between',
// 						}}
// 					>
// 						<Typography fontWeight='light' variant='h5'>
// 							Create Task
// 						</Typography>
// 						<IconButton onClick={handleClose}>
// 							<CloseIcon />
// 						</IconButton>
// 					</Box>

// 					<hr
// 						style={{
// 							backgroundColor: '#D9D9D9',
// 							height: '1px',
// 							borderWidth: '0px',
// 							borderRadius: '5px',
// 							width: '100%',
// 							marginBottom: '10px',
// 						}}
// 					/> */}

// 					{assignmentButton}
// 					<CoursesDialog isOpen={coursesDialogIsOpen} handleImport={setCourseSelection} />
// 					<AssignmentsDialog isOpen={assignmentsDialogIsOpen} handleImport={setCanvasTaskValues} />

// 					<TextField
// 						margin='normal'
// 						id='name'
// 						label='Task Name'
// 						fullWidth
// 						variant='standard'
// 						value={name}
// 						onChange={(event) => setName(event.target.value)}
// 					/>
// 					<TextField
// 						margin='normal'
// 						id='description'
// 						label='Description'
// 						fullWidth
// 						variant='standard'
// 						placeholder=''
// 						multiline
// 						maxRows={8}
// 						value={description}
// 						onChange={(event) => setDescription(event.target.value)}
// 					/>
// 					<BoxInModal>
// 						{/* <Box
// 						sx={{
// 							width: '100%',
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'space-between',
// 							m: 2,
// 						}}
// 					> */}
// 						<LocalizationProvider dateAdapter={AdapterDateFns}>
// 							<DateTimePicker
// 								label='Due Date'
// 								value={dueDate}
// 								onChange={(value) => setDueDate(value)}
// 							/>
// 						</LocalizationProvider>
// 					</BoxInModal>
// 					{/* </Box> */}
// 					{/* <Box
// 						sx={{
// 							width: '100%',
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'space-between',
// 							m: 2,
// 						}}
// 					> */}
// 					<BoxInModal>
// 						<FormControl fullWidth>
// 							<InputLabel id='reward-dropdown-label'>Reward</InputLabel>
// 							<Select
// 								labelId='reward-dropdown'
// 								id='reward-dropdown'
// 								value={reward}
// 								label='Reward'
// 								onChange={(event) => setReward(event.target.value as number)}
// 							>
// 								<MenuItem value={10}>10</MenuItem>
// 								<MenuItem value={20}>20</MenuItem>
// 								<MenuItem value={30}>30</MenuItem>
// 								<MenuItem value={40}>40</MenuItem>
// 							</Select>
// 						</FormControl>
// 						{/* </Box> */}
// 					</BoxInModal>
// 					<br />
// 					{/* center the save button */}
// 					<Grid container justifyContent='center'>
// 						{actionButtons}
// 					</Grid>
// 					{/* </Box> */}
// 				</TaskModalBox>
// 			</TeacherModalStyled>
// 		</div>
// 	)
// }
