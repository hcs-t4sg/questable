// import Grid from '@mui/material/Grid'
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
// import TableContainer from '@mui/material/TableContainer'
// import TableHead from '@mui/material/TableHead'
// import TableRow from '@mui/material/TableRow'
// import { Classroom, Player, RepeatableWithPlayerCompletions } from '../../types'

// export default function RepeatablesTableStudent({
// 	repeatables,
// 	classroom,
// 	player,
// }: {
// 	repeatables: RepeatableWithPlayerCompletions[]
// 	classroom: Classroom
// 	player: Player
// }) {
// 	return (
// 		<Grid item xs={12}>
// 			<TableContainer sx={{ backgroundColor: 'white' }}>
// 				<Table aria-label='simple table' sx={{ border: 'none' }}>
// 					<TableHead>
// 						<TableRow>
// 							<TableCell>Name</TableCell>
// 							<TableCell>Description</TableCell>
// 							<TableCell align='center'>Reward Amount</TableCell>
// 							<TableCell align='center'>Completions</TableCell>
// 						</TableRow>
// 					</TableHead>
// 					<TableBody>
// 						{repeatables.map((repeatable) => (
// 							<TableRow
// 								key={repeatable.id}
// 								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
// 							>
// 								<TableCell align='left'>{repeatable.name}</TableCell>
// 								<TableCell align='left'>{repeatable.description || 'None'}</TableCell>
// 								<TableCell align='center'>${repeatable.reward}</TableCell>
// 								<TableCell align='center'>Test</TableCell>
// 							</TableRow>
// 						))}
// 					</TableBody>
// 				</Table>
// 			</TableContainer>
// 		</Grid>
// 	)
// }
