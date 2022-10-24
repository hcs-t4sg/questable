import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CompletedTasks from './CompletedTasks';

import React from "react";

import TasksTableStudent from './TasksTableStudent';

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../utils/firebase';
import { getUserData } from '../utils/mutations';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


export default function StudentView({ player, classroom }) {

    const [students, setStudents] = React.useState([]);
    const [teacher, setTeacher] = React.useState()

    React.useEffect(() => {

        // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
        const playersRef = collection(db, `classrooms/${classroom.id}/players`);
        const playerQuery = query(playersRef);

        //Attach a listener to the teacher document
        onSnapshot(playerQuery, (snapshot) => {
            const mapTeacher = async () => {

                let players = await Promise.all(snapshot.docs.map(async (player) => {
                    const email = (await getUserData(player.id)).email;
                    return { ...player.data(), id: player.id, email: email };
                }))

                // Await the resolution of all promises in the returned array
                // and then store them in the `students` state variable
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
                for (let i = 0; i < players.length; i++) {
                    if (players[i].role == "teacher") {
                        setTeacher(players[i]);
                        players.splice(i, 1);
                    }
                }
                setStudents(players);
            }
            // Call the async `mapTeacher` function
            mapTeacher().catch(console.error);
        })
    }, []);

   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h1">{classroom.name}</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h2">Student View</Typography>
            <Typography variant="h3">{player.name}</Typography>
         </Grid>
         <TasksTableStudent player={player} classroom={classroom} />
         <CompletedTasks player={player} classroom={classroom} />
         <Card>
                <CardContent>
                    <Typography variant="body1">Teacher: {teacher?.name}</Typography>
                    <Typography variant="body1">Email: {teacher?.email}</Typography>
                </CardContent>
            </Card>

            {students?.map((student)=>(
                <Card>
                <CardContent>
                    <Typography variant="body1">Avatar: {student.avatar}</Typography>
                    <Typography variant="body1">Name: {student.name}</Typography>
                    <Typography variant="body1">Email: {student.email}</Typography>
                </CardContent>
                </Card>
            ))}
      </Grid>
   )
}