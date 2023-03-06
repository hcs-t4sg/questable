import { createTheme, styled } from '@mui/material/styles'
import { TableCell, TableRow } from '@mui/material'

export const BlankTableCell = styled(TableCell)({
	margin: '1%',
	padding: '1%',
})

export const StyledTableRow = styled(TableRow)({
	'&:last-child td, &:last-child th': { border: 0 },
})

export const tableTheme = createTheme({
	components: {
		MuiTable: {
			styleOverrides: {
				root: {
					minWidth: 650,
				},
			},
		},
		// MuiTableContainer: {
		// 	defaultProps: {
		// 		component: Paper, // idk why this is an error but it still works...
		// 	},
		// },
		MuiTableCell: {
			defaultProps: {
				align: 'left',
				// width: 0.01,
			},
		},
		MuiButton: {
			defaultProps: {
				variant: 'contained',
			},
		},
	},
})
