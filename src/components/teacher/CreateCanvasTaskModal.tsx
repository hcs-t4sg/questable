import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import { Box, FormControl, InputLabel, MenuItem, Modal, Select } from '@mui/material'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { getUnixTime } from 'date-fns'
import { useState } from 'react'
import { addTask } from '../../utils/mutations'
import Grid from '@mui/material/Grid'
import { Classroom, Player, CanvasAssignment } from '../../types'
import { useQuery } from 'react-query'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { truncate } from 'lodash'
import ImportIcon from '@mui/icons-material/Delete'

export default function CreateCanvasTaskModal({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [reward, setReward] = useState<number>(10)
	const [dueDate, setDueDate] = useState<Date | null>(null)

	const handleOpen = () => {
		setOpen(true)
		setName('')
		setDueDate(new Date())
		setDescription('')
		setReward(10)
	}

	const handleClose = () => {
		setOpen(false)
	}

	// Mutation handlers

	const handleAdd = () => {
		if (!dueDate) {
			window.alert('You need to provide a due date')
			return
		}

		const newTask = {
			name,
			description,
			reward,
			due: getUnixTime(dueDate),
		}

		addTask(classroom.id, newTask, player.id).catch(console.error)

		handleClose()
	}

	const openButton = (
		<Button sx={{ width: 1 }} onClick={handleOpen} startIcon={<AddCircleOutlineIcon />}>
			Import From Canvas
		</Button>
	)

	const actionButtons = (
		<DialogActions>
			<Button variant='contained' onClick={handleAdd}>
				Add Task
			</Button>
		</DialogActions>
	)

	const assignmentButton = (
		<DialogActions>
			<Button variant='contained' onClick={handleAssignments}>
				View Assignments
			</Button>
		</DialogActions>
	)

	return (
		<div>
			{openButton}
			<Modal
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				open={open}
				onClose={handleClose}
			>
				<Box
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
				>
					<Box
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
					/>
					{assignmentButton}
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
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							m: 2,
						}}
					>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								label='Due Date'
								value={dueDate}
								onChange={(value) => setDueDate(value)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Box>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							m: 2,
						}}
					>
						<FormControl fullWidth>
							<InputLabel id='reward-dropdown-label'>Reward</InputLabel>
							<Select
								labelId='reward-dropdown'
								id='reward-dropdown'
								value={reward}
								label='Reward'
								onChange={(event) => setReward(event.target.value as number)}
							>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={20}>20</MenuItem>
								<MenuItem value={30}>30</MenuItem>
								<MenuItem value={40}>40</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<br />
					{/* center the save button */}
					<Grid container justifyContent='center'>
						{actionButtons}
					</Grid>
				</Box>
			</Modal>
		</div>
	)
}

const handleAssignments = () => {
	// Fetcher
	const getAssignments = async () => {
		const res = await fetch(
			'https://canvas.instructure.com/api/v1/courses/69360000001036125/assignments',
		)
		return res.json()
	}
	// Hook
	const { isLoading, error, data } = useQuery('assignments', getAssignments)

	if (isLoading) return 'Loading...'
	if (error) return 'An error has occurred'

	// preprocess data here
	const canvasAssignments: CanvasAssignment[] = data.map(
		() =>
			({
				...data.data(),
				id: data.id,
				description: data.description,
				name: data.name,
			} as CanvasAssignment),
	)

	// Import
	// const [name, setName] = useState('')
	// const [description, setDescription] = useState('')

	// const handleImport = (name: string, description: string) => {
	// setName(name)
	// setDescription(description)
	// }

	return (
		<Grid item xs={6}>
			<Table sx={{ minWidth: 650 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell sx={{ m: '1%', p: '1%' }}></TableCell>
						<TableCell>Task</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Deadline</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{canvasAssignments.map((assignment) => (
						<TableRow
							key={assignment.id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component='th' scope='row'>
								{' '}
								{assignment.name}{' '}
							</TableCell>
							<TableCell align='left'>{truncate(assignment.description)}</TableCell>

							<TableCell align='right' sx={{ width: 0.01 }}>
								<IconButton onClick={() => handleImport(assignment.name, assignment.description)}>
									<ImportIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Grid>
	)
}
