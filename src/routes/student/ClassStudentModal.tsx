import { PlayerWithEmail } from '../../types'
import { Cluster } from '../../components/student/AssignmentContentStudent'
import { useState } from 'react'
import { ClassStudentContent } from './ClassStudentContent'

export default function ClassStudentModal({ player }: { player: PlayerWithEmail }) {
	const [open, setOpen] = useState(false)

	const toggleOpen = () => {
		setOpen(!open)
	}

	return (
		<ClassStudentContent player={player} isOpen={open} toggleIsOpen={toggleOpen}>
			<Cluster title='Student Name' data={player.name} />
			<Cluster title='Student Email' data={player.email} />
			<Cluster title='Student Gold' data={`${player.money}g`} />
		</ClassStudentContent>
	)
}
