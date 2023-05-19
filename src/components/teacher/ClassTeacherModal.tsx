import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Classroom, PlayerWithEmail } from '../../types'
import { levelUp } from '../../utils/helperFunctions'
import { updatePlayer } from '../../utils/mutations/users'
import { PlayerInfoModalWrapper } from '../global/PlayerInfoModalWrapper'
import { Cluster } from '../student/AssignmentContentStudent'

export default function ClassTeacherModal({
	player,
	classroom,
}: {
	player: PlayerWithEmail
	classroom: Classroom
}) {
	const { enqueueSnackbar } = useSnackbar()

	const [open, setOpen] = useState(false)

	const toggleOpen = () => {
		setOpen(!open)
		setOpenEdit(false)
	}

	const [money, setMoney] = useState(player.money)
	const [name, setName] = useState(player.name)

	const handleEdit = () => {
		const newPlayerData = {
			name: name,
			money: money,
		}

		updatePlayer(player.id, classroom.id, newPlayerData).catch(console.error)
		handleClose()
		enqueueSnackbar(`Updated player "${player.name}"!`)
	}

	const [openEdit, setOpenEdit] = useState(false)

	const handleClickOpen = () => {
		setOpenEdit(true)
		setName(player.name)
		setMoney(player.money)
	}

	const handleClose = () => {
		setOpenEdit(false)
		setName(player.name)
		setMoney(player.money)
	}

	return (
		<PlayerInfoModalWrapper player={player} isOpen={open} toggleIsOpen={toggleOpen}>
			<Cluster title='Player Name' data={player.name} isHtml={false} />
			<Cluster title='Student Email' data={player.email} isHtml={false} />
			<Cluster title='Student Gold' data={`${player.money}g`} isHtml={false} />
			<Cluster title='Student Level' data={levelUp(player.xp)} isHtml={false} />
			<Button onClick={handleClickOpen} endIcon={<OpenInNewIcon />}>
				Edit Profile
			</Button>

			{/* this should display actual name like student modal but I have an error in displayName
			that Im looking at rn */}
			{/* <Cluster title='Student Email' data={player.email} /> */}
			<Dialog open={openEdit} onClose={handleClose}>
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
						type='number'
						margin='normal'
						id='money'
						label='Player Money'
						fullWidth
						variant='standard'
						value={money}
						onChange={(event) => setMoney(parseInt(event.target.value))}
					/>
					<DialogActions>
						{/* TODO make this a form so that it submits on enter */}
						<Button onClick={handleClose}>Cancel</Button>
						<Button variant='contained' onClick={() => handleEdit()}>
							Edit
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</PlayerInfoModalWrapper>
	)
}
