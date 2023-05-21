import { PlayerWithEmail } from '../../types'
import { Cluster } from '../global/Cluster'
import { useState } from 'react'
import { PlayerInfoModalWrapper } from '../global/PlayerInfoModalWrapper'
import { levelUp } from '../../utils/helperFunctions'

// Detailed modal for a particular player in Student class page

export default function ClassStudentModal({ player }: { player: PlayerWithEmail }) {
	const [open, setOpen] = useState(false)

	const toggleOpen = () => {
		setOpen(!open)
	}

	return (
		<PlayerInfoModalWrapper player={player} isOpen={open} toggleIsOpen={toggleOpen}>
			<Cluster title='Player Name' data={player.name} isHtml={false} />
			<Cluster title='Student Email' data={player.email} isHtml={false} />
			<Cluster title='Student Gold' data={`${player.money}g`} isHtml={false} />
			<Cluster title='Student Level' data={levelUp(player.xp)} isHtml={false} />
		</PlayerInfoModalWrapper>
	)
}
