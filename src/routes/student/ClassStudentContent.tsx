import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Grid, IconButton, Modal } from '@mui/material'
import { Player } from '../../types'

import { ModalTitle, StudentBoxInModal, StudentTaskModalBox } from '../../styles/TaskModalStyles'
import Avatar from '../../components/global/Avatar'
import { currentAvatar } from '../../utils/items'

export function ClassStudentContent({
	children,
	player,
	isOpen,
	toggleIsOpen,
}: {
	children?: React.ReactNode
	player: Player
	isOpen: boolean
	toggleIsOpen: () => void
}) {
	return (
		<Box>
			<IconButton onClick={toggleIsOpen}>
				<OpenInNewIcon />
			</IconButton>
			<Modal sx={{ overflow: 'scroll' }} open={isOpen} onClose={toggleIsOpen}>
				<StudentTaskModalBox>
					<ModalTitle onClick={toggleIsOpen} text={'Adventurer'} />
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<StudentBoxInModal>{children}</StudentBoxInModal>
						</Grid>
						<Grid item xs={6} marginTop={6} marginBottom={3}>
							<Box
								sx={{
									height: 150,
									width: 150,
								}}
							>
								<Avatar outfit={currentAvatar(player)} />
							</Box>
						</Grid>
					</Grid>
				</StudentTaskModalBox>
			</Modal>
		</Box>
	)
}
