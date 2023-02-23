import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { User } from 'firebase/auth'
import { useState } from 'react'
import { Classroom, Player } from '../../types'
import { updatePlayer } from '../../utils/mutations'

export default function PlayerModal({
	player,
	user,
	classroom,
}: {
	player: Player
	user: User
	classroom: Classroom
}) {
	const [open, setOpen] = useState(false)

	const [name, setName] = useState(player.name)
	const [money, setMoney] = useState(player.money)
	const [role, setRole] = useState(player.role)

	const handleEdit = () => {
		const newPlayer = {
			name: name,
		}

		updatePlayer(user.uid, classroom.id, newPlayer).catch(console.error)
		handleClose()
	}

	const handleClickOpen = () => {
		setOpen(true)
		setName(name)
		setMoney(money)
		setRole(role)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const openButton = (
		<IconButton onClick={handleClickOpen}>
			Edit Profile
			<OpenInNewIcon />
		</IconButton>
	)

	return (
		<div>
			{openButton}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Edit Profile</DialogTitle>
				<DialogContent>
					<TextField
						margin='normal'
						id='name'
						label='Player Name'
						fullWidth
						variant='standard'
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>

					<TextField
						margin='normal'
						id='email'
						label='Email'
						fullWidth
						variant='standard'
						value={user.email}
						disabled={true}
					/>

					<TextField
						margin='normal'
						id='money'
						label='Money'
						fullWidth
						variant='standard'
						value={player.money}
						disabled={true}
					/>

					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button variant='contained' onClick={() => handleEdit()}>
							Edit
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</div>
	)
}
