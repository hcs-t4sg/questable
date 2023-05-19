import ConfirmationTables from '../../components/teacher/ConfirmationTables'

import { Classroom, Player } from '../../types'

export default function Requests({ classroom, player }: { classroom: Classroom; player: Player }) {
	return <ConfirmationTables classroom={classroom} player={player} />
}
