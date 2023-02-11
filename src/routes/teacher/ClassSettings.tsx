import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import PlayerCard from '../../components/teacher/PlayerCard'

import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../utils/firebase'

import { User } from 'firebase/auth'
import { useState } from 'react'
import { Classroom, Player } from '../../types'

export default function ClassSettings({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	const [numStudents, setNumStudents] = useState<number | null>(null)

	const classroomRef = doc(db, `classrooms/${classroom.id}`)
	onSnapshot(classroomRef, (doc) => {
		if (doc.exists()) {
			setNumStudents(doc.data().playerList.length)
		}
	})
	//   const [teacher, setTeacher] = React.useState();

	//   useEffect(() => {
	//     // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
	//     const playersRef = collection(db, `classrooms/${classroom.id}/players`);
	//     const teacherQuery = query(playersRef, where("role", "==", "teacher"));

	//     //Attach a listener to the teacher document
	//     onSnapshot(teacherQuery, (snapshot) => {
	//       const mapTeacher = async () => {
	//         let teachers = await Promise.all(
	//           snapshot.docs.map(async (player) => {
	//             const email = (await getUserData(player.id)).email;
	//             return { ...player.data(), id: player.id, email: email };
	//           })
	//         );

	//         // Await the resolution of all promises in the returned array
	//         // and then store them in the `students` state variable
	//         // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
	//         console.log("yeet");
	//         console.log(teachers);
	//         setTeacher(teachers[0]);
	//       };

	//       // Call the async `mapTeacher` function
	//       mapTeacher().catch(console.error);
	//     });
	//   }, []);

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
							{numStudents} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12}>
				<Typography variant='h5'>Teacher Profile</Typography>
				<PlayerCard player={player} user={user} classroom={classroom} />
			</Grid>
		</Grid>
	)
}
