import { createTheme, styled } from '@mui/material/styles'
import { TableCell } from '@mui/material'

export const BlankTableCell = styled(TableCell)({
	margin: '1%',
	padding: '1%',
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
			},
		},
	},
})
