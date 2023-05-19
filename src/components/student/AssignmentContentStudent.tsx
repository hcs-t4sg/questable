import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Grid, IconButton, Dialog, Typography } from '@mui/material'
import { ModalTitle, StudentBoxInModal, StudentTaskModalBox } from '../../styles/TaskModalStyles'
import { Assignment } from '../../types'
import blue3 from '/src/assets/spriteSheets/potions/blue3.png'
import green3 from '/src/assets/spriteSheets/potions/green3.png'
import purple3 from '/src/assets/spriteSheets/potions/purple3.png'
import red3 from '/src/assets/spriteSheets/potions/red3.png'

import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify(window)

export function rewardPotion(rewardAmount: number) {
	const rewardMatch =
		rewardAmount === 10
			? blue3
			: rewardAmount === 20
			? green3
			: rewardAmount === 30
			? purple3
			: rewardAmount === 40
			? red3
			: ''

	return (
		<Box
			component='img'
			sx={{
				imageRendering: 'pixelated',
				maxHeight: { xs: 140, md: 200 },
				maxWidth: { xs: 140, md: 200 },
				minWidth: '28px',
				minHeight: '31.5px',
				position: 'relative',
			}}
			alt='Potion'
			src={rewardMatch}
			height='100%'
			width='100%'
		/>
	)
}

export const Cluster = ({
	title,
	data,
	isHtml,
}: {
	title: string
	data: string | number | JSX.Element
	isHtml: boolean
}) => (
	<>
		<Typography sx={{ marginTop: '25px' }} fontWeight='bold' variant='h6'>
			{title}
		</Typography>
		{isHtml && typeof data == 'string' ? (
			<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data) }} />
		) : (
			<Typography fontWeight='light' variant='body1'>
				{data}
			</Typography>
		)}
	</>
)

export function AssignmentContentStudent({
	children,
	assignment,
	assignmentType,
	isOpen,
	toggleIsOpen,
}: {
	children?: React.ReactNode
	assignment: Assignment
	assignmentType: 'Task' | 'Repeatable'
	isOpen: boolean
	toggleIsOpen: () => void
}) {
	return (
		<Box>
			<IconButton onClick={toggleIsOpen}>
				<OpenInNewIcon />
			</IconButton>
			<Dialog open={isOpen} onClose={toggleIsOpen}>
				<ModalTitle onClick={toggleIsOpen} text={`${assignmentType} overview`} />
				<StudentTaskModalBox>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<StudentBoxInModal>{children}</StudentBoxInModal>
						</Grid>
						<Grid item xs={6} marginTop={10}>
							{rewardPotion(assignment.reward)}
							<Typography fontWeight='light' variant='h6' fontFamily='Superscript' textAlign='left'>
								Potion Collection
							</Typography>
						</Grid>
					</Grid>
				</StudentTaskModalBox>
			</Dialog>
		</Box>
	)
}
