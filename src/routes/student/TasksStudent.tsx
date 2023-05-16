import { Grid, Tab, Tabs, Stack, Box, TextField, useMediaQuery } from '@mui/material'
import { collection, onSnapshot, query } from 'firebase/firestore'
import * as React from 'react'
import { useEffect, useState } from 'react'
import RepeatableTableStudent from '../../components/student/RepeatableTableStudent'
import TasksTableStudent from '../../components/student/TasksTableStudent'
import { Classroom, Player, TaskWithStatus } from '../../types'
import { db } from '../../utils/firebase'
import Loading from '../../components/global/Loading'

// TODO Rewrite this component, it's very inefficient and unmaintainable
interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

export default function TasksStudent({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	const [assigned, setAssigned] = useState<TaskWithStatus[] | null>(null)
	const [completed, setCompleted] = useState<TaskWithStatus[] | null>(null)
	const [confirmed, setConfirmed] = useState<TaskWithStatus[] | null>(null)
	//   const [filter, setFilter] = useState("all");
	//   const [filteredTasks, setFilteredTasks] = useState(null);
	const [overdue, setOverdue] = useState<TaskWithStatus[] | null>(null)
	const [searchInput, setSearchInput] = useState('')

	const [taskRepTab, setTaskRepTab] = useState<0 | 1>(0)

	const mobile = useMediaQuery('(max-width:400px')

	const handleChangeTaskRep = (event: React.SyntheticEvent, newValue: 0 | 1) => {
		setTaskRepTab(newValue)
	}

	// useEffect to fetch task information
	useEffect(() => {
		// fetch task information
		const q = query(collection(db, `classrooms/${classroom.id}/tasks`))
		const unsub = onSnapshot(q, (snapshot) => {
			const assigned: TaskWithStatus[] = []
			const completed: TaskWithStatus[] = []
			const confirmed: TaskWithStatus[] = []
			const overdue: TaskWithStatus[] = []

			console.log(snapshot.docs)

			// TODO rewrite using Promise.all
			snapshot.forEach((doc) => {
				// if task is overdue, add to overdue list

				if (doc.data().due.toDate() < new Date()) {
					overdue.push(Object.assign({ id: doc.id, status: 3 }, doc.data()) as TaskWithStatus)
				}
				// Find assigned, completed, and confirmed tasks using player's id.
				else if (doc.data().assigned?.includes(player.id)) {
					assigned.push(Object.assign({ id: doc.id, status: 0 }, doc.data()) as TaskWithStatus)
				} else if (doc.data().completed?.includes(player.id)) {
					completed.push(Object.assign({ id: doc.id, status: 1 }, doc.data()) as TaskWithStatus)
				} else if (doc.data().confirmed?.includes(player.id)) {
					confirmed.push(Object.assign({ id: doc.id, status: 2 }, doc.data()) as TaskWithStatus)
				}
			})
			console.log(assigned)
			setAssigned(assigned)
			setCompleted(completed)
			setConfirmed(confirmed)
			setOverdue(overdue)
		})
		return unsub
	}, [classroom.id, player.id])

	return (
		<Grid item xs={12}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Stack
					sx={{ display: 'flex', justifyContent: 'space-between' }}
					direction={!mobile ? 'row' : 'column'}
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
				{assigned && completed && confirmed && overdue ? (
					<TasksTableStudent
						assigned={assigned}
						completed={completed}
						confirmed={confirmed}
						overdue={overdue}
						classroom={classroom}
						player={player}
						searchInput={searchInput}
					/>
				) : (
					<Loading>Loading tasks...</Loading>
				)}
			</TabPanel>
			<TabPanel value={taskRepTab} index={1}>
				<RepeatableTableStudent searchInput={searchInput} classroom={classroom} player={player} />
			</TabPanel>
		</Grid>
	)
}
