import React from 'react'
import { Classroom, Player } from '../../types'

export default function ClassDiscussion({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	return (
		<div>
			<div>Class Discussion</div>
			<div>Player:{player.name}</div>
			<div>Classroom:{classroom.name}</div>
		</div>
	)
}
