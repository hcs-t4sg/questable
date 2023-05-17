import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Dialog, Grid, IconButton } from '@mui/material'
import { Player } from '../../types'

import { ModalTitle, StudentBoxInModal, StudentTaskModalBox } from '../../styles/TaskModalStyles'
import Avatar from './Avatar'
import { currentAvatar } from '../../utils/items'

export function PlayerInfoModalWrapper({
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
			<Dialog open={isOpen} onClose={toggleIsOpen}>
				<StudentTaskModalBox>
					<ModalTitle onClick={toggleIsOpen} text={'Adventurer'} />
					<Grid container spacing={2}>
						<Grid item md={6}>
							<StudentBoxInModal>{children}</StudentBoxInModal>
						</Grid>
						<Grid item xs={6} marginTop={9} marginBottom={3}>
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
			</Dialog>
		</Box>
	)
}
