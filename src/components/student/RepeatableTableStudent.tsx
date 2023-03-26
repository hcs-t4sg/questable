import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, Player, Repeatable } from '../../types'
import { db } from '../../utils/firebase'
import RepeatableModalStudent from './RepeatableModalStudent'
import Loading from '../global/Loading'

function truncate(description: string) {
	if (description.length > 50) {
		return description.slice(0, 50) + '...'
	}
	return description
}

function RepeatableTableRow({
	repeatable,
	classroom,
	player,
}: {
	repeatable: Repeatable
	classroom: Classroom
	player: Player
}) {
	const [completions, setCompletions] = useState<number | null>(null)
	const [confirmations, setConfirmations] = useState<number | null>(null)
	useEffect(() => {
		const completionsRef = doc(
			db,
			`classrooms/${classroom.id}/repeatables/${repeatable.id}/playerCompletions`,
			player.id,
		)
		const unsub = onSnapshot(completionsRef, (doc) => {
			if (doc.exists()) {
				setCompletions(doc.data().completions)
			}
		})
		return unsub
	}, [repeatable, classroom, player])

	useEffect(() => {
		const confirmationsRef = doc(
			db,
			`classrooms/${classroom.id}/repeatables/${repeatable.id}/playerConfirmations`,
			player.id,
		)
		const unsub = onSnapshot(confirmationsRef, (doc) => {
			if (doc.exists()) {
				setConfirmations(doc.data().confirmations)
			}
		})
		return unsub
	}, [repeatable, classroom, player])

	const repeatableWithPlayerData = {
		...repeatable,
		completions: completions ?? 0,
		confirmations: confirmations ?? 0,
	}

	return (
		<TableRow key={repeatable.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
			<TableCell component='th' scope='row'>
				{repeatable.name}
			</TableCell>
			<TableCell align='left'>{truncate(repeatable.description)}</TableCell>
			<TableCell align='left'>
				{completions || completions === 0 ? `${completions}` : 'Loading'}
			</TableCell>
			<TableCell align='left'>
				{confirmations || confirmations === 0 ? `${confirmations}` : 'Loading'}
			</TableCell>
			<TableCell align='left'>{repeatable.reward}</TableCell>

			<TableCell align='right' sx={{ width: 0.01 }}>
				<RepeatableModalStudent
					classroom={classroom}
					repeatable={repeatableWithPlayerData}
					player={player}
				/>
			</TableCell>
		</TableRow>
	)
}

export default function RepeatableTableStudent({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	// Create a state variable to hold the tasks
	const [repeatables, setRepeatables] = useState<Repeatable[] | null>(null)
	useEffect(() => {
		// Create a reference to the tasks collection
		const repeatableCollectionRef = query(
			collection(db, `classrooms/${classroom.id}/repeatables`),
			where('assigned', 'array-contains', player.id),
		)
		// Attach a listener to the tasks collection
		const unsub = onSnapshot(repeatableCollectionRef, (snapshot) => {
			const repeatablesList = snapshot.docs.map(
				(doc) =>
					({
						...doc.data(),
						id: doc.id,
					} as Repeatable),
			)

			setRepeatables(repeatablesList)
		})
		return unsub
	}, [classroom, player])

	return (
		<Grid item xs={12}>
			{repeatables ? (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>Task</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Pending Completions</TableCell>
								<TableCell>Confirmed Completions</TableCell>
								<TableCell>Reward </TableCell>
								<TableCell sx={{ m: '1%', p: '1%' }}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{repeatables.map((repeatable) => (
								<RepeatableTableRow
									key={repeatable.id}
									repeatable={repeatable}
									classroom={classroom}
									player={player}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Loading>Loading repeatables...</Loading>
			)}
		</Grid>
	)
}
