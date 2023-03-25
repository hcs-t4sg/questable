import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { useState } from 'react'
import Grid from '@mui/material/Grid'
import { addClassroom } from '../../utils/mutations'
import { User } from 'firebase/auth'
// import ClassroomModalContent from './ClassroomModalContent'

export default function CreateClassroomModal({ user }: { user: User }) {
	const [open, setOpen] = useState(false)
	const [newClassroomName, setNewClassroomName] = React.useState('')

	const handleClickOpen = () => {
		setOpen(true)
		setNewClassroomName('')
	}

	const handleClose = () => {
		setOpen(false)
	}

	// Mutation handlers
	const handleAddClassroom = () => {
		const classNameContainsNonWhitespaceChars = newClassroomName.replace(/\s+/g, '') != ''
		if (!classNameContainsNonWhitespaceChars) {
			alert('Classroom name cannot be empty')
			return
		}

		addClassroom(newClassroomName, user)
		setNewClassroomName('')
		setOpen(false)
	}

	const openButton = (
		<Button variant='contained' onClick={handleClickOpen}>
			Create!
		</Button>
	)

	const actionButtons = (
		<DialogActions>
			<Button onClick={handleClose}>Cancel</Button>
			<Button variant='contained' onClick={handleAddClassroom}>
				Create
			</Button>
		</DialogActions>
	)

	return (
		<Grid item xs={12}>
			{openButton}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{'Create Classroom'}</DialogTitle>
				<DialogContent>
					{/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
					<TextField
						id='classroom-name'
						label='Classroom Name'
						variant='standard'
						onChange={(event) => setNewClassroomName(event.target.value)}
						value={newClassroomName}
					/>
				</DialogContent>
				{actionButtons}
			</Dialog>
		</Grid>
		// <ClassroomModalContent
		// 	type='create'
		// 	openButton={openButton}
		// 	open={open}
		// 	handleClose={handleClose}
		// 	setNew={setNewClassroomName}
		// 	newClass={newClassroomName}
		// 	actionButtons={actionButtons}
		// />
	)
}
