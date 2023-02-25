// import DeleteIcon from '@mui/icons-material/Delete'
// import { LinearProgress } from '@mui/material'
// import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// import TaskModalTeacher from '../teacher/TaskModalTeacher'

export function TaskTable() {
	return (
		<>
			<Grid item xs={12}>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow>{/* PROPS */}</TableRow>
						</TableHead>
						<TableBody>{/* PROPS */}</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</>
	)
}
