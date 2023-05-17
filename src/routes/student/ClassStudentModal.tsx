import { PlayerWithEmail } from '../../types'
import { Cluster } from '../../components/student/AssignmentContentStudent'
import { useState } from 'react'
import { ClassStudentContent } from './ClassStudentContent'
import { levelUp } from '../../utils/helperFunctions'

export default function ClassStudentModal({ player }: { player: PlayerWithEmail }) {
	const [open, setOpen] = useState(false)

	const toggleOpen = () => {
		setOpen(!open)
	}

	return (
		<ClassStudentContent player={player} isOpen={open} toggleIsOpen={toggleOpen}>
			<Cluster title='Player Name' data={player.name} isHtml={false} />
			<Cluster title='Student Email' data={player.email} isHtml={false} />
			<Cluster title='Student Gold' data={`${player.money}g`} isHtml={false} />
			<Cluster title='Student Level' data={levelUp(player.xp)} isHtml={false} />
		</ClassStudentContent>
	)
}
