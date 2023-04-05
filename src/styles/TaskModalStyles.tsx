import CloseIcon from '@mui/icons-material/Close'
import { Modal } from '@mui/material'
import IconButton from '@mui/material/IconButton'
// import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Box from '@mui/material/Box'
// import Grid from '@mui/material/Grid'

import { styled } from '@mui/material/styles'

export const TeacherModalStyled = styled(Modal)({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
})

export const TaskModalBox = styled(Box)({
	width: '40%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '40px',
	paddingTop: '40px',
	backgroundColor: 'white',
	marginBottom: '18px',
})

export const StudentTaskModalBox = styled(Box)({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '35px',
	paddingTop: '25px',
	backgroundColor: 'white',
	marginBottom: '18px',
})

export const BoxInModal = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	margin: theme.spacing(2),
}))

export const StudentBoxInModal = styled(Box)({
	width: '100%',
	flexDirection: 'column',
	display: 'flex',
	justifyContent: 'left',
})

const TaskHr = styled('hr')({
	backgroundColor: '#D9D9D9',
	height: '1px',
	borderWidth: '0px',
	borderRadius: '5px',
	width: '100%',
	marginBottom: '10px',
})

interface Props {
	onClick: () => void
	text: string
}

// eventually - composition??
/* Similarities between TaskModalTeacher and CreateTaskModal:
	- same state variables
	- same styled components (in this document)
	- modal part is same
	..
	BUT:
	- props slightly different
	- TaskModalStudent slightly different - uses Clusters

*/

export function ModalTitle(props: Props) {
	return (
		<>
			<BoxInModal>
				<Typography fontWeight='light' variant='h5'>
					{props.text}
				</Typography>
				<IconButton onClick={props.onClick}>
					<CloseIcon />
				</IconButton>
			</BoxInModal>
			<TaskHr />
		</>
	)
}
