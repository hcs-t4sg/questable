import {
	Box,
	Button,
	DialogActions,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import { addForumPost } from '../../utils/mutations/forum'
import { TeacherModalStyled, ModalTitle, TaskModalContent } from '../../styles/ModalStyles'
import { useSnackbar } from 'notistack'
import modules from '../../utils/TextEditor'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Modal for creating a forum post

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

	const [subject, setSubject] = useState('')
	const [category, setCategory] = useState<0 | 1 | 2 | 3>(0)
	const [description, setDescription] = useState('')
	const [anonymous, setAnonymous] = useState(false)

	const handleClear = () => {
		setSubject('')
		setCategory(0)
		setDescription('')
		setAnonymous(false)
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
			anonymous: anonymous,
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

	return (
		<TeacherModalStyled open={isOpen} onClose={handleClose}>
			<ModalTitle onClick={handleClose} text='New Thread' />
			<Box
				onSubmit={(e) => {
					handleSubmit()
					e.preventDefault()
				}}
				component='form'
			>
				<TaskModalContent>
					<TextField
						margin='normal'
						id='subject'
						label='Subject'
						fullWidth
						variant='standard'
						value={subject}
						onChange={(event) => setSubject(event.target.value)}
					/>

					<ReactQuill
						placeholder='Description'
						theme='snow'
						modules={modules}
						onChange={setDescription}
					/>

					<FormControl fullWidth sx={{ marginTop: 2 }}>
						<InputLabel id='category-label'>Category</InputLabel>
						<Select
							labelId='category-label'
							id='category'
							label='Category'
							fullWidth
							value={category}
							onChange={(event) => setCategory(event.target.value as 0 | 1 | 2 | 3)}
						>
							<MenuItem value={0}>General</MenuItem>
							<MenuItem value={1}>Assignments</MenuItem>
							<MenuItem value={2}>For Fun</MenuItem>
							<MenuItem value={3}>Announcements</MenuItem>
						</Select>
					</FormControl>

					{player.role == 'student' && (
						<FormGroup>
							<FormControlLabel
								sx={{ mt: 1 }}
								control={
									<Checkbox
										color='success'
										checked={anonymous}
										onChange={() => setAnonymous(!anonymous)}
									/>
								}
								label='Anonymous'
							/>
						</FormGroup>
					)}
				</TaskModalContent>
				<DialogActions sx={{ justifyContent: 'center' }}>
					<Button variant='contained' color='success' type='submit'>
						Submit
					</Button>
				</DialogActions>
			</Box>
		</TeacherModalStyled>
	)
}
