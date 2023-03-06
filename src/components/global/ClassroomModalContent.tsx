import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import Grid from '@mui/material/Grid'

interface Props {
	type: 'create' | 'join'
	openButton: JSX.Element
	open: boolean
	handleClose: () => void
	setNew: (_newClass: string) => void
	newClass: string
	actionButtons: JSX.Element
}

export default function ClassroomModalContent(props: Props) {
	return (
		<Grid item xs={12}>
			{props.openButton}
			<Dialog open={props.open} onClose={props.handleClose}>
				<DialogTitle>{props.type === 'create' ? 'Create Classroom' : 'Join Classroom'}</DialogTitle>
				<DialogContent>
					<TextField
						id='classroom'
						label={props.type === 'create' ? 'Classroom Name' : 'Classroom ID'}
						variant='standard'
						onChange={(event) => props.setNew(event.target.value)}
						value={props.newClass}
					/>
				</DialogContent>
				{props.actionButtons}
			</Dialog>
		</Grid>
	)
}
