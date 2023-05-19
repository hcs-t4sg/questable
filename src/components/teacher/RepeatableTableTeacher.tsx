import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, Repeatable } from '../../types'
import { db } from '../../utils/firebase'
import RepeatableModalTeacher from './RepeatableModalTeacher'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteRepeatable } from '../../utils/mutations'

import { BlankTableCell, StyledTableRow } from '../../styles/TaskTableStyles'
import Loading from '../global/Loading'
import { useSnackbar } from 'notistack'
import { truncate } from '../../utils/helperFunctions'
import Fuse from 'fuse.js'

export default function RepeatableTableTeacher({
	classroom,
	searchInput,
}: {
	classroom: Classroom
	searchInput: string
}) {
	const { enqueueSnackbar } = useSnackbar()

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
		const repeatableCollectionRef = collection(db, `classrooms/${classroom.id}/repeatables`)
		const unsub = onSnapshot(repeatableCollectionRef, (snapshot) => {
			const r = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Repeatable))
			setOriginal(r)
			setRepeatables(r)
			newFuse(new Fuse(r, options))
		})
		return unsub
	}, [classroom])

	useEffect(() => {
		if (searchInput != '') {
			setRepeatables(fuse.search(searchInput).map((elem) => elem.item))
		} else {
			setRepeatables(original)
		}
	}, [searchInput])

	const handleDelete = (repeatable: Repeatable) => {
		if (window.confirm('Are you sure you want to delete this task?')) {
			deleteRepeatable(classroom.id, repeatable.id)
				.then(() => {
					enqueueSnackbar('Deleted repeatable!', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar(err.message, { variant: 'error' })
				})
		}
	}

	return (
		<Grid item xs={12}>
			{repeatables ? (
				<TableContainer component={Paper}>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<BlankTableCell />
								<TableCell>Task</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Max Completions</TableCell>
								<TableCell>Reward</TableCell>
								<BlankTableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{repeatables.map((repeatable) => (
								<StyledTableRow key={repeatable.id}>
									<TableCell>
										<RepeatableModalTeacher classroom={classroom} repeatable={repeatable} />
									</TableCell>
									<TableCell component='th' scope='row'>
										{repeatable.name}
									</TableCell>
									<TableCell>
										<div
											dangerouslySetInnerHTML={{
												__html: truncate(repeatable.description.replace(/<[^>]+>/g, ''), 40),
											}}
										/>
									</TableCell>
									<TableCell>{repeatable.maxCompletions}</TableCell>
									<TableCell>{`${repeatable.reward}g`}</TableCell>
									<TableCell align='right'>
										<IconButton onClick={() => handleDelete(repeatable)}>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</StyledTableRow>
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
