/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { Classroom, Repeatable } from '../../types'
import { deleteRepeatable, updateRepeatable } from '../../utils/mutations'
import modules from '../../utils/TextEditor'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import {
	TaskModalContent,
	ModalTitle,
	BoxInModal,
	TeacherModalStyled,
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

export default function RepeatableModalTeacher({
	repeatable,
	classroom,
}: {
	repeatable: Repeatable
	classroom: Classroom
}) {
	const { enqueueSnackbar } = useSnackbar()

	const [open, setOpen] = useState(false)
	const [name, setName] = useState(repeatable.name)
	const [description, setDescription] = useState(repeatable.description)
	const [maxCompletions, setMaxCompletions] = useState<string>(repeatable.maxCompletions.toString())

	const [isEditing, setIsEditing] = useState<boolean>(false)

	// Open the task modal
	const handleClickOpen = () => {
		setOpen(true)
		setName(repeatable.name)
		// setMaxCompletions(repeatable.maxCompletions.toString())
		setDescription(repeatable.description)
	}

	const handleCancel = () => {
		setName(repeatable.name)
		// setMaxCompletions(repeatable.maxCompletions.toString())
		setDescription(repeatable.description)
		setIsEditing(false)
	}

	// Close the task modal
	const handleClose = () => {
		setOpen(false)
	}
	// Handle the click of an edit button
	const handleEdit = () => {
		if (name === '') {
			enqueueSnackbar('You need to provide a name for the repeatable', { variant: 'error' })
			return
		}

		if (maxCompletionsIsInvalid(maxCompletions)) {
			setMaxCompletions('1')
			enqueueSnackbar('Max completions must be a positive integer', { variant: 'error' })
			return
		}

		const updatedRepeatable = {
			name: name,
			// maxCompletions: parseInt(maxCompletions),
			description: description,
			id: repeatable.id,
		}

		handleClose()
		updateRepeatable(classroom.id, updatedRepeatable)
			.then(() => {
				setIsEditing(false)
				enqueueSnackbar('Edited repeatable!', { variant: 'success' })
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar('There was an issue editing the repeatable', { variant: 'error' })
			})
	}

	const toggleIsEditing = () => {
		setIsEditing(!isEditing)
	}

	const handleDelete = () => {
		// message box to confirm deletion
		if (window.confirm('Are you sure you want to delete this repeatable task?')) {
			deleteRepeatable(classroom.id, repeatable.id)
				.then(() => {
					enqueueSnackbar('Deleted repeatable!', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar(err.message, { variant: 'error' })
				})
		}
	}

	return (
		<Box>
			<IconButton onClick={handleClickOpen}>
				<EditIcon />
			</IconButton>
			<TeacherModalStyled open={open} onClose={handleClose}>
				<TaskModalContent>
					<ModalTitle onClick={handleClose} text='Overview' />
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
							InputProps={{
								readOnly: !isEditing,
							}}
							onChange={(event) => setName(event.target.value)}
						/>

						<ReactQuill
							theme='snow'
							style={{ width: '100%' }}
							value={description}
							modules={modules}
							onChange={setDescription}
							readOnly={!isEditing}
						/>

						<BoxInModal>
							<TextField
								type='number'
								margin='normal'
								id='maxcompletions'
								label='Max Completions'
								fullWidth
								variant='standard'
								placeholder=''
								sx={{ ml: -2 }}
								value={maxCompletions}
								InputProps={{
									readOnly: !isEditing,
								}}
								error={maxCompletionsIsInvalid(maxCompletions)}
								helperText={
									maxCompletionsIsInvalid(maxCompletions)
										? 'Max completions must be an integer greater than 0'
										: null
								}
								onChange={(event) => setMaxCompletions(event.target.value)}
							/>
							{/* </Box> */}
						</BoxInModal>

						<BoxInModal>
							<Typography
								sx={{ ml: -2 }}
								variant='body1'
							>{`Reward: ${repeatable.reward}g (cannot be edited)`}</Typography>
						</BoxInModal>
						<br />
						<Grid container justifyContent='right'>
							<Button
								onClick={toggleIsEditing}
								sx={{ display: isEditing ? 'none' : 'block' }}
								// variant='contained'
							>
								Edit Repeatable
							</Button>
							<Button
								onClick={handleDelete}
								sx={{ display: isEditing ? 'block' : 'none' }}
								color='error'
							>
								Delete
							</Button>
							<Button
								onClick={handleCancel}
								sx={{ display: isEditing ? 'block' : 'none', marginLeft: '5px' }}
								variant='text'
							>
								Cancel
							</Button>
							<Button
								type='submit'
								sx={{ display: isEditing ? 'block' : 'none', marginLeft: '5px' }}
								variant='contained'
								color='success'
							>
								Save Changes
							</Button>
						</Grid>
					</Box>
				</TaskModalContent>
			</TeacherModalStyled>
		</Box>
	)
}
