// import CloseIcon from '@mui/icons-material/Close'
import { Box, FormControl, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material'
// import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
// import Typography from '@mui/material/Typography'
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
import { updateReward } from '../../utils/mutations'

export default function ShopeTeacherEditModal({
	item,
	classroom,
}: {
	item: CustomShopItems
	classroom: Classroom
}) {
	const { enqueueSnackbar } = useSnackbar()
	// State variables
	const [open, setOpen] = useState(false)
	const [name, setName] = useState(item.name)
	const [price, setPrice] = useState(item.price)
	const [description, setDescription] = useState(item.description)
	const [isActive, setIsActive] = useState(item.isActive)

	// Open the task modal
	const handleClickOpen = () => {
		setOpen(true)
		setName(item.name)
		setPrice(item.price)
		setIsActive(item.isActive)
		setDescription(item.description)
	}
	// Close the task modal
	const handleClose = () => {
		setOpen(false)
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsActive(event.target.checked)
	}

	// Handle the click of an edit button
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
		// Call the `updateReward` mutation
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

	const openButton = (
		<IconButton onClick={handleClickOpen}>
			<EditIcon />
		</IconButton>
	)

	const saveButton = (
		<Button variant='contained' type='submit'>
			Save Changes
		</Button>
	)

	return (
		<div>
			{openButton}
			<TeacherModalStyled
				// sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				open={open}
				onClose={handleClose}
			>
				{/* <Box
					sx={{
						width: '40%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '40px',
						paddingTop: '40px',
						backgroundColor: 'white',
						marginBottom: '18px',
					}}
				> */}
				{/* <Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography fontWeight='light' variant='h5'>
							Overview
						</Typography>
						<IconButton onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Box>
					<hr
						style={{
							backgroundColor: '#D9D9D9',
							height: '1px',
							borderWidth: '0px',
							borderRadius: '5px',
							width: '100%',
							marginBottom: '10px',
						}}
					/> */}
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
						{/* <Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							m: 2,
						}}
					> */}
						{/* <Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							m: 2,
						}}
					> */}
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
							{/* </Box> */}
						</BoxInModal>
						<BoxInModal>
							<Typography variant='body1'>
								{' '}
								Reward Display: Inactive
								<Switch checked={isActive} onChange={handleChange} />
								Active{' '}
							</Typography>
						</BoxInModal>
						<br />
						{/* center the save button */}
						<Grid container justifyContent='center'>
							{saveButton}
						</Grid>
					</Box>
				</TaskModalContent>
				{/* </Box> */}
			</TeacherModalStyled>
		</div>
	)
}
