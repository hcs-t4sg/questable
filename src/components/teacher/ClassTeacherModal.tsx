// import OpenInNewIcon from '@mui/icons-material/OpenInNew'
// import IconButton from '@mui/material/IconButton'

// import Box from '@mui/material/Box'
// import Dialog from '@mui/material/Dialog'
// import DialogContent from '@mui/material/DialogContent'
// import DialogTitle from '@mui/material/DialogTitle'
// import Grid from '@mui/material/Grid'
// import { useState } from 'react'
// import { Player } from '../../types'

// export default function ClassTeacherModal({ student }: { student: Player }) {
// const [confirmedTasks, setConfirmedTasks] = React.useState([]);

// React.useEffect(() => {
//   // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
//   const taskRef = collection(db, `classrooms/${classroom.id}/tasks`);

//   //Attach a listener to the confirmed tasks document
//   onSnapshot(taskRef, (snapshot) => {
//     const mapTasks = async () => {
//       let tasks = await Promise.all(
//         snapshot.docs.map(async (doc) => {
//           console.log("Current data: ", doc.data());
//         })
//       );
//     };
//     // Call the async `mapTeacher` function
//     mapTasks().catch(console.error);
//   });
// }, []);

// 	const [open, setOpen] = useState(false)

// 	const handleClickOpen = () => {
// 		setOpen(true)
// 	}

// 	const handleClose = () => {
// 		setOpen(false)
// 	}

// 	const openButton = (
// 		<IconButton onClick={handleClickOpen}>
// 			<OpenInNewIcon />
// 		</IconButton>
// 	)

// 	return (
// 		<Grid item xs={6}>
// 			{openButton}
// 			<Dialog open={open} onClose={handleClose}>
// 				<DialogTitle>{student.name}</DialogTitle>
// 				<Box
// 					component='img'
// 					sx={{
// 						height: 50,
// 						width: 50,
// 					}}
// 					alt={`Avatar ${student.avaBody}`}
// 					src={`../../static/${student.avaBody}.png`}
// 				/>
// 				<DialogContent></DialogContent>
// 			</Dialog>
// 		</Grid>
// 	)
// }

import { PlayerWithEmail, Classroom } from '../../types'
import { useState } from 'react'
import { ClassStudentContent } from '../../routes/student/ClassStudentContent'
import { updateMoney, updatePlayer } from '../../utils/mutations'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Cluster } from '../student/AssignmentContentStudent'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { levelUp } from '../../utils/helperFunctions'
import { useSnackbar } from 'notistack'

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
		const newMoney = {
			money: money,
		}

		updateMoney(player.id, classroom.id, newMoney).catch(console.error)

		const newPlayer = {
			name: name,
		}

		updatePlayer(player.id, classroom.id, newPlayer).catch(console.error)
		handleClose()
		enqueueSnackbar(`Updated player "${player.name}"!`)
	}

	const [openEdit, setOpenEdit] = useState(false)

	const handleClickOpen = () => {
		setOpenEdit(true)
		setName(name)
		setMoney(money)
	}

	const handleClose = () => {
		setOpenEdit(false)
	}

	return (
		<ClassStudentContent player={player} isOpen={open} toggleIsOpen={toggleOpen}>
			<ClassStudentContent player={player} isOpen={open} toggleIsOpen={toggleOpen}>
				<Cluster title='Student Name' data={player.name} isHtml={false} />
				<Cluster title='Student Email' data={player.email} isHtml={false} />
				<Cluster title='Student Gold' data={`${player.money}g`} isHtml={false} />
				<Cluster title='Student Level' data={levelUp(player.xp)} isHtml={false} />
				<Button onClick={handleClickOpen} endIcon={<OpenInNewIcon />}>
					Edit Profile
				</Button>
			</ClassStudentContent>

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
		</ClassStudentContent>
	)
}
