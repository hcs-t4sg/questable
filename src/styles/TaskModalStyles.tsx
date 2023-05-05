import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogTitle, Stack, DialogContent } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

import { styled } from '@mui/material/styles'

export const TeacherModalStyled = styled(Dialog)({})

export const TaskModalContent = styled(DialogContent)({})

export const StudentTaskModalBox = styled(DialogContent)({})

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
		<Stack sx={{ justifyContent: 'space-between', mr: 2 }} direction='row'>
			<DialogTitle>{props.text} </DialogTitle>
			<IconButton onClick={props.onClick} sx={{ borderRadius: '50%', height: '50%', mt: 1 }}>
				<CloseIcon />
			</IconButton>
		</Stack>
	)
}
