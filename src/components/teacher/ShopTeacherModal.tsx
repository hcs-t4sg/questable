import { useState } from 'react'
import { Classroom } from '../../types'
import { useSnackbar } from 'notistack'
import { Button, DialogActions, Grid, MenuItem, Select, TextField } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { ModalTitle, TaskModalBox, TeacherModalStyled } from '../../styles/TaskModalStyles'
import { addReward } from '../../utils/mutations'

export default function ShopTeacherModal({ classroom }: { classroom: Classroom }) {
	const { enqueueSnackbar } = useSnackbar()
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [price, setPrice] = useState(0)
	const [description, setDescription] = useState('')
	const [isActive, setIsActive] = useState(false)
	// const [icon, setIcon] = useState(null)

	const handleOpen = () => {
		setOpen(true)
		setName('')
		setDescription('')
		setPrice(100)
		setIsActive(true)
		// setIcon(null)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleAdd = () => {
		if (name === '') {
			enqueueSnackbar('You need to provide a name for the reward', { variant: 'error' })
			return
		}

		const newReward = {
			name,
			description,
			price,
			isActive,
			// icon,
		}
		addReward(classroom.id, newReward)

		handleClose()
	}

	const openButton = (
		<Button
			variant='contained'
			sx={{ width: 1 }}
			onClick={handleOpen}
			startIcon={<AddCircleOutlineIcon />}
		>
			Create Custom Reward
		</Button>
	)
	const actionButtons = (
		<DialogActions>
			<Button variant='contained' onClick={handleAdd}>
				Add Reward
			</Button>
		</DialogActions>
	)
	return (
		<div>
			{openButton}
			<TeacherModalStyled open={open} onClose={handleClose}>
				<TaskModalBox>
					<ModalTitle onClick={handleClose} text='Create Reward' />
					<TextField
						margin='normal'
						id='name'
						label='Reward Name'
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
						multiline
						maxRows={8}
						value={description}
						onChange={(event) => setDescription(event.target.value)}
					/>
					<TextField
						margin='normal'
						id='price'
						label='Price'
						fullWidth
						variant='standard'
						value={price}
						onChange={(event) => setDescription(event.target.value)}
					/>
					<Select
						sx={{ m: 1, minWidth: 180 }}
						size='small'
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={price}
						label='Price'
						onChange={(event) => setPrice(event.target.value as number)}
					>
						<MenuItem value={50}>50</MenuItem>
						<MenuItem value={100}>100</MenuItem>
						<MenuItem value={150}>150</MenuItem>
						<MenuItem value={200}>200</MenuItem>
					</Select>
					<Grid container justifyContent='center'>
						{actionButtons}
					</Grid>
				</TaskModalBox>
			</TeacherModalStyled>
		</div>
	)
}
