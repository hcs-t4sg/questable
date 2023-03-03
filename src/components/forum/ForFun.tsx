import React from 'react'
import { Classroom, Player } from '../../types'

export default function ForFun({ player, classroom }: { player: Player; classroom: Classroom }) {
	return (
		<div>
			<div>For Fun</div>
			<div>Player:{player.name}</div>
			<div>Classroom:{classroom.name}</div>
		</div>
	)
}
