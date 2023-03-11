import React from 'react'
import { Classroom, Player } from '../../types'

export default function ForumPost({ player, classroom }: { player: Player; classroom: Classroom }) {
	return (
		<div>
			ForumPost{player.id}
			{classroom.id}
		</div>
	)
}
