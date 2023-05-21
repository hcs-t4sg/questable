import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material'
import { Player } from '../../types'

import { LeftBoxInModal, ModalTitle } from '../../styles/ModalStyles'
import { currentAvatar } from '../../utils/items'
import Avatar from './Avatar'

// Wrapper displaying role-agnostic player information in player modals in Class pages.
// Modal titles and the player avatar are universally available, whereas teacher and students have differing access to other details (ex: name, email, gold, etc) which are passed in as children

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
				<ModalTitle onClick={toggleIsOpen} text={'Adventurer Info'} />
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item md={7}>
							<LeftBoxInModal>{children}</LeftBoxInModal>
						</Grid>
						<Grid item xs={5} marginTop={9} marginBottom={3}>
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
				</DialogContent>
			</Dialog>
		</Box>
	)
}
