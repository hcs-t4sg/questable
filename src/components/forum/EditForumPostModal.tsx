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
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { Classroom, Player, ForumPost } from '../../types'
import { updateForumPost } from '../../utils/mutations'
import { TaskModalBox, TeacherModalStyled, ModalTitle } from '../../styles/TaskModalStyles'
import { useSnackbar } from 'notistack'
import modules from '../../utils/TextEditor'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// Notes: onsnapshot, don't implement at database level; implement on frontend, show only ones you filtered for
// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened.
   This can be "add" (for adding a new entry) or
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function EditForumPostModal({
	isOpen,
	onClose,
	player,
	classroom,
	forumPost,
}: {
	isOpen: boolean
	onClose: () => void
	player: Player
	classroom: Classroom
	forumPost: ForumPost
}) {
	const { enqueueSnackbar } = useSnackbar()

	// State variables for modal status

	const [subject, setSubject] = useState(forumPost.title)
	const [category, setCategory] = useState<0 | 1 | 2 | 3>(forumPost.postType)
	const [description, setDescription] = useState(forumPost.content)
	const [isDisabled, setIsDisabled] = useState(true)

	// Modal visibility handlers

	const handleClear = () => {
		setIsDisabled(true)
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

		const updatedThread = {
			title: subject,
			postType: category,
			content: description,
			author: player,
		}

		handleClose()
		updateForumPost(updatedThread, classroom.id, forumPost.id)
			.then(() => {
				enqueueSnackbar(`Edited post "${subject}"!`, {
					variant: 'success',
				})
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar('There was an error when editing the post.', {
					variant: 'error',
				})
			})
	}

	const submitButton = (
		<DialogActions sx={{ justifyContent: 'center' }}>
			{/* <Button variant='text' onClick={handleClose}>
				Cancel
			</Button> */}

			{isDisabled ? (
				<Button
					variant='contained'
					color='success'
					onClick={(event) => {
						setIsDisabled(false)
						event.preventDefault()
					}}
				>
					Edit
				</Button>
			) : (
				<Button variant='contained' color='success' type='submit'>
					Submit
				</Button>
			)}
		</DialogActions>
	)
	return (
		<div>
			{/* <Dialog open={isOpen}> */}
			<TeacherModalStyled open={isOpen} onClose={handleClose}>
				<TaskModalBox>
					<ModalTitle onClick={handleClose} text='Edit Thread' />
					<form
						onSubmit={(e) => {
							handleSubmit()
							e.preventDefault()
						}}
					>
						<DialogContent>
							{/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
							<TextField
								margin='normal'
								id='subject'
								label='Subject'
								fullWidth
								variant='standard'
								defaultValue={forumPost.title}
								InputProps={{ readOnly: isDisabled }}
								onChange={(event) => setSubject(event.target.value)}
							/>
							<ReactQuill
								theme='snow'
								onChange={setDescription}
								value={description}
								modules={modules}
								readOnly={isDisabled}
							/>
							{/* <TextField
							margin='normal'
							id='description'
							label='Description'
							fullWidth
							variant='standard'
							multiline
							maxRows={8}
							defaultValue={forumPost.content}
							InputProps={{ readOnly: isDisabled }}
							onChange={(event) => setDescription(event.target.value)}
						/> */}
							<FormControl fullWidth sx={{ marginTop: 2 }}>
								<InputLabel id='category-label'>Category</InputLabel>
								<Select
									// margin='normal'
									labelId='category-label'
									id='category'
									label='Category'
									fullWidth
									// variant='standard'
									defaultValue={forumPost.postType}
									disabled={isDisabled}
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
					</form>
				</TaskModalBox>
				{/* </Dialog> */}
			</TeacherModalStyled>
		</div>
	)
}
