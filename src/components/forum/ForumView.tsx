import { Classroom, Player } from '../../types'
import Layout from '../global/Layout'
import { Button, Grid, List, ListItem, ListItemButton } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useState } from 'react'
import ForumPostsModal from './ForumPostsModal'

export default function ForumView({ player, classroom }: { player: Player; classroom: Classroom }) {
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState('general')

	const handleClickNT = () => {
		setOpen(true)
	}

	const isSelected = (str: string) => {
		return selected == str
	}

	return (
		<Layout>
			<Grid>
				<Button onClick={handleClickNT} variant='contained' disableElevation>
					<EditOutlinedIcon />
					New Thread
				</Button>
				<h1>Categories</h1>
				<Grid container>
					<Grid item sm={3} sx={{ width: '100%' }}>
						<List>
							<ListItem>
								<ListItemButton
									onClick={() => setSelected('General')}
									selected={isSelected('General')}
								>
									General
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									onClick={() => setSelected('Assignment')}
									selected={isSelected('Assignment')}
								>
									Assignment
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									onClick={() => setSelected('For Fun')}
									selected={isSelected('For Fun')}
								>
									For Fun
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									onClick={() => setSelected('Starred')}
									selected={isSelected('Starred')}
								>
									Starred
								</ListItemButton>
							</ListItem>
						</List>
					</Grid>
				</Grid>
			</Grid>
			<Grid>
				{/* Forum Posts Displayed Here */}
				<ForumPostsModal
					player={player}
					classroom={classroom}
					onClose={() => setOpen(false)}
					isOpen={open}
				/>
			</Grid>
		</Layout>
	)
}
