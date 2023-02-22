import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

import { styled } from '@mui/system'

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

export const BoxInModal = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	margin: theme.spacing(2),
}))

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
