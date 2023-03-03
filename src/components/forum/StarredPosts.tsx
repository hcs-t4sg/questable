import React from 'react'
import { Classroom, Player } from '../../types'

export default function StarredPosts({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	return (
		<div>
			<div>Starred Posts</div>
			<div>Player:{player.name}</div>
			<div>Classroom:{classroom.name}</div>
		</div>
	)
}
