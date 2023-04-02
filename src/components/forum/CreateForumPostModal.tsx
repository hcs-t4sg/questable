import {
	// Box,
	Button,
	DialogActions,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material'
// import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import { addForumPost } from '../../utils/mutations'
import { TaskModalBox, TeacherModalStyled } from '../../styles/TaskModalStyles'
import { useSnackbar } from 'notistack'
// Notes: onsnapshot, don't implement at database level; implement on frontend, show only ones you filtered for
// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened.
   This can be "add" (for adding a new entry) or
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function CreateForumPostModal({
	isOpen,
	onClose,
	player,
	classroom,
}: {
	isOpen: boolean
	onClose: () => void
	player: Player
	classroom: Classroom
}) {
	const { enqueueSnackbar } = useSnackbar()

	// State variables for modal status

	const [subject, setSubject] = useState('')
	const [category, setCategory] = useState<0 | 1 | 2 | 3>(0)
	const [description, setDescription] = useState('')

	// Modal visibility handlers

	const handleClear = () => {
		setSubject('')
		setCategory(0)
		setDescription('')
	}

	const handleClose = () => {
		handleClear()
		onClose()
	}

	const handleSubmit = () => {
		const subjectContainsNonWhitespaceChars = subject.replace(/\s+/g, '') != ''
		if (!subjectContainsNonWhitespaceChars) {
			enqueueSnackbar('Title cannot be empty', { variant: 'error' })
			return
		}

		const descriptionContainsNonWhitespaceChars = description.replace(/\s+/g, '') != ''
		if (!descriptionContainsNonWhitespaceChars) {
			enqueueSnackbar('Description cannot be empty', { variant: 'error' })
			return
		}

		const newThread = {
			title: subject,
			postType: category,
			content: description,
			author: player,
		}

		handleClose()
		addForumPost(newThread, classroom)
			.then(() => {
				enqueueSnackbar(`Created post "${subject}"!`, {
					variant: 'success',
				})
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar('There was an error creating the post.', {
					variant: 'error',
				})
			})
	}

	const submitButton = (
		<DialogActions>
			<Button variant='text' onClick={handleClose}>
				Cancel
			</Button>
			<Button variant='contained' color='success' onClick={handleSubmit}>
				Submit
			</Button>
		</DialogActions>
	)
	return (
		<div>
			{/* <Dialog open={isOpen}> */}
			<TeacherModalStyled open={isOpen}>
				<TaskModalBox>
					<DialogTitle>New Thread</DialogTitle>
					<DialogContent>
						{/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
						<TextField
							margin='normal'
							id='subject'
							label='Subject'
							fullWidth
							variant='standard'
							value={subject}
							onChange={(event) => setSubject(event.target.value)}
						/>
						<TextField
							margin='normal'
							id='description'
							label='Description'
							fullWidth
							variant='standard'
							multiline
							maxRows={8}
							value={description}
							onChange={(event) => setDescription(event.target.value)}
						/>
						<FormControl fullWidth sx={{ marginTop: 2 }}>
							<InputLabel id='category-label'>Category</InputLabel>
							<Select
								// margin='normal'
								labelId='category-label'
								id='category'
								label='Category'
								fullWidth
								// variant='standard'
								value={category}
								onChange={(event) => setCategory(event.target.value as 0 | 1 | 2 | 3)}
							>
								<MenuItem value={0}>General</MenuItem>
								<MenuItem value={1}>Assignments</MenuItem>
								<MenuItem value={2}>For Fun</MenuItem>
								<MenuItem value={3}>Announcements</MenuItem>
							</Select>
						</FormControl>
					</DialogContent>
					{submitButton}
				</TaskModalBox>
				{/* </Dialog> */}
			</TeacherModalStyled>
		</div>
	)
}
