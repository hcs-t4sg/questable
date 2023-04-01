// ! DEPRECATED
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import { useState } from 'react'
import { Classroom, Player, RepeatableWithPlayerData } from '../../types'
import { completeRepeatable } from '../../utils/mutations'
import { useSnackbar } from 'notistack'

export default function RepeatableModalStudent({
	classroom,
	player,
	repeatable,
}: {
	classroom: Classroom
	player: Player
	repeatable: RepeatableWithPlayerData
}) {
	const { enqueueSnackbar } = useSnackbar()

	// State variables
	const [open, setOpen] = useState(false)

	// Open the task modal
	const handleClickOpen = () => {
		setOpen(true)
	}
	// Close the task modal
	const handleClose = () => {
		setOpen(false)
	}

	// Handle task completion
	const handleComplete = () => {
		// Call the `completeTask` mutation
		if (window.confirm('Are you sure you want to add a completion for this repeatable?')) {
			completeRepeatable(classroom.id, repeatable.id, player.id)
				.then(() => {
					enqueueSnackbar(`Repeatable completion added for "${repeatable.name}"!`, {
						variant: 'success',
					})
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar(err.message, {
						variant: 'error',
					})
				})
			handleClose()
		}
	}

	const Cluster = ({ title, data }: { title: string; data: string | number | JSX.Element }) => (
		<>
			<Typography sx={{ marginTop: '25px' }} fontWeight='medium' variant='h6'>
				{title}
			</Typography>
			<Typography fontWeight='light' variant='h6'>
				{data}
			</Typography>
		</>
	)

	const openButton = (
		<IconButton onClick={handleClickOpen}>
			<OpenInNewIcon />
		</IconButton>
	)

	return (
		<Box>
			{openButton}
			<Modal sx={{ overflow: 'scroll' }} open={open} onClose={handleClose}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '70%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '35px',
						paddingTop: '25px',
						backgroundColor: 'white',
						marginBottom: '18px',
					}}
				>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography fontWeight='light' variant='h5'>
							Repeatable Overview
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
						}}
					/>

					<Box
						sx={{
							width: '100%',
							flexDirection: 'column',
							display: 'flex',
							justifyContent: 'left',
						}}
					>
						<Cluster title='Task Name' data={repeatable.name} />
						<Cluster title='Description' data={repeatable.description} />
						<Cluster title='Reward Amount' data={`${repeatable.reward}g`} />
						<Cluster title='Completions' data={repeatable.completions} />
						<Cluster
							title='Completion'
							data={
								<Button onClick={handleComplete} variant='contained'>
									Mark as complete
								</Button>
							}
						/>
					</Box>
				</Box>
			</Modal>
		</Box>
	)
}
