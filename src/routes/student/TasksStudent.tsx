import { Box, Grid, Stack, Tab, Tabs, TextField, useMediaQuery, useTheme } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import { TabPanel, a11yProps } from '../../components/global/Tabs'
import RepeatableTableStudent from '../../components/student/RepeatableTableStudent'
import TasksTableStudent from '../../components/student/TasksTableStudent'
import { Classroom, Player } from '../../types'

// Route for displaying student tasks and repeatables

export default function TasksStudent({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	const [searchInput, setSearchInput] = useState('')

	const [taskRepTab, setTaskRepTab] = useState<0 | 1>(0)

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	const handleChangeTaskRep = (event: React.SyntheticEvent, newValue: 0 | 1) => {
		setTaskRepTab(newValue)
	}

	return (
		<Grid item xs={12}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Stack
					sx={{ display: 'flex', justifyContent: 'space-between' }}
					direction={!mobile ? 'row' : 'column'}
					spacing={!mobile ? 0 : 2}
				>
					<Tabs value={taskRepTab} onChange={handleChangeTaskRep} aria-label='Task/repeatable tabs'>
						<Tab label='Tasks' {...a11yProps(0)} />
						<Tab label='Repeatables' {...a11yProps(1)} />
					</Tabs>
					<TextField
						id='standard-basic'
						label='Search'
						variant='standard'
						onChange={(event) => setSearchInput(event.target.value)}
						sx={{ mt: -1 }}
					/>
				</Stack>
			</Box>
			<TabPanel value={taskRepTab} index={0}>
				<TasksTableStudent classroom={classroom} player={player} searchInput={searchInput} />
			</TabPanel>
			<TabPanel value={taskRepTab} index={1}>
				<RepeatableTableStudent searchInput={searchInput} classroom={classroom} player={player} />
			</TabPanel>
		</Grid>
	)
}
