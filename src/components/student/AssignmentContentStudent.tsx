import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Grid, IconButton, Dialog, Typography } from '@mui/material'
import { ModalTitle, LeftBoxInModal, StudentTaskModalBox } from '../../styles/ModalStyles'
import { Assignment } from '../../types'
import { assignmentPotion } from '../../utils/items'

import createDOMPurify from 'dompurify'
export const DOMPurify = createDOMPurify(window)

// Displays content of an assignment (task/repeatable) as part of the detailed modal for that assignment

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
							<LeftBoxInModal>{children}</LeftBoxInModal>
						</Grid>
						<Grid item xs={6} marginTop={10}>
							{assignmentPotion(assignment.reward)}
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
