import { Box, FormControl, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import EditIcon from '@mui/icons-material/Edit'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import {
	BoxInModal,
	ModalTitle,
	TaskModalContent,
	TeacherModalStyled,
} from '../../styles/TaskModalStyles'
import { Classroom, CustomShopItems } from '../../types'
import { updateReward } from '../../utils/mutations/shop'

export default function ShopeTeacherEditModal({
	item,
	classroom,
}: {
	item: CustomShopItems
	classroom: Classroom
}) {
	const { enqueueSnackbar } = useSnackbar()

	const [open, setOpen] = useState(false)
	const [name, setName] = useState(item.name)
	const [price, setPrice] = useState(item.price)
	const [description, setDescription] = useState(item.description)
	const [isActive, setIsActive] = useState(item.isActive)

	const handleClickOpen = () => {
		setOpen(true)
		setName(item.name)
		setPrice(item.price)
		setIsActive(item.isActive)
		setDescription(item.description)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsActive(event.target.checked)
	}

	const handleEdit = () => {
		if (name === '') {
			enqueueSnackbar('You need to provide a name for the task', { variant: 'error' })
			return
		}

		const updatedReward = {
			name: name,
			description: description,
			price: price,
			isActive: isActive,
			id: item.id,
		}

		updateReward(classroom.id, updatedReward)
			.then(() => {
				handleClose()
				enqueueSnackbar('Edited reward!', { variant: 'success' })
			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar('There was an issue editing the reward', { variant: 'error' })
			})
	}

	return (
		<>
			<IconButton onClick={handleClickOpen}>
				<EditIcon />
			</IconButton>
			<TeacherModalStyled open={open} onClose={handleClose}>
				<ModalTitle onClick={handleClose} text='Overview' />
				<TaskModalContent>
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
						<BoxInModal>
							<FormControl fullWidth>
								<InputLabel id='reward-dropdown-label'>Price</InputLabel>
								<Select
									labelId='reward-dropdown'
									id='reward-dropdown'
									value={price}
									label='Price'
									onChange={(event) => setPrice(event.target.value as number)}
								>
									<MenuItem value={50}>50g</MenuItem>
									<MenuItem value={100}>100g</MenuItem>
									<MenuItem value={150}>150g</MenuItem>
									<MenuItem value={200}>200g</MenuItem>
								</Select>
							</FormControl>
						</BoxInModal>
						<BoxInModal>
							<Typography variant='body1'>
								Reward Display: Inactive
								<Switch checked={isActive} onChange={handleChange} />
								Active
							</Typography>
						</BoxInModal>
						<br />
						<Grid container justifyContent='center'>
							<Button variant='contained' type='submit'>
								Save Changes
							</Button>
						</Grid>
					</Box>
				</TaskModalContent>
			</TeacherModalStyled>
		</>
	)
}
