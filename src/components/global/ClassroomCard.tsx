import { Divider } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { User } from 'firebase/auth'
import { useSnackbar } from 'notistack'
import { Link } from 'react-router-dom'
import { Classroom } from '../../types'
import { addPin, deletePin } from '../../utils/mutations'

export default function ClassroomCard({
	classroom,
	user,
	pinned,
}: {
	classroom: Classroom
	user: User
	pinned: boolean
}) {
	const { enqueueSnackbar } = useSnackbar()

	const handleCopyCode = () => {
		const copyTextToClipboard = async (text: string) => {
			if ('clipboard' in navigator) {
				await navigator.clipboard.writeText(text)
			} else {
				return document.execCommand('copy', true, text)
			}
		}

		copyTextToClipboard(classroom.id)
			.then(() => {
				// If successful
				enqueueSnackbar('Copied join code to clipboard!', {
					variant: 'success',
				})
			})
			.catch((err) => {
				console.log(err)
				enqueueSnackbar('There was an error copying.', {
					variant: 'error',
				})
			})
	}

	return (
		<Card>
			<CardActionArea component={Link} to={`/class/${classroom.id}`}>
				<CardContent>
					<Typography variant='h5' component='div'>
						{classroom.name}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				{pinned && (
					<Button variant='text' size='small' onClick={() => deletePin(user.uid, classroom.id)}>
						Unpin Classroom
					</Button>
				)}
				{!pinned && (
					<Button variant='text' size='small' onClick={() => addPin(user.uid, classroom.id)}>
						Pin Classroom
					</Button>
				)}
				<Divider
					orientation='vertical'
					flexItem
					sx={{
						margin: '0px 5px 0px 5px',
					}}
				/>
				<Button variant='text' size='small' sx={{ marginLeft: '0px' }} onClick={handleCopyCode}>
					Copy join code
				</Button>
			</CardActions>
		</Card>
	)
}
