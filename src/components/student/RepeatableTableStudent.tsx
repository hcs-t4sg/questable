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
// import RepeatableModalStudent from './RepeatableModalStudent'
import Loading from '../global/Loading'
import { truncate } from '../../utils/helperFunctions'
import RepeatableModalStudent from './RepeatableModalStudent'
import { rewardPotion } from './AssignmentContentStudent'
import Fuse from 'fuse.js'

import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify(window)
// export function truncate(description: string) {
// 	if (description.length > 50) {
// 		return description.slice(0, 50) + '...'
// 	}
// 	return description
// }

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
			<TableCell>{rewardPotion(repeatable.reward)}</TableCell>
			<TableCell component='th' scope='row'>
				{repeatable.name}
			</TableCell>
			{/* <TableCell align='left'>{truncate(repeatable.description)}</TableCell> */}
			<TableCell>
				{' '}
				<div
					dangerouslySetInnerHTML={{ __html: truncate(DOMPurify.sanitize(repeatable.description)) }}
				/>
			</TableCell>
			<TableCell align='left'>
				{completions || completions === 0 ? `${completions}` : 'Loading'}
			</TableCell>
			<TableCell align='left'>
				{confirmations || confirmations === 0 ? `${confirmations}` : 'Loading'}
			</TableCell>
			<TableCell align='left'>{repeatable.maxCompletions}</TableCell>
			<TableCell align='left'>{`${repeatable.reward}g`}</TableCell>

			<TableCell align='right' sx={{ width: 0.01 }}>
				<RepeatableModalStudent
					classroom={classroom}
					player={player}
					repeatable={repeatableWithPlayerData}
				/>
			</TableCell>
		</TableRow>
	)
}

export default function RepeatableTableStudent({
	classroom,
	player,
	searchInput,
}: {
	classroom: Classroom
	player: Player
	searchInput: string
}) {
	// Create a state variable to hold the tasks
	const [original, setOriginal] = useState<Repeatable[] | null>(null)
	const [repeatables, setRepeatables] = useState<Repeatable[] | null>(null)
	const [fuse, newFuse] = useState(new Fuse<Repeatable>([]))

	const options = {
		keys: ['name', 'description'],
		includeScore: true,
		threshold: 0.4,
		minMatchCharLength: 3,
	}

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
			newFuse(new Fuse(repeatablesList, options))
			setOriginal(repeatablesList)
			setRepeatables(repeatablesList)
		})
		return unsub
	}, [classroom, player])

	useEffect(() => {
		if (searchInput != '') {
			setRepeatables(fuse.search(searchInput).map((elem) => elem.item))
		} else {
			setRepeatables(original)
		}
	}, [searchInput])

	return (
		<Grid item xs={12}>
			{repeatables ? (
				<TableContainer component={Paper}>
					<Table aria-label='simple table' sx={{ border: 'none' }}>
						<TableHead>
							<TableRow>
								<TableCell sx={{ width: 60 }} />
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Pending Completions</TableCell>
								<TableCell>Confirmed Completions</TableCell>
								<TableCell>Max completions</TableCell>
								<TableCell>Reward </TableCell>
								<TableCell>Open</TableCell>
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
