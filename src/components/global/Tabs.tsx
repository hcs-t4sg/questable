import { Box } from '@mui/material'
import React from 'react'

// Basic tabs component from MUI documentation used in several places throughout the app
// https://mui.com/material-ui/react-tabs/

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

export function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	)
}

export function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}
