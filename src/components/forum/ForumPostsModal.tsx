import { Button, DialogActions, InputLabel, MenuItem, Select } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// import FormControl from '@mui/material/FormControl'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import { addThread } from '../../utils/mutations'
// Notes: onsnapshot, don't implement at database level; implement on frontend, show only ones you filtered for
// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened.
   This can be "add" (for adding a new entry) or
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function ForumPostsModal({
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
	// State variables for modal status

	// TODO: For editing, you may have to add and manage another state variable to check if the entry is being edited.

	const [subject, setSubject] = useState('')
	const [category, setCategory] = useState(-1)
	const [description, setDescription] = useState('')

	// Modal visibility handlers

	const handleSubject = (event: any) => {
		setSubject(event.target.value)
	}
	const handleCategory = (event: any) => {
		setCategory(event.target.value)
	}
	const handleDescription = (event: any) => {
		setDescription(event.target.value)
	}

	const handleClear = () => {
		setSubject('')
		setCategory(-1)
		setDescription('')
	}

	const handleClose = () => {
		handleClear()
		onClose()
	}

	const handleSubmit = () => {
		const newThread = {
			title: subject,
			postType: category,
			content: description,
			author: player,
			postTime: new Date().toJSON(),
		}

		addThread(newThread, classroom).catch(console.error)
		handleClose()
	}

	const submitButton = (
		<DialogActions>
			<Button onClick={handleClose}>Cancel</Button>
			<Button variant='contained' onClick={handleSubmit}>
				Submit
			</Button>
		</DialogActions>
	)
	return (
		<div>
			<Dialog open={isOpen}>
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
						onChange={handleSubject}
					/>
					<InputLabel id='category'>Category</InputLabel>
					<Select
						// margin='normal'
						labelId='category'
						label='Category'
						fullWidth
						// variant='standard'
						value={category}
						onChange={handleCategory}
					>
						<MenuItem value={1}>General</MenuItem>
						<MenuItem value={2}>Assignments</MenuItem>
						<MenuItem value={3}>For Fun</MenuItem>
						<MenuItem value={4}>Starred</MenuItem>
					</Select>
					<TextField
						margin='normal'
						id='description'
						label='Description'
						fullWidth
						variant='standard'
						multiline
						maxRows={8}
						value={description}
						onChange={handleDescription}
					/>
				</DialogContent>
				{submitButton}
			</Dialog>
		</div>
	)
}
