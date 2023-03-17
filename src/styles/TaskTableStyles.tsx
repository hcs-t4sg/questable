import { styled } from '@mui/material/styles'
import { TableCell, TableRow } from '@mui/material'

export const BlankTableCell = styled(TableCell)({
	margin: '1%',
	padding: '1%',
})

export const StyledTableRow = styled(TableRow)({
	'&:last-child td, &:last-child th': { border: 0 },
})
