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

function truncate(description: string) {
	if (description.length > 50) {
		return description.slice(0, 50) + '...'
	}
	return description
}

export default function RepeatableTableTeacher({ classroom }: { classroom: Classroom }) {
	// Create a state variable to hold the tasks
	const [repeatables, setRepeatables] = useState<Repeatable[]>([])
	useEffect(() => {
		// Create a reference to the tasks collection
		const repeatableCollectionRef = collection(db, `classrooms/${classroom.id}/repeatables`)
		// Attach a listener to the tasks collection
		const unsub = onSnapshot(repeatableCollectionRef, (snapshot) => {
			// Store the tasks in the `tasks` state variable
			setRepeatables(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Repeatable)))
		})
		return unsub
	}, [classroom])

	return (
		<Grid item xs={12}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Task</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Max Completions</TableCell>
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
								{/* <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0, width: .01 }} align="left">
                           <RepeatableModalTeacher task={repeatable} classroom={classroom} />
                        </TableCell> */}

								<TableCell component='th' scope='row'>
									{repeatable.name}
								</TableCell>
								<TableCell align='left'>{truncate(repeatable.description)}</TableCell>
								<TableCell align='left'>{repeatable.maxCompletions}</TableCell>
								<TableCell align='left'>{repeatable.reward}</TableCell>

								<TableCell align='right' sx={{ width: 0.01 }}>
									<RepeatableModalTeacher classroom={classroom} repeatable={repeatable} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	)
}
