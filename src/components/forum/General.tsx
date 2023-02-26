import React from 'react'
import { Classroom, Player } from '../../types'

export default function General({ player, classroom }: { player: Player; classroom: Classroom }) {
	return (
		<div>
			<div>General</div>
			<div>Player:{player.name}</div>
			<div>Classroom:{classroom.name}</div>
		</div>
	)
}
