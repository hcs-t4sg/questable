import React from 'react'
import { Classroom, Player } from '../../types'

export default function Assignments({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	return (
		<div>
			<div>Assignments</div>
			<div>Player:{player.name}</div>
			<div>Classroom:{classroom.name}</div>
		</div>
	)
}
