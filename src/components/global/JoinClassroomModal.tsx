import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { useState } from 'react'
import Grid from '@mui/material/Grid'
import { joinClassroom } from '../../utils/mutations'
import { User } from 'firebase/auth'
import { useSnackbar } from 'notistack'
// import ClassroomModalContent from './ClassroomModalContent'

export default function JoinClassroomModal({ user }: { user: User }) {
	const { enqueueSnackbar } = useSnackbar()

	const [open, setOpen] = useState(false)
	const [signupCode, setSignupCode] = React.useState('')

	const handleClickOpen = () => {
		setOpen(true)
		setSignupCode('')
	}

	const handleClose = () => {
		setOpen(false)
	}

	// Mutation handlers

	const handleJoinClassroom = () => {
		if (!signupCode) {
			enqueueSnackbar('Please enter a code.', { variant: 'error' })
			return
		}

		joinClassroom(signupCode, user)
			.then((value) => {
				enqueueSnackbar(value, { variant: 'success' })
				setSignupCode('')
				handleClose()
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar(err.message, { variant: 'error' })
			})
	}

	return (
		<Grid item xs={12}>
			<Button variant='contained' onClick={handleClickOpen}>
				Join!
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{'Join Classroom'}</DialogTitle>
				<DialogContent>
					{/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
					<TextField
						id='classroom-name'
						label='Classroom ID'
						variant='standard'
						onChange={(event) => setSignupCode(event.target.value)}
						value={signupCode}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button variant='contained' onClick={handleJoinClassroom}>
						Join
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	)
}
