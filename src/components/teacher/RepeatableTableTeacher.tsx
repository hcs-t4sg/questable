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
		const repeatableCollectionRef = collection(db, `classrooms/${classroom.id}/repeatables`)
		// Attach a listener to the tasks collection
		const unsub = onSnapshot(repeatableCollectionRef, (snapshot) => {
			// Store the tasks in the `tasks` state variable
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
		// message box to confirm deletion
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
								// <TableRow key={task.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<StyledTableRow key={repeatable.id}>
									<TableCell>
										<RepeatableModalTeacher classroom={classroom} repeatable={repeatable} />
									</TableCell>
									{/* <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0, width: .01 }} align="left">
                           <RepeatableModalTeacher task={repeatable} classroom={classroom} />
                        </TableCell> */}

									<TableCell component='th' scope='row'>
										{repeatable.name}
									</TableCell>
									{/* <TableCell>{truncate(repeatable.description)}</TableCell> */}
									<TableCell>
										{' '}
										<div
											dangerouslySetInnerHTML={{
												__html: truncate(repeatable.description.replace(/<[^>]+>/g, '')),
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
								// </TableRow>
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
