import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogTitle, Stack, DialogContent } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

import { styled } from '@mui/material/styles'

// Styled components used in modals across the app

// These styled components don't have any custom styling applied at the moment but could be styled in the future
export const TeacherModalStyled = styled(Dialog)({})
export const TaskModalContent = styled(DialogContent)({})
export const StudentTaskModalBox = styled(DialogContent)({})

export const BoxInModal = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginTop: theme.spacing(2),
	marginBottom: theme.spacing(2),
}))

export const LeftBoxInModal = styled(Box)({
	width: '100%',
	flexDirection: 'column',
	display: 'flex',
	justifyContent: 'left',
})

interface Props {
	onClick: () => void
	text: string
}

// * Not used at the moment
// export const TaskModalBox = styled(Box)({
// 	width: '40%',
// 	display: 'flex',
// 	flexDirection: 'column',
// 	alignItems: 'center',
// 	justifyContent: 'center',
// 	padding: '40px',
// 	paddingTop: '40px',
// 	backgroundColor: 'white',
// 	marginBottom: '18px',
// })

// TODO eventually - composition??
/* Similarities between TaskModalTeacher and CreateAssignmentModal:
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
