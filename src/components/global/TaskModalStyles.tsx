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

const OverviewBox = styled(Box)({
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
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
}

export function OverviewTitle(props: Props) {
	return (
		<div>
			<OverviewBox>
				<Typography fontWeight='light' variant='h5'>
					Overview
				</Typography>
				<IconButton onClick={props.onClick}>
					<CloseIcon />
				</IconButton>
				<TaskHr />
			</OverviewBox>
		</div>
	)
}
