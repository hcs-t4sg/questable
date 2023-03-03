import { Grid } from '@mui/material'
import React from 'react'
import { Classroom, Player } from '../../types'
import Layout from '../global/Layout'

export default function ForumPost({ player, classroom }: { player: Player; classroom: Classroom }) {
	return (
		<Layout>
			<Grid sx={{ width: '50%', height: '100%', backgroundColor: 'red' }}>
				<div>Player: {player.name}</div>
				<div>Classroom: {classroom.name}</div>
			</Grid>
			<Grid></Grid>
		</Layout>
	)
}
