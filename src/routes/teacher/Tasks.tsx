import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import * as React from 'react'
import CreateTaskModal from '../../components/teacher/CreateTaskModal'
import TasksTableTeacher from '../../components/teacher/TasksTableTeacher'

import { Tab, Tabs } from '@mui/material'
import RepeatableTableTeacher from '../../components/teacher/RepeatableTableTeacher'
import { Classroom, Player } from '../../types'

export default function Tasks({ player, classroom }: { player: Player; classroom: Classroom }) {
	//   const [teacher, setTeacher] = React.useState();

	const [page, setPage] = React.useState(0)
	// Pages:
	// (0): Tasks
	// (1): Repeatables

	//   React.useEffect(() => {
	//     // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
	//     const playersRef = collection(db, `classrooms/${classroom.id}/players`);
	//     const teacherQuery = query(playersRef, where("role", "==", "teacher"));

	//     //Attach a listener to the teacher document
	//     onSnapshot(teacherQuery, (snapshot) => {
	//       const mapTeacher = async () => {
	//         const teacher = await Promise.all(
	//           snapshot.docs.map(async (player) => {
	//             const email = (await getUserData(player.id)).email;
	//             return { ...player.data(), id: player.id, email: email };
	//           })
	//         )[0];
	//         setTeacher(teacher);
	//       };

	//       // Call the async `mapTeacher` function
	//       mapTeacher().catch(console.error);
	//     });
	//   }, []);

	const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
		setPage(newTabIndex)
	}

	const getTable = () => {
		if (page === 0) {
			return <TasksTableTeacher classroom={classroom} />
		} else if (page === 1) {
			return <RepeatableTableTeacher classroom={classroom} />
		}
	}

	return (
		<Grid container spacing={3} sx={{ p: 5 }}>
			<Grid item xs={12}>
				<Typography variant='h2' component='div'>
					{classroom.name}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Card sx={{ width: 1 }}>
					<CardContent>
						<Typography variant='h5' component='div'>
							{player.name}
						</Typography>{' '}
						{/* Do we want a separate user name?*/}
						<Typography variant='h5' component='div'>
							{classroom.playerList.length} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Typography variant='h5'>Create a New Task</Typography>
				<CreateTaskModal classroom={classroom} player={player} />
			</Grid>

			<Grid item xs={12}>
				<Typography variant='h5'>View and Edit Tasks</Typography>
				<Tabs value={page} onChange={handleTabChange}>
					<Tab label='One Time' />
					<Tab label='Repeatable' />
				</Tabs>
				{getTable()}
			</Grid>
		</Grid>
	)
}
