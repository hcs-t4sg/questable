import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, Player, RepeatableWithCompletionCount } from '../../types'
import { db } from '../../utils/firebase'
import { getRepeatableCompletionCount } from '../../utils/mutations'
import RepeatableModalStudent from './RepeatableModalStudent'

function truncate(description: string) {
	if (description.length > 50) {
		return description.slice(0, 50) + '...'
	}
	return description
}

export default function RepeatableTableStudent({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	// Create a state variable to hold the tasks
	const [repeatables, setRepeatables] = useState<RepeatableWithCompletionCount[]>([])
	useEffect(() => {
		// Create a reference to the tasks collection
		const repeatableCollectionRef = query(
			collection(db, `classrooms/${classroom.id}/repeatables`),
			where('assigned', 'array-contains', player.id),
		)
		// Attach a listener to the tasks collection
		const unsub = onSnapshot(repeatableCollectionRef, (snapshot) => {
			const mapRepeatables = async () => {
				const repeatables = await Promise.all(
					snapshot.docs.map(async (repeatableDoc) => {
						const completionCount = await getRepeatableCompletionCount(
							classroom.id,
							repeatableDoc.id,
							player.id,
						)
						console.log(completionCount)
						if (!(completionCount || completionCount === 0)) {
							throw new Error('Completion count does not exist')
						}
						return {
							...repeatableDoc.data(),
							id: repeatableDoc.id,
							completions: completionCount,
						} as RepeatableWithCompletionCount
					}),
				)

				setRepeatables(repeatables)
			}

			// // Store the tasks in the `tasks` state variable
			// setRepeatables(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Repeatable)))
			mapRepeatables().catch(console.error)
		})
		return unsub
	}, [classroom, player])

	return (
		<Grid item xs={12}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Task</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Completions</TableCell>
							<TableCell>Reward </TableCell>
							<TableCell sx={{ m: '1%', p: '1%' }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{repeatables?.map((repeatable) => (
							<TableRow
								key={repeatable.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component='th' scope='row'>
									{repeatable.name}
								</TableCell>
								<TableCell align='left'>{truncate(repeatable.description)}</TableCell>
								<TableCell align='left'>{`${repeatable.completions}/${repeatable.maxCompletions}`}</TableCell>
								<TableCell align='left'>{repeatable.reward}</TableCell>

								<TableCell align='right' sx={{ width: 0.01 }}>
									<RepeatableModalStudent
										classroom={classroom}
										repeatable={repeatable}
										player={player}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	)
}
